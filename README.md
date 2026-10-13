# AI Sprint

SK하이닉스 AI 해커톤 준비를 위한 개인용 한국어 학습 앱. 외부 LLM API 없이 개념 학습, 회상 퀴즈, 복습 카드, 실전 판단, 모의시험을 제공한다. 공식 기출이 아닌 준비용 학습 자료다.

현재 콘텐츠: **105개 개념 · 210개 문항 · 8개 실전 시나리오**. [구현 및 검증 결과](docs/VALIDATION.md)를 확인할 수 있다.

개인 Tailscale 접속: https://macstudio.nutria-sole.ts.net:8788/

## 실행

Node.js 24 이상(개발 환경 26.9), npm 필요.

```sh
npm ci
npm run check
npm start
```

로컬 주소: http://127.0.0.1:8787

Tailscale에 연결하고 주소를 열면 별도 로그인 없이 학습 화면이 열린다. 접근 통제는 tailnet 정책에 따른다. 학습 기록은 서버 SQLite에 저장되어 같은 서버에 접속한 기기끼리 공유된다.

개발 시 서버와 프런트엔드를 각각 실행한다.

```sh
npm start
npm run dev
```

Vite 개발 주소는 http://127.0.0.1:5178 이며 `/api`는 서버 8787로 전달한다. 운영에서는 Vite 대신 빌드된 파일을 Node 서버가 직접 제공한다.

## 검사

```sh
npm run validate:content
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

브라우저 테스트는 설치된 Google Chrome을 사용하며, 운영 기록과 분리된 임시 DB로 실행한다.

- `content/foundations.json`: AI/ML, LLM, 프롬프트, 최신 기술.
- `content/practice.json`: RAG, Agent, 실무 판단 및 시나리오.
- `server/`: 인증, SQLite, 간격 반복, 시험, 백업 API.
- `src/`: 모바일 학습 화면.
- `tests/`: 서버·영속성·복원·시험 만료 회귀 테스트.
- `docs/DESIGN.md`: 공식 확인 범위, 우선순위, 알고리즘.
- `docs/OPERATIONS.md`: Mac/Tailscale 서비스 운영.

## 학습 시작

홈의 **오늘의 10분 학습** → 개념을 자신의 말로 설명 → 확인 문제 2개 → **복습**에서 이해도 평가. 이후 **개념 비교**에서 RAG/Fine-tuning, Agent/Workflow, Tool Calling/MCP를 구분하고 사례형 문제로 선택 이유를 연습한다. 시험 직전에는 **최종 암기 노트**와 오답을 먼저 보고 A/B 모의시험으로 시간을 점검한다.

## 데이터

`data/`는 개인 데이터이므로 버전 관리에서 제외된다. 설정 화면에서 JSON 백업·복원이 가능하며 복원 직전 자동 백업을 남긴다. 서버 DB를 임의로 삭제하지 않는다. 콘텐츠 ID를 바꾸면 기존 학습 이력과 연결이 끊어지므로 ID는 유지한다.

콘텐츠 자동 검사 통과는 의미적 정확성의 증명이 아니다. 공식 문서 대조와 선택지별 자체 검토 상태를 각 개념의 출처 화면에서 확인할 수 있다. 전문가 독립 검수나 실제 기출 검증을 받은 자료로 표시하지 않는다.
