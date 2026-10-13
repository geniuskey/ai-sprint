# Project: AI Sprint — SK하이닉스 AI 해커톤 2026 족집게 학습 플랫폼

## 1. 프로젝트 목표

2026년 10월 18일(일)에 진행되는 SK하이닉스 AI 해커톤 2026 1차 예선을 준비하기 위한 개인용 모바일 최적화 학습 웹 애플리케이션을 개발하라.

이 프로젝트의 가장 중요한 목표는 웹사이트 자체의 개발이 아니라 **사용자가 AI 기초 지식과 AI 활용 역량을 단기간에 효율적으로 습득하도록 돕는 것**이다.

사용자는 이미 Python 개발, AI 코딩 에이전트, 자동화 및 AI 개발 도구 활용 경험이 풍부하지만 AI 및 머신러닝의 이론적 개념, 용어, 세부 원리에는 지식 공백이 있다.

사용자가 다음을 할 수 있어야 한다.

1. 스마트폰으로 이동 중 3~5분씩 학습한다.
2. 어려운 개념을 쉬운 설명과 사례로 빠르게 이해한다.
3. 서로 헷갈리는 기술을 명확히 구분한다.
4. 핵심 개념을 암기하고 장기 기억으로 전환한다.
5. AI를 실제 문제 해결에 활용하는 판단 능력을 연습한다.
6. 시험 직전에는 취약 영역만 집중적으로 복습한다.
7. 제한 시간에 맞춰 실전 모의시험을 진행한다.

단순한 정보 나열 사이트나 AI 용어 사전을 만드는 것은 금지한다.

학습 효과가 가장 중요한 성공 기준이다.

## 2. 시험 정보 및 평가 방향

시험일: 2026-10-18 (일)

시험 A:
- 14:00~14:30
- 20문항
- 제한 시간 30분

시험 B:
- 15:00~16:30
- 16문항
- 제한 시간 90분

공식 홈페이지:
https://skhynix-hackathon.com/ai-2026

공식 발표 자료:
https://talent.skhynix.com/hub/ko/company/story/237

공개된 평가 방향:
- AI 리터러시 및 기초 활용 능력
- 문제 정의
- AI 활용 및 문제 해결
- 결과 검증
- AI Native 역량

주의사항:
- 세부 출제 범위, 시험 형식, 도구 허용 범위는 확인되지 않았다.
- 20문항 시험을 지식형, 16문항 시험을 실전형으로 구분하는 것은 준비를 위한 가설이다.
- 공식 확인 사항과 예상 출제 사항을 분리하라.
- 출제 확률과 합격 가능성을 근거 없이 수치화하지 마라.

## 3. 제품 핵심 원칙

### 3.1 Content First

개발 기능보다 학습 콘텐츠 품질을 우선한다.

빈 템플릿, Lorem Ipsum, 제목만 있는 문서, 의미 없는 자동 생성 문제를 금지한다.

모든 핵심 콘텐츠는 실제로 학습할 수 있는 완성된 한국어 설명과 예제를 포함해야 한다.

### 3.2 High Yield Learning

모든 내용을 동일하게 취급하지 않는다.

시험 준비 관점에서 중요한 개념을 우선 배치한다.

학습 우선순위는 다음을 함께 고려하여 산정하라.

- 공개된 평가 방향과의 관련성
- AI 리터러시의 핵심성
- 다른 개념의 이해에 필요한 선수 지식
- 일반적으로 혼동하기 쉬운 정도
- 실제 문제 해결 시 활용 빈도

우선순위의 근거와 판단 기준을 남겨라.

### 3.3 Active Recall

사용자가 설명을 읽고 이해했다고 착각하지 않도록 한다.

반드시 스스로 답을 떠올리는 과정을 제공한다.

예:
- 개념을 보고 설명하기
- 설명을 보고 용어 맞히기
- 유사 개념 구분하기
- 틀린 설명 찾기
- 상황에 적절한 AI 기술 선택하기

### 3.4 Progressive Disclosure

처음에는 핵심만 보여주고 필요할 때 상세 내용을 펼치도록 한다.

개념 설명은 다음 단계로 제공한다.

- 10초 핵심 요약
- 1분 쉬운 설명
- 3분 실무 사례
- 상세 기술 설명
- 헷갈리는 개념 비교
- 확인 문제

처음부터 긴 문서 전체를 노출하지 않는다.

### 3.5 Mobile First

주 사용 환경은 Galaxy 스마트폰 브라우저다.

