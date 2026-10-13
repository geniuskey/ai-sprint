import express from 'express';
import { randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { selectExamQuestions, updateProgress } from './learning.mjs';
const fail = (status,message) => Object.assign(new Error(message),{status});
const isString = x => typeof x === 'string' && x.length > 0 && x.length < 300;
const date = x => typeof x === 'string' && Number.isFinite(Date.parse(x));
const record = x => x && typeof x === 'object' && !Array.isArray(x);
const finite = x => typeof x === 'number' && Number.isFinite(x);
export function validateBackup(data) {
  const check = (condition,message) => { if(!condition) throw fail(400,`백업 형식 오류: ${message}`); };
  check(record(data) && data.version === 1,'지원하지 않는 버전');
  for(const key of ['progress','attempts','exams','bookmarks','events']) check(Array.isArray(data[key]) && data[key].length <= 100000, key);
  check(record(data.settings) && ['light','dark'].includes(data.settings.theme) && Number.isInteger(data.settings.dailyGoal) && data.settings.dailyGoal >= 1 && data.settings.dailyGoal <= 120 && typeof data.settings.generalMode === 'boolean','설정');
  const unique = (items, key) => new Set(items.map(x=>x[key])).size === items.length;
  check(unique(data.progress,'conceptId') && unique(data.attempts,'id') && unique(data.exams,'id') && unique(data.events,'id') && new Set(data.bookmarks).size === data.bookmarks.length,'중복 ID');
  for(const p of data.progress) check(record(p) && isString(p.conceptId) && ['correct','incorrect','streak'].every(k=>Number.isInteger(p[k]) && p[k]>=0) && finite(p.mastery) && p.mastery>=0 && p.mastery<=100 && (p.rating===null || [0,1,2,3].includes(p.rating)) && date(p.lastStudied) && date(p.nextReview),'진도');
  for(const a of data.attempts) check(record(a) && isString(a.id) && isString(a.questionId) && isString(a.conceptId) && Number.isInteger(a.selectedIndex) && a.selectedIndex>=-1 && a.selectedIndex<4 && typeof a.correct==='boolean' && date(a.at) && isString(a.source),'답변');
  for(const e of data.exams) {
    check(record(e) && isString(e.id) && ['A','B'].includes(e.mode) && date(e.startedAt) && date(e.expiresAt) && Date.parse(e.expiresAt)>=Date.parse(e.startedAt) && (e.submittedAt===null || date(e.submittedAt)) && Array.isArray(e.questionIds) && e.questionIds.length===(e.mode==='A'?20:16) && new Set(e.questionIds).size===e.questionIds.length && e.questionIds.every(isString) && Array.isArray(e.questions) && e.questions.length===e.questionIds.length && record(e.answers) && Array.isArray(e.bookmarks),'시험');
    check(e.questions.every((q,i)=>record(q) && q.id===e.questionIds[i] && isString(q.conceptId) && typeof q.prompt==='string' && ['A','B','C','D','E','F','G'].includes(q.category) && ['recall','application'].includes(q.type) && Array.isArray(q.options) && q.options.length===4 && q.options.every(x=>typeof x==='string') && Number.isInteger(q.correctIndex) && q.correctIndex>=0 && q.correctIndex<4 && Array.isArray(q.explanations) && q.explanations.length===4 && q.explanations.every(x=>typeof x==='string')),'시험 문항');
    check(Object.entries(e.answers).every(([k,v])=>e.questionIds.includes(k) && Number.isInteger(v) && v>=0 && v<4) && e.bookmarks.every(id=>e.questionIds.includes(id)),'시험 답변');
    if(e.submittedAt) check(finite(e.score) && e.score>=0 && e.score<=100 && Array.isArray(e.results) && e.results.length===e.questions.length && e.results.every(r=>record(r) && e.questionIds.includes(r.questionId) && typeof r.correct==='boolean' && (r.selectedIndex===null || Number.isInteger(r.selectedIndex)) && Number.isInteger(r.correctIndex) && Array.isArray(r.explanations)),'시험 결과');
  }
  for(const b of data.bookmarks) check(isString(b),'북마크');
  for(const e of data.events) check(record(e) && isString(e.id) && record(e.value),'이벤트');
  return data;
}
export function createApp({store,catalog,dataDir,distDir,now=Date.now}) {
  const app=express();
  app.disable('x-powered-by');
  app.use((req,res,next)=>{
    res.set({'X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-ancestors 'none'"});
    if(req.path.startsWith('/api/')) res.set('Cache-Control','no-store');
    if(!['GET','HEAD','OPTIONS'].includes(req.method)) {
      const origin=req.get('origin');
      if(origin) {
        let sameOrigin=false;
        try {sameOrigin=new URL(origin).host===req.get('host');} catch { /* malformed origin */ }
        if(!sameOrigin)return res.status(403).json({error:'다른 사이트에서 보낸 요청은 허용하지 않습니다.'});
      }
      if(req.get('sec-fetch-site')==='cross-site') return res.status(403).json({error:'동일한 앱에서 다시 시도해 주세요.'});
    }
    next();
  });
  app.use(express.json({limit:'20mb'}));
  const concepts = new Map(catalog.concepts.map(c=>[c.id,c]));
  const questions = new Map(catalog.questions.map(q=>[q.id,q]));
  app.get('/api/health',(_req,res)=>res.json({ok:true,concepts:catalog.concepts.length,questions:catalog.questions.length}));
  app.get('/api/catalog',(_req,res)=>res.json(catalog));
  const submitExam = exam => {
    if(exam.submittedAt) return exam;
    return store.transaction(()=>{
      exam.results=exam.questions.map(q=>{
        const selectedIndex=exam.answers[q.id]??null;
        const answer=store.answer(q,selectedIndex??-1,`exam:${exam.id}:${q.id}`,'exam',now());
        return {questionId:q.id,selectedIndex,correct:answer.correct,correctIndex:q.correctIndex,explanations:q.explanations};
      });
      exam.score=Math.round(exam.results.filter(r=>r.correct).length/exam.questionIds.length*100);
      exam.submittedAt=new Date(now()).toISOString(); store.put('exams',exam.id,exam); return exam;
    });
  };
  const currentExam = id => { let exam=store.get('exams',id);if(!exam)throw fail(404,'시험을 찾을 수 없습니다.'); if(!exam.submittedAt && Date.parse(exam.expiresAt)<=now())exam=submitExam(exam);return exam; };
  const publicExam = exam => exam.submittedAt ? exam : {...exam,questions:exam.questions.map(({correctIndex:_answer,explanations:_explanations,...q})=>q)};
  app.get('/api/state',(_req,res)=>{const exams=store.all('exams').map(e=>publicExam(currentExam(e.id))).reverse();res.json({progress:Object.fromEntries(store.all('progress').map(p=>[p.conceptId,p])),attempts:store.all('attempts'),bookmarks:store.db.prepare('SELECT id FROM bookmarks').all().map(r=>r.id),settings:store.settings(),exams});});
  const eventId = body => {if(!isString(body?.eventId))throw fail(400,'고유한 기록 ID가 필요합니다.');return body.eventId;};
  app.post('/api/answer',(req,res)=>{
    const q=questions.get(req.body?.questionId);if(!q)throw fail(400,'문항을 찾을 수 없습니다.');
    if(!Number.isInteger(req.body.selectedIndex)||req.body.selectedIndex<0||req.body.selectedIndex>=q.options.length)throw fail(400,'선택지가 올바르지 않습니다.');
    res.json(store.transaction(()=>store.answer(q,req.body.selectedIndex,eventId(req.body),'lesson',now())));
  });
  app.post('/api/review',(req,res)=>{
    const {conceptId,rating}=req.body||{};if(!concepts.has(conceptId)||![0,1,2,3].includes(rating))throw fail(400,'복습 입력이 올바르지 않습니다.');
    const id=eventId(req.body);
    res.json(store.transaction(()=>{
      const old=store.get('events',id);if(old)return old;
      const p=updateProgress(store.get('progress',conceptId),{conceptId,rating,now:now(),generalMode:store.settings().generalMode});
      store.put('progress',conceptId,p);store.put('events',id,p);return p;
    }));
  });
  app.post('/api/bookmark',(req,res)=>{
    const {conceptId,bookmarked}=req.body||{};if(!concepts.has(conceptId)||typeof bookmarked!=='boolean')throw fail(400,'북마크 입력 오류');
    if(bookmarked)store.db.prepare('INSERT OR IGNORE INTO bookmarks VALUES (?)').run(conceptId);else store.db.prepare('DELETE FROM bookmarks WHERE id=?').run(conceptId);
    res.json({ok:true});
  });
  app.patch('/api/settings',(req,res)=>{
    const updates=req.body||{};
    if(Object.keys(updates).some(k=>!['theme','dailyGoal','generalMode'].includes(k)) || ('theme'in updates&&!['light','dark'].includes(updates.theme)) || ('dailyGoal'in updates&&(!Number.isInteger(updates.dailyGoal)||updates.dailyGoal<1||updates.dailyGoal>120)) || ('generalMode'in updates&&typeof updates.generalMode!=='boolean'))throw fail(400,'설정 값이 올바르지 않습니다.');
    const settings={...store.settings(),...updates};store.put('settings','main',settings);res.json(settings);
  });
  app.post('/api/exams',(req,res)=>{
    const mode=req.body?.mode;if(!['A','B'].includes(mode))throw fail(400,'시험 유형을 선택해 주세요.');
    const pending=store.all('exams').map(e=>currentExam(e.id)).find(e=>e.mode===mode&&!e.submittedAt);
    if(pending)return res.json(publicExam(pending));
    const selected=selectExamQuestions(catalog.questions,mode);
    const exam={id:randomUUID(),mode,startedAt:new Date(now()).toISOString(),expiresAt:new Date(now()+(mode==='A'?30:90)*60_000).toISOString(),submittedAt:null,questionIds:selected.map(q=>q.id),questions:selected,answers:{},bookmarks:[]};
    store.put('exams',exam.id,exam);res.status(201).json(publicExam(exam));
  });
  app.get('/api/exams/:id',(req,res)=>res.json(publicExam(currentExam(req.params.id))));
  app.patch('/api/exams/:id',(req,res)=>{
    const exam=currentExam(req.params.id);if(exam.submittedAt)throw fail(409,'이미 종료된 시험입니다. 결과를 확인해 주세요.');
    const {questionId,selectedIndex,bookmarks}=req.body||{};
    if(questionId!==undefined){if(!exam.questionIds.includes(questionId)||!Number.isInteger(selectedIndex)||selectedIndex<0||selectedIndex>3)throw fail(400,'시험 답변이 올바르지 않습니다.');exam.answers[questionId]=selectedIndex;}
    if(bookmarks!==undefined){if(!Array.isArray(bookmarks)||bookmarks.some(id=>!exam.questionIds.includes(id)))throw fail(400,'북마크 오류');exam.bookmarks=[...new Set(bookmarks)];}
    store.put('exams',exam.id,exam);res.json(publicExam(exam));
  });
  app.post('/api/exams/:id/submit',(req,res)=>res.json(publicExam(submitExam(currentExam(req.params.id)))));
  app.get('/api/backup',(_req,res)=>{res.set('Content-Disposition',`attachment; filename="ai-sprint-${new Date(now()).toISOString().slice(0,10)}.json"`);res.json(store.exportData());});
  app.post('/api/restore',(req,res)=>{
    const data=validateBackup(req.body);
    mkdirSync(path.join(dataDir,'backups'),{recursive:true,mode:0o700});
    writeFileSync(path.join(dataDir,'backups',`before-restore-${now()}-${randomUUID().slice(0,8)}.json`),JSON.stringify(store.exportData()),{mode:0o600});
    res.json(store.restore(data));
  });
  app.use('/api',(_req,_res,next)=>next(fail(404,'API를 찾을 수 없습니다.')));
  if(distDir){app.use(express.static(distDir));app.get('/{*path}',(_req,res)=>res.sendFile(path.join(distDir,'index.html')));}
  app.use((err,_req,res,_next)=>{if(!err.status || err.status>=500)console.error(err);res.status(err.status||500).json({error:err.status&&err.status<500?err.message:'서버 오류입니다. 잠시 후 다시 시도해 주세요.'});});
  return app;
}
