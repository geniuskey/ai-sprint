import { defineConfig } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const dataDir=process.env.AI_SPRINT_E2E_DATA || mkdtempSync(join(tmpdir(),'ai-sprint-browser-'));
process.env.AI_SPRINT_E2E_DATA=dataDir;
export default defineConfig({testDir:'./tests/browser',timeout:30000,fullyParallel:false,workers:1,reporter:'list',use:{baseURL:'http://127.0.0.1:8789',channel:'chrome',headless:true,screenshot:'only-on-failure',trace:'retain-on-failure'},webServer:{command:'node server/index.mjs',url:'http://127.0.0.1:8789/api/health',reuseExistingServer:false,env:{AI_SPRINT_DATA_DIR:dataDir,AI_SPRINT_PORT:'8789'}}});