한 손 조작, 작은 화면, 이동 중 짧은 학습에 최적화한다.

## 4. 반드시 포함할 학습 커리큘럼

최소 100개의 독립적인 학습 개념을 제공한다.

모든 개념은 단순 용어 정리가 아니라 실제 학습 콘텐츠여야 한다.

영역 A. AI / 머신러닝 기초
- AI, ML, DL, 생성형 AI의 차이
- 지도학습, 비지도학습, 강화학습
- 분류, 회귀, 군집화
- Training / Validation / Test
- Overfitting / Underfitting
- Bias / Variance
- Data Leakage
- Feature Engineering
- Cross Validation
- Accuracy / Precision / Recall / F1
- Confusion Matrix
- ROC-AUC

영역 B. 딥러닝과 LLM 원리
- Neural Network
- Backpropagation
- Gradient Descent
- Transformer
- Self-Attention
- Multi-Head Attention
- Positional Encoding
- Tokenization
- Embedding
- Context Window
- Next Token Prediction
- Pretraining
- SFT / RLHF / DPO
- Inference
- Temperature / Top-p / Top-k
- Hallucination
- Quantization
- Distillation
- MoE

영역 C. 프롬프트 엔지니어링
- Zero-shot / One-shot / Few-shot
- Instruction Design
- Role / Context / Constraint
- Structured Output
- JSON Schema
- Prompt Injection
- Prompt Chaining
- Reasoning-oriented Prompting
- Prompt Evaluation
- Iterative Refinement
- Tool Use Instructions

영역 D. RAG 및 지식 활용
- RAG의 원리와 구조
- Embedding Model
- Vector Database
- Similarity Search
- Cosine Similarity
- Chunking
- Retrieval
- Reranking
- Hybrid Search
- Context Grounding
- Citation Verification
- RAG vs Fine-tuning
- Retrieval Evaluation

영역 E. AI Agent 및 시스템 설계
- AI Agent
- Agent vs Workflow
- Tool Calling
- Function Calling
- MCP
- Multi-Agent
- Planning
- Memory
- Human-in-the-loop
- Agent Evaluation
- Agent Safety
- Guardrails
- Observability
- Retry / Fallback
- Deterministic vs Probabilistic Systems

영역 F. 실전 AI 활용 역량
- 요구사항 분석
- 문제 정의
- Task Decomposition
- Tool Selection
- Prompt Improvement
- 결과 검증
- Hallucination Detection
- Source Verification
- 오류 분석
- 문제 해결 전략 비교
- 비용 / 정확도 / 지연시간 트레이드오프
- 개인정보 및 보안
- 재현 가능성과 테스트 전략
- AI 생성 코드 검증

영역 G. 최신 AI 기술
- Multimodal Models
- VLM
- ASR / TTS
- Diffusion
- Reasoning Models
- Open-weight vs Closed Models
- On-device AI
- AI Coding Agents

중요:
- 위 목록은 필수 출발점이다.
- 빠진 핵심 개념이 있다면 추가하라.
- 최신 개념 중 시험에 중요하지 않은 것은 우선순위를 낮춰라.
- 특히 RAG, Agent, MCP 같은 용어는 비교를 통해 정확히 이해하도록 구성하라.

## 5. 개별 학습 콘텐츠 구조

모든 학습 항목에 다음 필드를 포함한다.

- id
- title
- category
- priority
- estimatedMinutes
- prerequisites
- summary
- simpleExplanation
- analogy
- technicalExplanation
- realWorldExample
- commonMisconceptions
- comparisons
- keyTakeaways
- quizQuestions
- references

각 학습 콘텐츠는 다음 기준을 충족해야 한다.

### 5.1 핵심 한 줄

해당 개념의 핵심을 한두 문장으로 설명한다.

### 5.2 쉬운 비유

초보자도 이해할 수 있는 직관적인 비유를 제공한다.

단, 비유의 한계도 필요하면 명시한다.

### 5.3 실제 예제

Python 개발, AI 코딩 에이전트, 사내 지식 검색, 반도체 데이터 분석 등 현실적인 사례를 우선한다.

### 5.4 헷갈리는 개념

예:
- RAG vs Fine-tuning
- Precision vs Recall
- Agent vs Workflow
- Tool Calling vs MCP
- Token vs Embedding
- Temperature vs Top-p
- Training vs Inference
- Prompt Injection vs Hallucination

### 5.5 시험 함정

실제로 자주 발생하는 개념적 오해를 정리한다.

단, 공식 기출로 확인되지 않은 내용을 실제 시험 출제 유형이라고 단정하지 않는다.

