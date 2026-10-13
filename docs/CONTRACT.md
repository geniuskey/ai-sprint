# Shared implementation contract
Content files: content/foundations.json (A/B/C/G) and content/practice.json (D/E/F), each {concepts: Concept[], questions: Question[], scenarios: Scenario[]} following src/types.ts. Every concept two bespoke questions, 4 choices and four per-option explanations. Stable slug IDs. quizQuestions references question IDs. Comparisons.with uses title (not foreign key). prerequisites must be valid concept IDs within own file, or empty. validation honest source cross-check status. Need >=100 total concepts and >=200 questions. Frontend reads GET /api/catalog and GET /api/state. No application login; access is controlled by Tailscale.
API contract:
GET /api/catalog -> Catalog; GET /api/state -> State
POST /api/answer {questionId,selectedIndex,eventId} -> {correct,correctIndex,explanations,progress}; unique eventId crypto.randomUUID prevents duplicate records
POST /api/review {conceptId,rating:0|1|2|3,eventId} -> Progress
POST /api/bookmark {conceptId,bookmarked:boolean} -> {ok:true}
PATCH /api/settings {theme?,dailyGoal?,generalMode?} -> settings
POST /api/exams {mode:'A'|'B'} -> Exam (questions stripped of correctIndex and explanations until submitted; UI never accesses those during exam)
GET /api/exams/:id -> Exam
PATCH /api/exams/:id {questionId?,selectedIndex?,bookmarks?:string[]} -> Exam; autosaves each answer
POST /api/exams/:id/submit -> Exam with score percentage, results and questions including explanations
GET /api/backup -> downloadable JSON export; POST /api/restore with backup JSON -> {ok:true}; restore requires explicit user UI confirmation
All errors {error:string}. localhost and private Tailscale only, backend 127.0.0.1:8787. Browser uses relative URLs. During dev Vite proxies /api to backend. GET /api/state returns exams summary with questions/results included if submitted; current exams hide answers. Reload state after mutations. The UI loads shared state directly without session cookies. Official exam date and counts from user brief; website only confirms Oct 17–18 and literacy/problem solving. Mock format explicitly a preparation hypothesis.
