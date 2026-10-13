import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStore } from '../server/store.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const directory=process.env.AI_SPRINT_DATA_DIR||path.join(root,'data');
const backupDir=path.join(directory,'backups');mkdirSync(backupDir,{recursive:true,mode:0o700});
const store=createStore(path.join(directory,'ai-sprint.sqlite'));
try {
  const target=path.join(backupDir,`scheduled-${new Date().toISOString().replace(/[:.]/g,'-')}.json`);
  const data=store.transaction(()=>store.exportData());writeFileSync(target,JSON.stringify(data),{mode:0o600});
  const old=readdirSync(backupDir).filter(x=>x.startsWith('scheduled-')).sort().slice(0,-30);
  for(const file of old)unlinkSync(path.join(backupDir,file));
  console.log(target);
} finally {store.close();}
