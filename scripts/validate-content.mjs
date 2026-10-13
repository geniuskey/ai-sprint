import { loadCatalog } from '../server/catalog.mjs';
export function validateContent(catalog) {
  const {concepts,questions,scenarios}=catalog;
  const errors=[];const check=(ok,message)=>{if(!ok)errors.push(message);};
  check(concepts.length>=100,`개념 ${concepts.length}: 최소 100개 필요`);
  check(questions.length>=200,`문항 ${questions.length}: 최소 200개 필요`);
  const ids=new Set(concepts.map(c=>c.id));const qids=new Set(questions.map(q=>q.id));
  check(ids.size===concepts.length,'중복 개념 ID');check(qids.size===questions.length,'중복 문항 ID');
  check(new Set(concepts.map(c=>c.title)).size===concepts.length,'중복 개념 제목');
  check(new Set(questions.map(q=>q.prompt.replace(/\s/g,''))).size===questions.length,'중복 질문');
  const text=(v,min=5)=>typeof v==='string' && v.trim().length>=min && !/Lorem Ipsum|TODO|TBD|예제 입력/i.test(v);
  const categories={};const positions=[0,0,0,0];
  for(const c of concepts){
    const prefix=`개념 ${c.id}`;
    check(/^[a-z0-9][a-z0-9-]+$/.test(c.id),`${prefix}: 안정적인 slug ID`);
    for(const key of ['title','priorityReason','summary','simpleExplanation','analogy','technicalExplanation','realWorldExample'])check(text(c[key],key==='title'?2:15),`${prefix}: ${key} 누락/미완성`);
    for(const key of ['commonMisconceptions','keyTakeaways'])check(Array.isArray(c[key])&&c[key].length>=1&&c[key].every(x=>text(x)),`${prefix}: ${key}`);
    check(['A','B','C','D','E','F','G'].includes(c.category),`${prefix}: 카테고리`);
    categories[c.category]=(categories[c.category]||0)+1;
    check([1,2,3].includes(c.priority),`${prefix}: 우선순위`);
    check(c.estimatedMinutes>=3&&c.estimatedMinutes<=5,`${prefix}: 학습시간`);
    check(Array.isArray(c.prerequisites)&&c.prerequisites.every(id=>ids.has(id)&&id!==c.id),`${prefix}: 선수 개념 링크`);
    check(Array.isArray(c.comparisons)&&c.comparisons.length>=1&&c.comparisons.every(x=>text(x.with,2)&&text(x.distinction,15)),`${prefix}: 비교`);
    check(Array.isArray(c.references)&&c.references.length>=1&&c.references.every(r=>text(r.title,2)&&/^https:\/\//.test(r.url)),`${prefix}: 출처`);
    check(c.validation&&text(c.validation.status)&&Number.isFinite(Date.parse(c.validation.checkedAt))&&text(c.validation.note),`${prefix}: 검증 상태`);
    const linked=questions.filter(q=>q.conceptId===c.id);
    check(linked.length>=2 && linked.some(q=>q.type==='recall')&&linked.some(q=>q.type==='application'),`${prefix}: 회상+응용 2문항`);
    check(Array.isArray(c.quizQuestions)&&c.quizQuestions.length>=2&&new Set(c.quizQuestions).size===c.quizQuestions.length&&c.quizQuestions.every(id=>qids.has(id)&&linked.some(q=>q.id===id)),`${prefix}: 퀴즈 참조`);
  }
  for(const q of questions){
    const prefix=`문항 ${q.id}`;check(ids.has(q.conceptId),`${prefix}: 개념 링크`);
    check(q.category===concepts.find(c=>c.id===q.conceptId)?.category,`${prefix}: 카테고리 불일치`);
    check(text(q.prompt,12),`${prefix}: 질문`);
    check(['recall','application'].includes(q.type),`${prefix}: 유형`);
    check(Array.isArray(q.options)&&q.options.length===4&&q.options.every(x=>text(x,2))&&new Set(q.options).size===4,`${prefix}: 고유한 선택지 4개`);
    check(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4,`${prefix}: 유일한 정답 인덱스`);
    check(Array.isArray(q.explanations)&&q.explanations.length===4&&q.explanations.every(x=>text(x,10)),`${prefix}: 선택지별 해설`);
    if(q.correctIndex>=0&&q.correctIndex<4)positions[q.correctIndex]++;
  }
  check(positions.every(n=>n>=questions.length*0.15&&n<=questions.length*0.35),'정답 위치 편중: '+positions.join(','));
  for(const type of ['recall','application']) {
    const group=questions.filter(q=>q.type===type);
    const counts=[0,1,2,3].map(i=>group.filter(q=>q.correctIndex===i).length);
    check(counts.every(n=>n>=group.length*0.15 && n<=group.length*0.35),`${type} 정답 위치 편중: ${counts.join(',')}`);
  }
  check(scenarios.length>=7,'최소 7개 실전 시나리오');
  check(new Set(scenarios.map(s=>s.id)).size===scenarios.length,'중복 시나리오 ID');
  for(const s of scenarios){
    for(const key of ['title','situation','approach'])check(text(s[key],10),`${s.id}: ${key}`);
    for(const key of ['constraints','options','tradeoffs','verification'])check(Array.isArray(s[key])&&s[key].length>=2&&s[key].every(x=>text(x,8)),`${s.id}: ${key}`);
    check(Number.isInteger(s.recommendedIndex)&&s.recommendedIndex>=0&&s.recommendedIndex<s.options.length,`${s.id}: 권장 접근`);
    check(Array.isArray(s.conceptIds)&&s.conceptIds.length>=1&&s.conceptIds.every(id=>ids.has(id)),`${s.id}: 개념 링크`);
  }
  const visited=new Set(),active=new Set();
  const visit=id=>{if(active.has(id)){check(false,`선수 지식 순환: ${id}`);return;}if(visited.has(id))return;active.add(id);for(const p of concepts.find(c=>c.id===id)?.prerequisites||[])visit(p);active.delete(id);visited.add(id);};
  for(const c of concepts)visit(c.id);
  return {errors,concepts:concepts.length,questions:questions.length,scenarios:scenarios.length,categories,answerPositions:positions};
}
const report=validateContent(loadCatalog());
console.log(JSON.stringify(report,null,2));
if(report.errors.length)process.exitCode=1;
