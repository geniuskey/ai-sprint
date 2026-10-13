# A/B/C/G 콘텐츠 출처와 검토 기록

확인일: 2026-10-14. `content/foundations.json`은 AI/ML 기초 20개, 딥러닝/LLM 23개, 프롬프트 11개, 최신 기술 9개로 총 63개 개념과 회상 63문항·응용 63문항을 포함한다. 설명, 비유, 업무 예시와 문항은 자체 작성했으며 공식 기출이나 공개되지 않은 시험 범위를 뜻하지 않는다.

검증 상태는 **공식 문서와 원 논문의 기본 정의 대조 및 작성자 자체 검토**다. 아래 자료를 웹으로 열어 접근 가능성과 핵심 설명을 확인했다. 독립 전문가 전수 감수나 학습자 대상 난이도 실험은 수행하지 않았다. 참조 링크는 해당 개념의 정의·원리를 뒷받침하며 자체 작성 업무 사례 전체가 해당 자료에서 검증됐다는 뜻은 아니다. 모델별 지원 기능·API 상세·라이선스는 사용 시 다시 확인해야 한다.

## 자료별 대조 범위

| 자료 | 대조 범위 |
| --- | --- |
| [Google Machine Learning Glossary](https://developers.google.com/machine-learning/glossary) | 지도·비지도·강화학습, 분류·회귀·과적합과 기본 신경망 용어. 방법의 포함 관계와 생성이라는 출력 목적을 구분했다. |
| [scikit-learn 평가 지표](https://scikit-learn.org/stable/modules/model_evaluation.html) | 혼동 행렬과 정확도·정밀도·재현율·F1·ROC-AUC. 다중 클래스, 평균 방법, 임계값과 분포에 따른 해석 차이를 단일 점수로 덮지 않았다. |
| [scikit-learn Common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html) / [Cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html) | 전처리 누출, 분할, 훈련과 평가의 분리, 시간·집단 의존성을 고려한 평가. |
| [PyTorch 자동미분](https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html) | 계산 그래프·미분·역전파와 파라미터 갱신의 차이. 비선형 활성화 없이 편향을 포함해 층을 합성하면 아핀 변환이며 편향이 없으면 선형 변환이라는 구분을 반영했다. |
| [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | 어텐션·멀티헤드·위치 정보와 Transformer 구조의 기반. 원 논문의 특정 위치 인코딩을 모든 현대 모델의 유일한 방식으로 제시하지 않았다. |
| [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1) / [Generation](https://huggingface.co/docs/transformers/main_classes/text_generation) | 토큰·LLM 활용과 샘플링 설정. temperature와 top-p/top-k를 사실성 보장이나 검색 결과 개수와 구분했다. |
| [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) | 선호 쌍을 통한 정책 학습과 명시적 보상 모델 기반 단계의 차이. DPO를 아무 기준 없이 정답만 복사하는 지도학습과 동일시하지 않았다. |
| [Anthropic Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) | 성공 기준, 명확한 지시, 예시와 반복 평가. 특정 프롬프트 문구가 모든 모델에서 항상 성능을 올린다고 주장하지 않았다. |
| [JSON Schema object](https://json-schema.org/understanding-json-schema/reference/object) | properties·required·additionalProperties, 누락과 null 구분. 구문·스키마·업무 의미 검증을 나누었다. |
| [Anthropic Prompt injection defenses](https://www.anthropic.com/research/prompt-injection-defenses) | 외부 자료의 공격 지시와 다층 방어. 경고 프롬프트 하나나 낮은 temperature로 완전 방어를 보장하지 않았다. |
| [Hugging Face Multimodal tasks](https://huggingface.co/learn/computer-vision-course/en/unit4/multimodal-models/tasks-models-part1) / [Image-text-to-text](https://huggingface.co/docs/transformers/tasks/image_text_to_text) | 모달리티 연결, 시각 질의응답·문서 해석·이미지 텍스트 과업. 지원 입출력과 세부 판독의 정확도를 구분했다. |
| [Robust Speech Recognition](https://arxiv.org/abs/2212.04356) / [Hugging Face TTS](https://huggingface.co/docs/transformers/tasks/text-to-speech) | 음성 인식과 음성 합성의 반대 방향, 전사·발음 정확성. TTS 원고의 사실성은 음질과 별개이며 정비 문구의 부정어·숫자는 직접 대조하도록 했다. |
| [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239) | 잡음 부가와 학습한 복원 과정, 생성 샘플링. 합성 결함 데이터의 실제 공정 유효성은 별도 평가를 요구한다. |
| [Hugging Face Open R1 for Students](https://huggingface.co/learn/llm-course/chapter12/1) / [DeepSeek-R1 원 논문](https://arxiv.org/abs/2501.12948) | 추론 행동 학습과 추론 시 계산. 특정 모델의 벤치마크 수치를 보편적 성능 보장으로 옮기지 않았다. |
| [OSI Open Source AI Definition 1.0](https://opensource.org/ai/open-source-ai-definition) | 가중치 공개와 오픈소스 정의의 차이. 라이선스·가중치 접근·호스팅 위치는 각각 확인하는 조건이며 법률 자문을 제공하는 콘텐츠가 아니다. |
| [Google AI Edge LiteRT-LM](https://developers.google.com/edge/litert-lm) / [LLM Inference guide](https://developers.google.com/edge/mediapipe/solutions/genai/llm_inference) | 로컬 추론과 장치 자원·플랫폼 지원. 온디바이스라는 이름만으로 로그 전송이 없다고 단정하지 않았다. |
| [Claude Code Best practices](https://code.claude.com/docs/en/best-practices) / [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | 코드 문맥 탐색, 도구 실행, 검증 가능한 기대값과 피드백. 완료 선언·테스트 개수보다 실제 변경과 요구사항 충족을 검토한다. |

## 자체 검토와 구조 검사

- 모든 개념은 쉬운 설명, 비유, 기술 설명, 업무 예시, 오개념, 비교, 기억할 내용, 선수 개념, 출처와 검증 상태를 가진다.
- 문항은 개념별 회상·응용 1개씩이며 선택지 네 개 각각에 개별 해설을 붙였다. 단순 글자 수 충족 대신 혼동하는 개념과 실제 실패 이유를 설명하도록 짧은 해설을 보강했다.
- 정답 위치는 개념 순번에 따라 회전하고 응용에 한 칸 차이를 두어 유형별로도 분산시켰다. 선택지와 해설을 함께 회전한다.
- 공통 `node scripts/validate-content.mjs` 검사 결과 전체 105개 개념·210개 문항·8개 시나리오에서 오류 0개다. 정답 위치 분포는 52/54/53/51이다. ID 중복·링크 누락·선수 개념 순환·유형별 위치 편중을 검사했다.
- 구조 검사 통과가 사실 정확성이나 교육 효과의 자동 보증은 아니다. 우선순위는 공개 평가 방향과 선수 지식·혼동 위험에 따른 자체 편집 판단이며 출제 확률이 아니다.
