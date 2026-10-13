import { mkdirSync, chmodSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStore } from './store.mjs';
import { loadCatalog } from './catalog.mjs';
import { createApp } from './app.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dataDir=process.env.AI_SPRINT_DATA_DIR || path.join(root,'data');
mkdirSync(dataDir,{recursive:true,mode:0o700});
chmodSync(dataDir,0o700);
// Remove the retired application credential when upgrading an existing installation.
rmSync(path.join(dataDir,'access-code.txt'),{force:true});
const store=createStore(path.join(dataDir,'ai-sprint.sqlite'));
const app=createApp({store,catalog:loadCatalog(),dataDir,distDir:path.join(root,'dist')});
const port=Number(process.env.AI_SPRINT_PORT || 8787);
const server=app.listen(port,'127.0.0.1',()=>console.log(`AI Sprint http://127.0.0.1:${port}`));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>{store.close();process.exit(0);}));