### 5.6 확인 문제

각 학습 항목에 최소 2개의 유효한 문제를 제공한다.

단순 암기와 응용 판단 문제를 혼합한다.

틀린 선택지가 왜 틀렸는지도 설명한다.

## 6. 주요 학습 기능

### 6.1 Today Dashboard

앱 실행 시 학습 우선순위를 자동 추천한다.

표시 항목:
- 시험까지 남은 시간
- 오늘 학습 권장량
- 전체 학습 진도
- 카테고리별 숙련도
- 복습이 필요한 개념
- 최근 정답률
- 오늘의 10분 학습 시작 버튼

시험일까지 5일 이하인 상황에서는 즉시 활용할 수 있는 고효율 학습 경로를 기본으로 한다.

시험일 이후에도 사용할 수 있도록 일반 학습 모드를 제공한다.

### 6.2 Bite-sized Learning

각 개념을 3~5분 이내에 학습할 수 있도록 한다.

첫 화면은 핵심 요약으로 시작한다.

사용자는 원하는 경우만 상세 설명을 펼친다.

학습 중간에 짧은 회상 문제를 제공한다.

### 6.3 Flashcards

카드를 터치하면 정답 또는 설명이 표시된다.

사용자는 다음으로 평가한다.

- 모름
- 헷갈림
- 알고 있음
- 완벽히 이해

이 결과를 복습 일정에 반영한다.

### 6.4 Adaptive Review

단순히 읽은 페이지 수를 학습 진도로 취급하지 않는다.

개념별 숙련도를 관리한다.

권장 데이터:
- 마지막 학습 일시
- 답변 기록
- 정답 횟수
- 오답 횟수
- 연속 정답
- 주관적 이해도
- 다음 복습 시점

간단하고 설명 가능한 간격 반복 알고리즘을 적용한다.

시험일까지 남은 시간이 짧으므로 일반적인 장기 간격 반복보다 오답 및 취약 개념 재노출을 우선한다.

### 6.5 Comparison Learning

비슷한 기술을 나란히 비교하는 독립적인 화면을 제공한다.

비교 항목:
- 정의
- 해결하려는 문제
- 동작 방식
- 적합한 상황
- 장점
- 단점
- 잘못 사용하는 사례

사용자가 비교 대상으로 여러 개념을 선택할 수 있으면 좋다.

### 6.6 Scenario Learning

실제 AI 활용 역량을 연습하는 사례형 학습을 제공한다.

예:
- 대규모 사내 문서를 검색하는 챗봇 개발
- 불량 이미지 검출 모델의 평가지표 선택
- LLM 응답의 허위 정보 검증
- AI Agent의 도구 실행 안전성 확보
- 데이터 분석 업무를 AI로 자동화
- AI 생성 Python 코드의 오류 탐지
- 비용과 응답 속도를 고려한 모델 선택

각 시나리오는 다음 구조로 제작한다.

1. 문제 상황
2. 제약조건
3. 선택 가능한 해결 방법
4. 사용자의 판단
5. 권장 접근법
6. 대안과 트레이드오프
7. 결과를 검증하는 방법

정답 하나만 외우는 형태를 피한다.

### 6.7 Mock Exams

다음 두 가지 모드를 제공한다.

시험 A:
- 20문항
- 30분
- AI 기초지식 중심

시험 B:
- 16문항
- 90분
- AI 활용 사례 및 문제 해결 중심

두 모드 모두 실제 시험 형식이 확인되지 않았다는 점을 표시한다.

시험 중에는:
- 정답 미공개
- 남은 시간 표시
- 이전 문제 이동
- 답변 변경
- 문제 북마크
- 자동 임시 저장
- 시험 종료 후 채점

시험 종료 후에는:
- 전체 점수
- 카테고리별 정답률
- 틀린 문제의 상세 해설
- 관련 개념으로 바로 이동
- 취약 개념 자동 복습 목록
- 재시험 기능

문제은행은 최소 200개의 품질 검증된 문제로 구성하라.

동일한 개념이라도 다양한 표현과 상황을 사용한다.

정답 위치는 특정 번호에 편중되지 않게 한다.

문항별 정답의 유일성과 해설의 정확성을 검증한다.

### 6.8 Last-Minute Review

시험 전용 압축 복습 모드를 제공한다.

- 시험 3일 전: 핵심 개념 집중
- 시험 1일 전: 오답 및 취약점 집중
- 시험 당일: 10분 핵심 요약

