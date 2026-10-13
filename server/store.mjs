import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { defaultSettings, updateProgress } from './learning.mjs';
export function createStore(path) {
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS progress (id TEXT PRIMARY KEY, payload TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS attempts (id TEXT PRIMARY KEY, payload TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS exams (id TEXT PRIMARY KEY, payload TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS bookmarks (id TEXT PRIMARY KEY);
    CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY, payload TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, payload TEXT NOT NULL);
    DROP TABLE IF EXISTS sessions;`);
  const tables = new Set(['progress','attempts','exams','settings','events']);
  const get = (table,id) => { if (!tables.has(table)) throw new Error('Invalid table'); const r=db.prepare(`SELECT payload FROM ${table} WHERE id=?`).get(id); return r ? JSON.parse(r.payload) : null; };
  const put = (table,id,value) => { if (!tables.has(table)) throw new Error('Invalid table'); db.prepare(`INSERT INTO ${table}(id,payload) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload`).run(id,JSON.stringify(value)); };
  const all = table => { if (!tables.has(table)) throw new Error('Invalid table'); return db.prepare(`SELECT payload FROM ${table} ORDER BY rowid`).all().map(r=>JSON.parse(r.payload)); };
  const transaction = fn => { db.exec('BEGIN IMMEDIATE'); try { const result=fn(); db.exec('COMMIT'); return result; } catch(e) { db.exec('ROLLBACK'); throw e; } };
  const settings = () => ({...defaultSettings,...get('settings','main')});
  const answer = (question, selectedIndex, eventId, source='lesson', now=Date.now()) => {
    const old=get('events',eventId); if(old) return old;
    const correct=selectedIndex === question.correctIndex;
    const progress=updateProgress(get('progress',question.conceptId),{conceptId:question.conceptId,correct,now,generalMode:settings().generalMode});
    put('progress',question.conceptId,progress);
    put('attempts',eventId,{id:eventId,questionId:question.id,conceptId:question.conceptId,selectedIndex,correct,at:new Date(now).toISOString(),source});
    const result={correct,correctIndex:question.correctIndex,explanations:question.explanations,progress}; put('events',eventId,result); return result;
  };
  const exportData = () => ({version:1,exportedAt:new Date().toISOString(),progress:all('progress'),attempts:all('attempts'),exams:all('exams'),bookmarks:db.prepare('SELECT id FROM bookmarks').all().map(r=>r.id),settings:settings(),events:db.prepare('SELECT id,payload FROM events').all().map(r=>({id:r.id,value:JSON.parse(r.payload)}))});
  const restore = data => transaction(()=>{
    for (const t of tables) db.exec(`DELETE FROM ${t}`);
    db.exec('DELETE FROM bookmarks');
    for(const p of data.progress) put('progress',p.conceptId,p);
    for(const a of data.attempts) put('attempts',a.id,a);
    for(const e of data.exams) put('exams',e.id,e);
    for(const e of data.events || []) put('events',e.id,e.value);
    for(const id of data.bookmarks) db.prepare('INSERT INTO bookmarks(id) VALUES (?)').run(id);
    put('settings','main',data.settings);
    return {ok:true};
  });
  return {db,get,put,all,transaction,settings,answer,exportData,restore,uuid:randomUUID,close:()=>db.close()};
}
