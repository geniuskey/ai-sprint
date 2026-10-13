# D/E/F 콘텐츠 출처 및 검토 기록

확인일: 2026-10-13. `content/practice.json`은 RAG 13개, Agent 15개, 실전 활용 14개 개념과 회상 42문항·응용 42문항, 사례형 시나리오 8개를 포함한다. 설명·비유·문제·시나리오는 이 앱을 위해 작성한 학습 자료다. 공식 기출이나 대회 출제 범위를 뜻하지 않는다.

검증 상태는 **공식 자료의 핵심 원리 대조와 작성자 자체 검토**다. 독립 전문가의 전수 검수나 실제 수험생 대상 문항 난이도 검증은 수행하지 않았다. 자료를 열어 핵심 정의와 설계상 주의사항을 확인하고 예제의 수치 및 정답·오답 해설을 대조했다. 구조 검사 통과만으로 사실 정확성이나 문항의 교육적 효과를 보증하지 않는다.

## 출처와 대조 범위

| 자료 | 대조한 항목과 적용 범위 |
| --- | --- |
| [Anthropic: Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval) | 검색 후 근거를 생성 입력에 제공하는 구조, 청크 문맥 손실, 키워드·임베딩 결합과 재순위화. 게시물의 특정 벤치마크 향상률을 일반 성능 보장으로 사용하지 않았다. |
| [Sentence Transformers: Semantic Search](https://www.sbert.net/examples/sentence_transformer/applications/semantic-search/README.html) | 질의·문서의 호환되는 벡터 공간, 검색용 모델과 질의·문서 인코딩, 정규화와 유사도. 제품별 API 세부 동작과 일반 임베딩 원리를 구분했다. |
| [Sentence Transformers: Retrieve & Re-Rank](https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html) | 후보 검색과 후보 내 재순위화의 역할. 재순위화가 후보 밖의 정답을 자동으로 가져오지 못함을 설명했다. |
| [Elastic: Vector search](https://www.elastic.co/docs/solutions/search/vector) / [Hybrid search](https://www.elastic.co/docs/solutions/search/hybrid-search) | 벡터 색인·근사 검색과 키워드/의미 검색 결합. 한 제품의 기능을 모든 벡터 DB의 필수 기능으로 단정하지 않았다. |
| [scikit-learn: cosine_similarity](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html) | 정규화된 내적 정의와 단위 벡터에서 내적과의 관계. 영벡터의 수학적 정의와 라이브러리 처리 규칙을 구분했다. |
| [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | 미리 정한 워크플로와 동적 행동 선택의 차이, 단순한 기준선, 실행 피드백과 복잡성의 비용. 2024년 설계 글이며 모든 공급자의 용어 정의를 강제하는 규격은 아니다. |
| [MCP: Architecture](https://modelcontextprotocol.io/docs/learn/architecture) / [Tools specification, 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) | 호스트·클라이언트·서버 역할과 도구 제공·호출. 구조 페이지는 확인 당시 2026-07-28 문서로 연결됐다. 도구 규격은 명시한 버전이며 최신 버전과 동일하다고 주장하지 않는다. |
| [MCP: Security best practices, 2025-11-25](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices) | 권한과 신뢰 경계, 외부 입력과 실행 통제. 초안의 2025-06-18 보안 링크가 이 문서로 이동해 최종 링크와 버전 표기를 수정했다. |
| [Anthropic: Writing effective tools](https://www.anthropic.com/engineering/writing-tools-for-agents) | 도구 설명·입력·응답 설계와 실제 평가. 함수 호출 요청을 실제 실행 완료와 구분했다. |
| [Anthropic: Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | 현재 문맥과 외부 메모리, 관련 정보 선택과 압축의 손실. 영속 저장만으로 모든 정보가 현재 호출에 들어간다고 설명하지 않았다. |
| [Anthropic: Demystifying evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | 과업·시도·채점 기준과 실제 환경 상태 평가, 코드·모델·사람 평가의 역할. 완료 선언이나 단일 성공을 안정성 보장으로 취급하지 않았다. |
| [AWS: Timeouts, retries and backoff](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) | 타임아웃과 실행 실패의 차이, 재시도 부하, 백오프·지터·멱등성. 클라이언트 키만으로 서버의 멱등 처리를 보장하지 않음을 시나리오에 반영했다. |
| [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/) | 로그·메트릭·트레이스의 역할과 요청 단위 추적. 모든 원문 기록을 권장하지 않고 민감값 보호를 포함했다. |
| [NIST: Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) | 허위 생성·정보 무결성·개인정보 관련 위험과 검증 필요성. 구체적인 법률 준수나 완전 안전을 보장하는 자료로 취급하지 않았다. |
| [Python: unittest](https://docs.python.org/3/library/unittest.html) / [scikit-learn: Common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html) | 테스트 사례·기대값·데이터 누출·재현성 관련 기본 원리. 요구사항 분석·비용 비교 사례는 이러한 검증 원칙을 적용해 직접 작성한 실무 예제다. |

## 수치와 문항 검토

- 코사인 예제 `(1,0)`과 `(3,0)`은 내적 3, 길이의 곱 3으로 유사도 1이다. Recall@5 예제는 관련 문서 4개 중 3개 회수이므로 0.75이며 precision은 3/5=0.6이다.
- 불량 시나리오의 TP 80, FN 20, FP 90, TN 9,810으로 recall 80%, precision 약 47.1%, accuracy 98.9%다. 항상 정상 예측의 accuracy는 99%여서 정확도 단독 판단의 한계를 드러낸다.
- 수율 80%에서 92%는 상대 15% 증가, 12%포인트 증가다. 라우팅 예제의 2+0.5×10=7은 부가 비용 제외 가상 비용이며 10 대비 30% 절감이다.
- 각 개념의 회상·응용 문항은 다른 질문과 개별 오답 해설을 가진다. 표시 색상·글꼴처럼 무관한 오답 21개를 검색 공간 호환성, 평가 범위, 권한, 독립 기대값 등에 관한 오개념으로 교체했다.
- 정답 인덱스는 회상·응용 유형 각각 네 위치에 분산시켰다. 배열 회전 시 선택지와 설명을 함께 회전해 일치시켰다. 고유 ID·선수 지식·퀴즈·시나리오 링크와 순환 여부는 공통 validator로 검사한다.

## 학습 우선순위

우선순위 1은 문제 정의·도구 활용·결과 검증에 직접 연결되는 기반 및 자주 혼동하는 판단에 부여했다. 우선순위 2는 이를 보완하는 수학·저장·운영 설계 개념이다. 각 개념에는 구체적인 선정 이유를 남겼다. 출제 확률이나 합격 가능성의 수치가 아니다.