100개 이상의 개념 중 우선순위가 높은 항목을 압축한 '최종 암기 노트'를 제공한다.

## 7. UX / UI 디자인

학습 앱을 전문적으로 제작하라.

디자인 원칙:
- 모바일 퍼스트
- 한국어 중심
- 직관적인 네비게이션
- 깔끔한 타이포그래피
- 짧고 명확한 카드 UI
- 다크 모드 및 라이트 모드
- 눈에 피로가 적은 디자인
- 적절한 다이어그램과 시각적 비교
- 터치 친화적인 버튼 크기
- 자연스럽고 절제된 애니메이션

참고 방향:
- Duolingo의 짧은 학습 루프
- Anki의 반복 학습
- Brilliant의 개념 중심 인터랙션
- 기술 문서의 명료한 설명

특정 서비스의 UI를 그대로 복제하지 말 것.

모바일 하단 네비게이션:
- 홈
- 학습
- 복습
- 시험
- 통계

데스크톱에서는 화면 크기에 맞는 레이아웃을 적용한다.

단순 카드 목록만으로 전체 앱을 구성하지 않는다.

실제 학습 과정이 즐겁고 빠르게 느껴져야 한다.

## 8. 기술 스택

Mac Studio M4 Max 64GB에서 운영할 예정이다.

권장 기술:
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- UI: shadcn/ui 또는 동급 컴포넌트
- Icons: Lucide
- Backend: 필요한 경우 FastAPI
- Database: SQLite
- Deployment: macOS 로컬 서비스 + Tailscale
- Package Manager: pnpm 또는 기존 환경에 적합한 도구

단일 사용자용 서비스이므로 불필요하게 복잡한 아키텍처는 피한다.

가능한 경우 콘텐츠는 구조화된 JSON 또는 Markdown/MDX로 관리한다.

문제, 학습 콘텐츠, 진도 데이터는 분리한다.

콘텐츠를 변경해도 사용자 진도가 손실되지 않도록 안정적인 개념 ID를 사용한다.

외부 LLM API 없이도 학습과 모의시험이 동작해야 한다.

AI 기반 해설이나 추가 질문 기능은 선택 사항으로 취급한다.

## 9. 데이터 영속성 및 동기화

스마트폰과 데스크톱에서 동일한 학습 진도를 확인할 수 있어야 한다.

SQLite 등에 다음 정보를 서버에 저장한다.

- 개념별 학습 기록
- 개념별 숙련도
- 문제별 응답 이력
- 모의시험 결과
- 북마크
- 복습 예정일
- 설정

브라우저 localStorage만으로 진도를 저장하지 않는다.

단일 사용자 환경에 적합한 간단한 인증 또는 접근 통제를 제공한다.

새로고침, 브라우저 재실행, 기기 변경에도 진도가 유지되어야 한다.

데이터 백업 및 복원 기능을 제공한다.

## 10. Tailscale 배포

Mac Studio에 이미 설치된 Tailscale을 활용한다.

개발 시작 전 다음을 확인하라.

- Tailscale 실행 상태
- 현재 tailnet 구성
- 기존 웹 서비스 및 포트 점유
- macOS 서비스 실행 방식
- 설치된 개발 런타임
- 기존 리버스 프록시 존재 여부

기존 서비스 설정을 함부로 변경하지 않는다.

가능하면 Tailscale Serve를 활용해 개인 tailnet 내부에서 HTTPS로 접속하도록 한다.

보안 원칙:
- 공용 인터넷에 노출하지 않는다.
- Tailscale Funnel을 사용하지 않는다.
- 불필요하게 0.0.0.0에 개발 서버를 노출하지 않는다.
- 기존 Tailscale 설정과 서비스의 동작을 유지한다.
- 필요하면 단일 사용자 인증을 추가한다.

운영 요건:
- Mac Studio 재부팅 후 자동 실행
- 프로세스 종료 시 자동 재시작
- 로그 확인 가능
- 간단한 상태 점검
- 데이터 백업
- 기존 포트와 충돌하지 않는 구성

배포 후 Galaxy 모바일 브라우저와 데스크톱에서 실제 접속을 검증하라.

## 11. 콘텐츠 품질 관리

이 프로젝트에서 가장 중요한 부분이다.

AI가 생성한 잘못된 지식을 사용자가 학습하면 오히려 시험에 불리해진다.

콘텐츠 작성 시 다음 기준을 지켜라.

