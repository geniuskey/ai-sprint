import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createStore } from '../server/store.mjs';
import { createApp, validateBackup } from '../server/app.mjs';
import { updateProgress, selectExamQuestions, EXAM_DATE } from '../server/learning.mjs';
const catalog={concepts:Array.from({length:28},(_,i)=>({id:`concept-${i}`})),questions:Array.from({length:56},(_,i)=>({id:`q-${i}`,conceptId:`concept-${Math.floor(i/2)}`,category:'ABCDEFG'[Math.floor(i/2)%7],type:i%2?'application':'recall',prompt:`문제 ${i}`,options:['a','b','c','d'],correctIndex:i%4,explanations:['설명 a','설명 b','설명 c','설명 d']})),scenarios:[]};
async function setup(t) {
  const directory=mkdtempSync(path.join(os.tmpdir(),'ai-sprint-test-'));
  const store=createStore(path.join(directory,'test.sqlite'));
  let time=Date.parse('2026-10-13T12:00:00Z');
  const app=createApp({store,catalog,dataDir:directory,now:()=>time});
  const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  const base=`http://127.0.0.1:${server.address().port}`;
  const request=async(route,method='GET',body,extra={})=>{
    const res=await fetch(base+route,{method,headers:{'Content-Type':'application/json',...extra},body:body===undefined?undefined:JSON.stringify(body)});
    const json=await res.json();return {status:res.status,json,headers:res.headers};
  };
  t.after(async()=>{await new Promise(r=>server.close(r));store.close();rmSync(directory,{recursive:true,force:true});});
  return {store,request,advance:ms=>time+=ms,directory,base};
}
test('review is explainable, exam-aware and self ratings do not fake mastery',()=>{
  const p=updateProgress(null,{conceptId:'rag',correct:false,now:EXAM_DATE-86400000});
  assert.equal(p.mastery,0);assert.equal(Date.parse(p.nextReview)-Date.parse(p.lastStudied),600000);
  let good=p;for(let i=0;i<5;i++)good=updateProgress(good,{conceptId:'rag',correct:true,now:EXAM_DATE-86400000});
  assert.equal(good.mastery,100);assert.ok(Date.parse(good.nextReview)-Date.parse(good.lastStudied)<=12*3600000);
  const self=updateProgress(null,{conceptId:'rag',rating:3,now:EXAM_DATE+1});assert.equal(self.mastery,0);assert.equal(self.correct,0);
  assert.ok(Date.parse(self.nextReview)>EXAM_DATE+86400000);
});
test('exam sampling matches lengths and domains without duplicate concepts',()=>{
  for(const mode of ['A','B']){const qs=selectExamQuestions(catalog.questions,mode);assert.equal(qs.length,mode==='A'?20:16);assert.equal(new Set(qs.map(q=>q.conceptId)).size,qs.length);assert.equal(new Set(qs.map(q=>q.category)).size,7);assert.ok(qs.every(q=>q.type===(mode==='A'?'recall':'application')));}
});
test('direct access without credentials, cross-origin blocking and input validation',async t=>{
  const s=await setup(t);assert.equal((await s.request('/api/state')).status,200);
  assert.equal((await s.request('/api/login','POST',{})).status,404);
  assert.equal((await s.request('/api/catalog')).headers.get('set-cookie'),null);
  assert.equal((await s.request('/api/state')).status,200);
  assert.equal((await s.request('/api/settings','PATCH',{theme:'dark'},{origin:'https://evil.example'})).status,403);
  assert.equal((await s.request('/api/settings','PATCH',{dailyGoal:-3})).status,400);
  assert.equal((await s.request('/api/answer','POST',{questionId:'q-0',selectedIndex:5,eventId:'bad'})).status,400);
  assert.equal((await s.request('/api/session')).status,404);
});
test('answer idempotency, flashcard scheduling, cross-device sync and SQLite reopening',async t=>{
  const s=await setup(t);
  const body={questionId:'q-0',selectedIndex:0,eventId:'unique-answer'};
  assert.equal((await s.request('/api/answer','POST',body)).json.correct,true);
  await s.request('/api/answer','POST',body);
  await s.request('/api/review','POST',{conceptId:'concept-0',rating:1,eventId:'unique-review'});
  await s.request('/api/bookmark','POST',{conceptId:'concept-0',bookmarked:true});
   // A fresh request without cookies sees the shared progress.
  const state=(await s.request('/api/state')).json;
  assert.equal(state.attempts.length,1);assert.equal(state.progress['concept-0'].correct,1);assert.equal(state.progress['concept-0'].rating,1);assert.deepEqual(state.bookmarks,['concept-0']);
  const second=createStore(path.join(s.directory,'test.sqlite'));assert.equal(second.get('progress','concept-0').correct,1);second.close();
});
test('exam autosave, navigation, answer change, no answer key, reload and single submission',async t=>{
  const s=await setup(t);
  const exam=(await s.request('/api/exams','POST',{mode:'A'})).json;
  assert.equal(exam.questions.length,20);assert.equal(exam.questions[0].correctIndex,undefined);assert.equal(exam.questions[0].explanations,undefined);
  const id=exam.questionIds[0],answer=catalog.questions.find(q=>q.id===id).correctIndex;
  await s.request(`/api/exams/${exam.id}`,'PATCH',{questionId:id,selectedIndex:(answer+1)%4});
  await s.request(`/api/exams/${exam.id}`,'PATCH',{questionId:id,selectedIndex:answer,bookmarks:[id]});
  const loaded=(await s.request(`/api/exams/${exam.id}`)).json;
  assert.equal(loaded.answers[id],answer);assert.deepEqual(loaded.bookmarks,[id]);assert.equal(loaded.expiresAt,exam.expiresAt);
  const finished=(await s.request(`/api/exams/${exam.id}/submit`,'POST',{})).json;
  assert.equal(finished.score,5);assert.equal(finished.results.length,20);assert.equal(finished.results.filter(r=>r.correct).length,1);
  await s.request(`/api/exams/${exam.id}/submit`,'POST',{});
  assert.equal((await s.request('/api/state')).json.attempts.length,20);
  assert.equal((await s.request(`/api/exams/${exam.id}`,'PATCH',{questionId:id,selectedIndex:0})).status,409);
  assert.notEqual((await s.request('/api/exams','POST',{mode:'A'})).json.id,exam.id);
});
test('deadline cannot be extended by reload, stale writes or a client clock',async t=>{
  const s=await setup(t);const exam=(await s.request('/api/exams','POST',{mode:'B'})).json;
  s.advance(90*60000+1);
  assert.equal((await s.request(`/api/exams/${exam.id}`,'PATCH',{questionId:exam.questionIds[0],selectedIndex:0})).status,409);
  const finished=(await s.request(`/api/exams/${exam.id}`)).json;assert.ok(finished.submittedAt);assert.equal(finished.score,0);
});
test('backup restores progress/settings/exam snapshots and rejects corruption atomically',async t=>{
  const s=await setup(t);
  await s.request('/api/answer','POST',{questionId:'q-0',selectedIndex:0,eventId:'original'});
  await s.request('/api/settings','PATCH',{theme:'dark'});
  const exam=(await s.request('/api/exams','POST',{mode:'A'})).json;
  const backup=(await s.request('/api/backup')).json;
  assert.equal(validateBackup(backup),backup);
  await s.request('/api/answer','POST',{questionId:'q-1',selectedIndex:0,eventId:'new'});
  assert.equal((await s.request('/api/restore','POST',{...backup,progress:[{...backup.progress[0],mastery:999}]})).status,400);
  assert.equal((await s.request('/api/state')).json.attempts.length,2);
  assert.equal((await s.request('/api/restore','POST',backup)).status,200);
  const state=(await s.request('/api/state')).json;assert.equal(state.attempts.length,1);assert.equal(state.settings.theme,'dark');assert.equal(state.exams[0].id,exam.id);
  await s.request('/api/answer','POST',{questionId:'q-0',selectedIndex:0,eventId:'original'});assert.equal((await s.request('/api/state')).json.attempts.length,1);
});
