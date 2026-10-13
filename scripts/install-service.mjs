import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
if(process.platform!=='darwin')throw new Error('macOS launchd 전용 설치 스크립트입니다.');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if(!existsSync(path.join(root,'dist','index.html')))throw new Error('npm run build를 먼저 실행하세요.');
const launchDir=path.join(os.homedir(),'Library','LaunchAgents');const logDir=path.join(root,'data','logs');
mkdirSync(launchDir,{recursive:true});mkdirSync(logDir,{recursive:true,mode:0o700});
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function install(label,script,extra) {
  const target=path.join(launchDir,`${label}.plist`);
  const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict><key>Label</key><string>${label}</string><key>ProgramArguments</key><array><string>${escape(process.execPath)}</string><string>${escape(path.join(root,script))}</string></array><key>WorkingDirectory</key><string>${escape(root)}</string><key>EnvironmentVariables</key><dict><key>NODE_ENV</key><string>production</string></dict><key>RunAtLoad</key><true/>${extra}<key>StandardOutPath</key><string>${escape(path.join(logDir,label+'.log'))}</string><key>StandardErrorPath</key><string>${escape(path.join(logDir,label+'.error.log'))}</string></dict></plist>`;
  writeFileSync(target,xml);
  const domain=`gui/${os.userInfo().uid}`;
  try{execFileSync('/bin/launchctl',['bootout',`${domain}/${label}`],{stdio:'ignore'});}catch{/* first installation */}
  execFileSync('/bin/launchctl',['bootstrap',domain,target]);console.log(`Installed ${label}`);
}
install('com.geniuskey.ai-sprint','server/index.mjs','<key>KeepAlive</key><true/><key>ThrottleInterval</key><integer>5</integer>');
install('com.geniuskey.ai-sprint.backup','scripts/backup.mjs','<key>StartCalendarInterval</key><dict><key>Hour</key><integer>3</integer><key>Minute</key><integer>15</integer></dict>');