1. 기본 개념은 신뢰할 수 있는 기술 문서와 대조한다.
2. 최신 기술은 가능한 경우 공식 문서를 우선한다.
3. 개념과 구현체별 동작 차이를 구분한다.
4. 자주 발생하는 오개념을 명시한다.
5. 지나친 단순화로 잘못된 이해를 만들지 않는다.
6. 예제와 해설이 모순되지 않는지 검증한다.
7. 모든 문제에 정답과 오답 해설을 포함한다.
8. 콘텐츠 검증 상태와 참조 문서 링크를 기록한다.

참고할 수 있는 문서:
- Google Machine Learning Crash Course
- Google Machine Learning Glossary
- Hugging Face Course
- PyTorch 공식 튜토리얼
- scikit-learn 공식 문서
- OpenAI 공식 개발자 문서
- Anthropic 공식 개발자 문서

콘텐츠의 출처를 확인할 수 있어야 한다.

검증되지 않은 주장을 근거 있는 사실처럼 표시하지 않는다.

## 12. 테스트 및 완료 기준

다음 항목을 검증하라.

기능:
- 학습 콘텐츠 탐색
- 개념 상세 학습
- 암기 카드
- 정답 기록
- 취약점 추천
- 간격 반복 복습
- 모의시험
- 타이머
- 결과 채점
- 통계 대시보드
- 진도 데이터 영속성

콘텐츠:
- 최소 100개의 완성된 학습 개념
- 최소 200개의 검증된 예상문제
- 모든 문제의 정답과 해설
- 학습 개념과 문제 간 연결
- 중복 및 모순 검증

품질:
- TypeScript 타입 검사
- Lint
- 빌드
- 핵심 기능 테스트
- 모바일 레이아웃 테스트
- 저장 및 복원 테스트
- 시험 진행 중 새로고침 복구 테스트

배포:
- 기존 Mac Studio 서비스와 충돌 없음
- Tailscale을 통한 모바일 접근
- HTTPS
- 재부팅 후 자동 시작
- 서비스 운영 문서 작성

## 13. 개발 진행 지침

다음 순서로 진행하라.

Phase 1. 조사 및 설계
- 대회 공식 평가 방향 재확인
- 핵심 학습 개념 선정
- 우선순위 결정
- 데이터 모델 설계
- UX 설계

Phase 2. 핵심 학습 경험
- 모바일 화면
- 학습 콘텐츠 뷰어
- 개념별 퀴즈
- 학습 진도 관리
- 초기 고품질 콘텐츠 제작

Phase 3. 전체 콘텐츠 확장
- 100개 이상 개념 작성
- 200개 이상 문제 작성
- 콘텐츠 정확성 검증
- 헷갈리는 개념 비교 구축

Phase 4. 적응형 학습
- 취약점 분석
- 반복 복습
- 학습 추천
- 모의시험
- 결과 분석

Phase 5. 운영 및 검증
- 품질 테스트
- Tailscale 배포
- 모바일 접속 검증
- 운영 문서 작성

시간이 부족하다면 기능의 화려함보다 실제 학습에 필요한 고품질 콘텐츠와 기본 학습 흐름을 우선하라.

우선순위는 다음과 같다.

P0:
- 핵심 콘텐츠
- 모바일 학습
- 개념별 확인 문제
- 진도 저장
- Tailscale 접속

P1:
- 암기 카드
- 취약점 복습
- 비교 학습
- 모의시험

P2:
- 고급 통계
- 애니메이션
- 선택적 AI 튜터
- 추가 시각화

## 14. 최종 지시

기획서만 작성하고 종료하지 말고, 실제 동작하는 서비스를 완성하라.

개발 과정에서 필요하다면 하위 에이전트를 활용해 콘텐츠 제작, 검증, 프론트엔드 개발, 테스트를 병렬로 진행해도 좋다.

단, 콘텐츠 품질과 전체 데이터 구조는 일관되게 관리하라.

사용자가 지금부터 바로 공부할 수 있는 실용적인 시스템을 만드는 것이 목적이다.

개발 완료 후 다음을 보고하라.

1. 구현된 주요 기능
2. 콘텐츠 개념 수 및 문제 수
3. 콘텐츠 검증 결과
4. Tailscale 접속 주소
5. 모바일 접속 확인 결과
6. 테스트 결과
7. 남은 이슈
8. 추천 학습 시작 경로

이 웹앱은 개발 결과물을 보여주기 위한 데모가 아니다.

**2026년 10월 18일 시험에서 실제로 사용자의 AI 기초 지식과 활용 역량을 향상시키기 위한 실전 학습 도구다.**

그 목적에 집중하여 구현하라.
