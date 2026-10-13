import { useEffect, useState, useRef, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Bookmark,
  Check,
  ChevronRight,
  Clock,
  Flame,
  Home,
  Layers,
  RefreshCw,
  Search,
  Settings,
  Target,
  TrendingUp,
  Zap,
  Sun,
  Moon,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  GitCompareArrows,
  Lightbulb,
  GraduationCap,
} from "lucide-react";
import type {
  Catalog,
  Concept,
  State,
  Exam,
  Question,
  Category,
} from "./types";
const categories: Record<Category, string> = {
  A: "AI · 머신러닝 기초",
  B: "딥러닝 · LLM 원리",
  C: "프롬프트 엔지니어링",
  D: "RAG · 지식 활용",
  E: "Agent · 시스템 설계",
  F: "실전 AI 활용",
  G: "최신 AI 기술",
};
const go = (path: string) => {
  window.location.hash = path;
  window.scrollTo(0, 0);
};
async function api<T>(url: string, method = "GET", data?: unknown): Promise<T> {
  const r = await fetch("/api" + url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  });
  const result = await r.json();
  if (!r.ok) throw new Error(result.error || "요청을 처리하지 못했습니다.");
  return result;
}
const pct = (n: number) => Math.round(n);
function examCountdown() {
  const hours = Math.max(0, Math.floor((Date.parse("2026-10-18T14:00:00+09:00") - Date.now()) / 3600000));
  return hours >= 24 ? `시험까지 ${Math.floor(hours / 24)}일 ${hours % 24}시간` : `시험까지 ${hours}시간`;
}
const day = (s: string) =>
  new Date(s).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
const mastery = (state: State, id: string) => state.progress[id]?.mastery || 0;
function Pill({ children, tone = "" }: { children: ReactNode; tone?: string }) {
  return <span className={"pill " + tone}>{children}</span>;
}
function Heading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}
function App() {
  const [path, setPath] = useState(location.hash.slice(1) || "/");
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [state, setState] = useState<State | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const fn = () => setPath(location.hash.slice(1) || "/");
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  async function reload() {
    try {
      setState(await api<State>("/state"));
    } catch (e) {
      setError((e as Error).message);
      throw e;
    }
  }
  useEffect(() => {
    Promise.all([api<Catalog>("/catalog"), api<State>("/state")])
        .then(([c, s]) => {
          setCatalog(c);
          setState(s);
        })
        .catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    const sync = () => {
      if (document.visibilityState !== "visible") return;
      void api<State>("/state")
        .then(setState)
        .catch((e) => setError(e.message));
    };
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = state?.settings.theme || "light";
  }, [state?.settings.theme]);
  async function mutate(url: string, data: unknown, method = "POST") {
    try {
      const r = await api(url, method, data);
      await reload();
      return r;
    } catch (e) {
      setError((e as Error).message);
      throw e;
    }
  }
  if (!catalog || !state)
    return <div className="loading-screen" role="status">
      <div className="brand"><span className="brand-icon"><Zap size={23} /></span>AI Sprint</div>
      {error ? <><p role="alert" className="error">{error}</p><button className="primary" onClick={() => location.reload()}>다시 연결</button></> : <p>학습 공간을 불러오는 중…</p>}
    </div>;
  const nav = [
    { path: "/", name: "오늘", icon: Home },
    { path: "/learn", name: "학습", icon: BookOpen },
    { path: "/review", name: "복습", icon: Layers },
    { path: "/exams", name: "모의시험", icon: GraduationCap },
    { path: "/stats", name: "통계", icon: TrendingUp },
  ];
  const studied = Object.values(state.progress).length;
  const due = catalog.concepts.filter(
    (c) =>
      state.progress[c.id] &&
      new Date(state.progress[c.id].nextReview) <= new Date(),
  );
  const ranked = [...catalog.concepts].sort((a, b) => {
    const pa = state.progress[a.id],
      pb = state.progress[b.id];
    const score = (c: Concept, p: typeof pa) =>
      (p && new Date(p.nextReview) <= new Date() ? -100 : 0) +
      (p?.mastery || 0) +
      c.priority * 12;
    return score(a, pa) - score(b, pb);
  });
  const sorted: Concept[] = [];
  const added = new Set<string>();
  function addConcept(c: Concept) {
    if (added.has(c.id)) return;
    added.add(c.id);
    for (const id of c.prerequisites) {
      const pre = catalog!.concepts.find((x) => x.id === id);
      if (pre && mastery(state!, id) < 60) addConcept(pre);
    }
    sorted.push(c);
  }
  ranked.forEach(addConcept);
  const todayCount = Object.values(state.progress).filter(
    (p) =>
      new Date(p.lastStudied).toLocaleDateString() ===
      new Date().toLocaleDateString(),
  ).length;
  return (
    <div className="app">
      <aside className="sidebar">
        <a href="#/" className="brand">
          <span className="brand-icon">
            <Zap size={22} />
          </span>
          AI Sprint<span className="tiny">2026</span>
        </a>
        <div className="sidebar-caption">MY LEARNING SPACE</div>
        <nav>
          {nav.map((n) => (
            <a
              key={n.path}
              className={
                path === n.path || (n.path !== "/" && path.startsWith(n.path))
                  ? "active"
                  : ""
              }
              href={"#" + n.path}
            >
              <n.icon size={20} />
              {n.name}
              {n.path === "/review" && due.length > 0 && (
                <span className="nav-count">{due.length}</span>
              )}
            </a>
          ))}
        </nav>
        <div className="side-tools">
          <a href="#/compare">
            <GitCompareArrows size={19} />
            개념 비교
          </a>
          <a href="#/scenarios">
            <Lightbulb size={19} />
            상황별 판단 연습
          </a>
          <a href="#/notes">
            <Bookmark size={19} />
            최종 암기 노트
          </a>
        </div>
        <div className="sidebar-bottom">
          <div className="mini-note">
            <Flame size={19} />
            <strong>작은 이해, 큰 차이</strong>
            <p>하루 10분씩 쌓아가는 AI 자신감</p>
          </div>
          <a href="#/settings">
            <Settings size={18} />
            설정 · 데이터 관리
          </a>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>나를 위한 AI 학습 루틴</span>
          <div>
            <span className="status-dot" />
            진도 자동 저장
            <button
              className="icon-button"
              aria-label="테마 변경"
              onClick={() =>
                void mutate(
                  "/settings",
                  {
                    theme: state.settings.theme === "light" ? "dark" : "light",
                  },
                  "PATCH",
                ).catch(() => {})
              }
            >
              {state.settings.theme === "light" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </button>
            <a className="icon-button" aria-label="설정" href="#/settings">
              <Settings size={18} />
            </a>
          </div>
        </header>
        <main>
          {error && (
            <div className="error-banner" role="alert">
              {error}
              <button onClick={() => setError("")}>닫기</button>
            </div>
          )}
          {path === "/" && (
            <>
              <div className="greeting">
                <Heading
                  eyebrow="A LITTLE EVERY DAY"
                  title="오늘도, 한 걸음 더."
                >
                  알고 있는 것은 단단하게, 헷갈리는 것은 명확하게.
                </Heading>
                <Pill tone="orange">
                  {state.settings.generalMode
                    ? "일반 학습 모드"
                    : new Date() >= new Date("2026-10-18T14:00:00+09:00")
                      ? "시험 이후 · 계속 학습"
                      : examCountdown()}
                </Pill>
              </div>
              <section className="hero">
                <div>
                  <div className="hero-label">
                    <span className="live-dot" /> TODAY’S FOCUS
                  </div>
                  <h2>
                    10분만 집중해볼까요?
                    <br />
                    <span>이해에서 활용으로.</span>
                  </h2>
                  <p>
                    복습할 개념과 중요한 기초부터.
                    <br />
                    지금 필요한 학습을 골라두었어요.
                  </p>
                  <button className="lime" onClick={() => go("/session")}>
                    오늘의 10분 학습 시작
                    <ArrowRight size={19} />
                  </button>
                  <div className="hero-meta">
                    <Clock size={14} /> 약 10분 <span>·</span> 핵심 개념 + 확인
                    문제
                  </div>
                </div>
                <div className="orbit-art" aria-hidden="true">
                  <div className="orbit o1" />
                  <div className="orbit o2" />
                  <div className="orbit o3" />
                  <div className="orbit-core">
                    <Zap size={55} fill="currentColor" />
                  </div>
                  <span className="float-tag tag1">
                    <Check size={15} /> 이해 완료
                  </span>
                  <span className="float-tag tag2">한 개념씩, 확실하게</span>
                  <span className="spark">✦</span>
                </div>
              </section>
              <div className="metric-grid">
                <Metric
                  icon={<Target />}
                  value={`${studied} / ${catalog.concepts.length}`}
                  label="회상 · 문제 풀이한 개념"
                />
                <Metric
                  icon={<RefreshCw />}
                  value={`${due.length}개`}
                  label="지금 복습할 개념"
                />
                <Metric
                  icon={<TrendingUp />}
                  value={
                    state.attempts.length
                      ? `${pct((state.attempts.slice(-20).filter((a) => a.correct).length / Math.min(20, state.attempts.length)) * 100)}%`
                      : "—"
                  }
                  label="최근 20문제 정답률"
                />
              </div>
              <div className="daily-goal">
                <div>
                  <span>
                    <Flame size={16} />
                    오늘의 목표
                  </span>
                  <strong>
                    {todayCount} / {state.settings.dailyGoal}개 개념
                  </strong>
                </div>
                <div className="track">
                  <span
                    style={{
                      width:
                        Math.min(
                          100,
                          (todayCount / state.settings.dailyGoal) * 100,
                        ) + "%",
                    }}
                  />
                </div>
                <p>회상하거나 문제를 푼 개념으로 계산해요.</p>
              </div>
              <div className="section-title">
                <h2>지금 배우면 좋은 개념</h2>
                <a href="#/learn">
                  전체 학습
                  <ArrowRight size={16} />
                </a>
              </div>
              <div className="recommend-grid">
                {sorted.slice(0, 3).map((c, i) => (
                  <button
                    key={c.id}
                    className="recommend"
                    onClick={() => go("/learn/" + c.id)}
                  >
                    <div className="card-top">
                      <span className={"category-mark c" + c.category}>
                        {c.category}
                      </span>
                      <span className="muted small">
                        {c.estimatedMinutes}분
                      </span>
                    </div>
                    <span className="small muted">
                      {categories[c.category]}
                    </span>
                    <h3>{c.title}</h3>
                    <p>{c.summary}</p>
                    <div className="card-bottom">
                      <Pill>
                        {state.progress[c.id]
                          ? "다시 꺼내보기"
                          : i === 0
                            ? "먼저 배우기"
                            : "핵심 다지기"}
                      </Pill>
                      <ArrowRight size={19} />
                    </div>
                  </button>
                ))}
              </div>
              <div className="two-col">
                <section className="panel">
                  <div className="section-title">
                    <h2>영역별 학습 현황</h2>
                    <a href="#/stats">
                      자세히
                      <ChevronRight size={16} />
                    </a>
                  </div>
                  <CategoryBars catalog={catalog} state={state} />
                </section>
                <section className="practice-panel">
                  <span className="eyebrow">PUT IT INTO PRACTICE</span>
                  <div className="practice-icon">
                    <Lightbulb size={30} />
                  </div>
                  <h2>
                    아는 것과
                    <br />
                    선택하는 것은 다르니까.
                  </h2>
                  <p>
                    실제 상황에서 적절한 도구와 접근법을 선택하며 판단력을
                    길러보세요.
                  </p>
                  <button
                    className="secondary"
                    onClick={() => go("/scenarios")}
                  >
                    상황별 판단 연습
                    <ArrowRight size={17} />
                  </button>
                  <a href="#/compare" className="text-link">
                    헷갈리는 개념 나란히 비교하기
                    <ChevronRight size={16} />
                  </a>
                </section>
              </div>
              <div className="official-note">
                <AlertCircle size={19} />
                <p>
                  <strong>학습 우선순위는 준비 전략입니다.</strong> 공식 공개
                  일정은 10월 17–18일이며, 평가 방향은 AI 리터러시와 문제 해결
                  역량입니다. 10월 18일 응시 일정과 A·B의 문항 수·시간은 사용자
                  제공 준비 정보이며, 지식형·사례형 구성은 준비용 가설입니다.{" "}
                  <a
                    href="https://skhynix-hackathon.com/ai-2026"
                    target="_blank"
                    rel="noreferrer"
                  >
                    공식 안내 ↗
                  </a>
                </p>
              </div>
            </>
          )}
          {path === "/learn" && <Library catalog={catalog} state={state} />}
          {path.startsWith("/learn/") && (
            <Lesson
              key={path}
              concept={catalog.concepts.find(
                (c) => c.id === path.split("/")[2],
              )}
              catalog={catalog}
              state={state}
              mutate={mutate}
            />
          )}
          {path === "/session" && (
            <Session
              catalog={catalog}
              state={state}
              concepts={sorted}
              mutate={mutate}
            />
          )}
          {path === "/review" && (
            <Review catalog={catalog} state={state} reload={reload} />
          )}
          {path.startsWith("/compare") && <Compare catalog={catalog} />}
          {path === "/scenarios" && <Scenarios catalog={catalog} />}
          {path.startsWith("/exams") && (
            <Exams
              key={path}
              path={path}
              catalog={catalog}
              state={state}
              reload={reload}
            />
          )}
          {path === "/notes" && <Notes catalog={catalog} state={state} />}
          {path === "/stats" && (
            <>
              <Heading
                eyebrow="YOUR LEARNING, IN FOCUS"
                title="조금씩 쌓인 이해"
              >
                읽은 페이지 수 대신, 회상과 문제 풀이를 기록합니다.
              </Heading>
              <div className="metric-grid">
                <Metric
                  icon={<BookOpen />}
                  value={`${studied}개`}
                  label="학습한 개념"
                />
                <Metric
                  icon={<CheckCircle2 />}
                  value={`${Object.values(state.progress).filter((p) => p.mastery >= 80).length}개`}
                  label="숙련도 80 이상"
                />
                <Metric
                  icon={<Target />}
                  value={`${state.attempts.length}회`}
                  label="전체 문제 풀이"
                />
              </div>
              <section className="panel">
                <h2>영역별 숙련도</h2>
                <CategoryBars catalog={catalog} state={state} />
                <p className="muted small">
                  영역의 모든 개념 숙련도 평균입니다. 미학습 개념은 0으로
                  계산합니다.
                </p>
              </section>
              <div className="section-title">
                <h2>다음에 집중할 개념</h2>
              </div>
              {sorted.slice(0, 8).map((c) => (
                <ConceptRow key={c.id} c={c} state={state} />
              ))}
              <section className="panel">
                <h2>최근 풀이 기록</h2>
                {state.attempts
                  .slice(-15)
                  .reverse()
                  .map((a) => (
                    <div className="history-row" key={a.id}>
                      <span className={a.correct ? "success" : "incorrect"}>
                        {a.correct ? "정답" : "오답"}
                      </span>
                      <a href={"#/learn/" + a.conceptId}>
                        {catalog.concepts.find((c) => c.id === a.conceptId)
                          ?.title || a.conceptId}
                      </a>
                      <span className="muted small">{day(a.at)}</span>
                    </div>
                  ))}
                {!state.attempts.length && (
                  <p className="muted">
                    첫 번째 확인 문제를 풀면 기록이 시작됩니다.
                  </p>
                )}
              </section>
            </>
          )}
          {path === "/settings" && (
            <SettingsPage
              state={state}
              mutate={mutate}
              reload={reload}
            />
          )}
        </main>
        <footer>
          AI Sprint <span>·</span> 매일 조금씩, 확실하게 이해하기.
        </footer>
      </div>
      <nav className="mobile-nav">
        {nav.map((n) => (
          <a
            key={n.path}
            className={
              path === n.path || (n.path !== "/" && path.startsWith(n.path))
                ? "active"
                : ""
            }
            href={"#" + n.path}
          >
            <n.icon size={21} />
            <span>{n.name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
function Metric({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="metric">
      <span className="metric-icon">{icon}</span>
      <div>
        <strong>{value}</strong>
        <p>{label}</p>
      </div>
    </div>
  );
}
function CategoryBars({ catalog, state }: { catalog: Catalog; state: State }) {
  return (
    <div className="category-bars">
      {Object.entries(categories).map(([id, title]) => {
        const cs = catalog.concepts.filter((c) => c.category === id);
        const p = pct(
          cs.reduce((sum, c) => sum + mastery(state, c.id), 0) /
            (cs.length || 1),
        );
        return (
          <div key={id} className="category-bar">
            <div>
              <span>{title}</span>
              <strong>{p}%</strong>
            </div>
            <div className="track">
              <span style={{ width: p + "%" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
function ConceptRow({ c, state }: { c: Concept; state: State }) {
  return (
    <button className="concept-row" onClick={() => go("/learn/" + c.id)}>
      <span className={"category-mark c" + c.category}>{c.category}</span>
      <div>
        <strong>{c.title}</strong>
        <p>
          {categories[c.category]} · {c.estimatedMinutes}분 · 우선순위{" "}
          {c.priority}
        </p>
      </div>
      <div className="row-end">
        {state.bookmarks.includes(c.id) && (
          <Bookmark size={15} fill="currentColor" />
        )}
        <span>{mastery(state, c.id)}%</span>
        <ChevronRight size={18} />
      </div>
    </button>
  );
}
function Library({ catalog, state }: { catalog: Catalog; state: State }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [filter, setFilter] = useState("all");
  const items = catalog.concepts
    .filter(
      (c) =>
        (category === "all" || c.category === category) &&
        (filter === "all" ||
          (filter === "saved" && state.bookmarks.includes(c.id)) ||
          (filter === "weak" && mastery(state, c.id) < 60)) &&
        (c.title + " " + c.summary).toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => a.priority - b.priority);
  return (
    <>
      <Heading eyebrow="BUILD YOUR FOUNDATION" title="하나씩, 명확하게.">
        {catalog.concepts.length}개의 핵심 개념. 짧게 이해하고 직접 확인하세요.
      </Heading>
      <div className="search">
        <Search size={20} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="개념 또는 키워드 검색"
          aria-label="개념 검색"
        />
      </div>
      <div className="chips">
        <button
          className={category === "all" ? "selected" : ""}
          onClick={() => setCategory("all")}
        >
          모든 영역
        </button>
        {Object.entries(categories).map(([id, name]) => (
          <button
            key={id}
            className={category === id ? "selected" : ""}
            onClick={() => setCategory(id)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="section-title">
        <span className="muted">{items.length}개의 개념 · 우선순위순</span>
        <select
          aria-label="학습 상태 필터"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">전체 보기</option>
          <option value="saved">북마크</option>
          <option value="weak">취약 / 미학습</option>
        </select>
      </div>
      {items.map((c) => (
        <ConceptRow key={c.id} c={c} state={state} />
      ))}
      {!items.length && (
        <div className="empty">
          검색 결과가 없어요. 다른 키워드를 입력해 보세요.
        </div>
      )}
      <div className="quick-links">
        <a href="#/compare">
          개념 비교
          <GitCompareArrows size={20} />
        </a>
        <a href="#/scenarios">
          상황별 판단 연습
          <Lightbulb size={20} />
        </a>
        <a href="#/notes">
          최종 암기 노트
          <Bookmark size={20} />
        </a>
      </div>
    </>
  );
}
type Mutation = (
  url: string,
  data: unknown,
  method?: string,
) => Promise<unknown>;
function Lesson({
  concept: c,
  catalog,
  state,
  mutate,
  onComplete,
}: {
  concept?: Concept;
  catalog: Catalog;
  state: State;
  mutate: Mutation;
  onComplete?: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  if (!c)
    return (
      <div className="empty">
        개념을 찾을 수 없습니다.<a href="#/learn">학습 목록</a>
      </div>
    );
  return (
    <div className="lesson">
      <button className="back" onClick={() => go("/learn")}>
        <ArrowLeft size={17} />
        학습 목록
      </button>
      <div className="lesson-meta">
        <Pill>{categories[c.category]}</Pill>
        <span>
          <Clock size={14} />
          {c.estimatedMinutes}분
        </span>
        <button
          className={
            "icon-button " + (state.bookmarks.includes(c.id) ? "saved" : "")
          }
          aria-label="개념 북마크"
          onClick={() =>
            void mutate("/bookmark", {
              conceptId: c.id,
              bookmarked: !state.bookmarks.includes(c.id),
            }).catch(() => {})
          }
        >
          <Bookmark
            size={20}
            fill={state.bookmarks.includes(c.id) ? "currentColor" : "none"}
          />
        </button>
      </div>
      <h1>{c.title}</h1>
      <section className="summary">
        <span className="eyebrow">10초 핵심 요약</span>
        <p>{c.summary}</p>
      </section>
      <div className="recall-prompt">
        <Lightbulb size={22} />
        <div>
          <strong>잠깐, 내 말로 설명해 보세요.</strong>
          <p>이 개념이 해결하는 문제는 무엇인가요?</p>
          <button className="text-link" onClick={() => setRevealed(!revealed)}>
            {revealed ? "힌트 접기" : "생각한 뒤 힌트 보기"}
            <ChevronRight size={15} />
          </button>
          {revealed && <p className="recall-answer">{c.keyTakeaways[0]}</p>}
        </div>
      </div>
      <details open>
        <summary>1분 · 쉬운 설명</summary>
        <p>{c.simpleExplanation}</p>
        <blockquote>{c.analogy}</blockquote>
      </details>
      <details>
        <summary>3분 · 실무에서는 이렇게</summary>
        <p>{c.realWorldExample}</p>
      </details>
      <details>
        <summary>한 단계 깊이 · 기술 설명</summary>
        <p>{c.technicalExplanation}</p>
        <ConceptDiagram concept={c} />
        {c.prerequisites.length > 0 && (
          <div className="prerequisites">
            먼저 알면 좋은 개념:{" "}
            {c.prerequisites.map((id) => (
              <a key={id} href={"#/learn/" + id}>
                {catalog.concepts.find((x) => x.id === id)?.title || id}
              </a>
            ))}
          </div>
        )}
      </details>
      <details>
        <summary>헷갈리는 개념과 오해</summary>
        {c.comparisons.map((x, i) => (
          <div key={i}>
            <h3>
              {c.title} vs {x.with}
            </h3>
            <p>{x.distinction}</p>
          </div>
        ))}
        <h3>주의할 오개념</h3>
        <ul>
          {c.commonMisconceptions.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <a
          className="text-link"
          href={"#/compare?ids=" + encodeURIComponent(c.id)}
        >
          나란히 비교하기
          <ArrowRight size={16} />
        </a>
      </details>
      <section className="takeaways">
        <h3>
          <CheckCircle2 size={19} />
          기억할 핵심
        </h3>
        <ul>
          {c.keyTakeaways.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
      <div className="section-title">
        <h2>이해했는지 확인해 볼까요?</h2>
        <Pill>직접 떠올리기</Pill>
      </div>
      {c.quizQuestions.map((id) => {
        const q = catalog.questions.find((x) => x.id === id);
        return q && <Quiz key={id} question={q} mutate={mutate} />;
      })}
      {onComplete && (
        <button className="primary wide" onClick={onComplete}>
          다음 학습으로
          <ArrowRight size={18} />
        </button>
      )}
      <details className="sources">
        <summary>학습 우선순위 · 출처 · 검증 상태</summary>
        <p>
          <strong>우선순위 {c.priority}:</strong> {c.priorityReason}
        </p>
        <p>
          {c.validation.status} · {c.validation.checkedAt}
        </p>
        <p>{c.validation.note}</p>
        {c.references.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="noreferrer">
            {r.title} ↗
          </a>
        ))}
      </details>
    </div>
  );
}
function ConceptDiagram({ concept: c }: { concept: Concept }) {
  const title = c.title.toLowerCase();
  const steps =
    title === "rag" || title.includes("rag의")
      ? [
          "사용자 질문",
          "관련 문서 검색",
          "근거 + 질문 구성",
          "LLM 답변",
          "인용 · 사실 검증",
        ]
      : title === "ai agent" || title === "agent"
        ? [
            "목표 · 제약 확인",
            "계획 · 도구 선택",
            "권한 확인",
            "도구 실행",
            "관찰 · 검증 · 반복",
          ]
        : title === "training / validation / test"
          ? ["훈련: 파라미터 학습", "검증: 설정 선택", "테스트: 최종 평가"]
          : null;
  return steps ? (
    <figure className="process-diagram">
      <figcaption>흐름으로 이해하기</figcaption>
      <div>
        {steps.map((step, i) => (
          <span key={step}>
            <b>{i + 1}</b>
            {step}
            {i < steps.length - 1 && <ArrowRight size={15} />}
          </span>
        ))}
      </div>
    </figure>
  ) : null;
}
function Quiz({
  question: q,
  mutate,
}: {
  question: Question;
  mutate: Mutation;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{
    correct: boolean;
    correctIndex: number;
    explanations: string[];
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const eventId = useRef(crypto.randomUUID());
  return (
    <section className="quiz">
      <Pill>{q.type === "application" ? "응용 판단" : "핵심 회상"}</Pill>
      <h3>{q.prompt}</h3>
      <div className="options">
        {q.options.map((o, i) => (
          <button
            key={i}
            disabled={!!result || busy}
            className={
              "option " +
              (selected === i ? "selected " : "") +
              (result
                ? i === result.correctIndex
                  ? "correct"
                  : selected === i
                    ? "wrong"
                    : ""
                : "")
            }
            onClick={() => setSelected(i)}
          >
            <span>{i + 1}</span>
            {o}
            {result && i === result.correctIndex && <Check size={18} />}
          </button>
        ))}
      </div>
      {!result ? (
        <button
          className="primary"
          disabled={selected === null || busy}
          onClick={async () => {
            setBusy(true);
            try {
              setResult(
                (await mutate("/answer", {
                  questionId: q.id,
                  selectedIndex: selected,
                  eventId: eventId.current,
                })) as typeof result,
              );
            } catch {
              /* Error shown by the app banner. */
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "저장 중…" : "정답 확인"}
        </button>
      ) : (
        <div className="feedback">
          <h4>
            {result.correct ? "정확히 이해했어요!" : "다시 보면 더 선명해져요."}
          </h4>
          {q.options.map((_, i) => (
            <p key={i}>
              <strong>
                {i + 1}번 {i === result.correctIndex ? "· 정답" : "· 오답"}
              </strong>{" "}
              {result.explanations[i]}
            </p>
          ))}
          <button
            className="text-link"
            onClick={() => {
              setResult(null);
              setSelected(null);
              eventId.current = crypto.randomUUID();
            }}
          >
            다시 풀기
            <RefreshCw size={15} />
          </button>
        </div>
      )}
    </section>
  );
}
function Session({
  concepts,
  catalog,
  state,
  mutate,
}: {
  concepts: Concept[];
  catalog: Catalog;
  state: State;
  mutate: Mutation;
}) {
  const [queue] = useState(() => {
    let minutes = 0;
    return concepts.filter((c) => {
      if (minutes >= 10) return false;
      minutes += c.estimatedMinutes;
      return true;
    });
  });
  const [index, setIndex] = useState(0);
  return index >= queue.length ? (
    <div className="empty">
      <CheckCircle2 size={48} />
      <h1>오늘의 작은 성취!</h1>
      <p>한 번 더 떠올리면 더 오래 기억해요.</p>
      <button className="primary" onClick={() => go("/review")}>
        암기 카드로 마무리
      </button>
    </div>
  ) : (
    <>
      <div className="session-progress">
        <strong>오늘의 10분</strong>
        <span>
          {index + 1} / {queue.length}개 개념
        </span>
        <div className="track">
          <span style={{ width: (index / queue.length) * 100 + "%" }} />
        </div>
      </div>
      <Lesson
        key={queue[index].id}
        concept={queue[index]}
        catalog={catalog}
        state={state}
        mutate={mutate}
        onComplete={() => {
          setIndex(index + 1);
          window.scrollTo(0, 0);
        }}
      />
    </>
  );
}
function Review({
  catalog,
  state,
  reload,
}: {
  catalog: Catalog;
  state: State;
  reload: () => Promise<void>;
}) {
  const [queue] = useState(() =>
    [...catalog.concepts].sort((a, b) => {
      const score = (c: Concept) => {
        const p = state.progress[c.id];
        return p
          ? new Date(p.nextReview) <= new Date()
            ? -100 + p.mastery
            : p.mastery + 100
          : c.priority * 10;
      };
      return score(a) - score(b);
    }),
  );
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const event = useRef(crypto.randomUUID());
  const c = queue[i];
  return (
    <>
      <Heading eyebrow="RECALL. REFLECT. REMEMBER." title="기억을 단단하게.">
        카드를 보기 전에, 소리 내어 설명해 보세요.
      </Heading>
      <div className="review-top">
        <Pill>
          {Math.min(i + 1, queue.length)} / {queue.length}
        </Pill>
        <span className="muted small">복습 예정 · 취약 개념 우선</span>
      </div>
      {c ? (
        <>
          <button
            className={"flashcard " + (flip ? "flipped" : "")}
            onClick={() => setFlip(!flip)}
          >
            <span className="eyebrow">
              {flip ? "핵심을 확인하세요" : "이 개념을 설명할 수 있나요?"}
            </span>
            <span className="flash-title">{c.title}</span>
            {flip ? (
              <>
                <p>{c.summary}</p>
                <span className="flash-takeaway">{c.keyTakeaways[0]}</span>
              </>
            ) : (
              <span className="tap-hint">
                <RefreshCw size={17} />
                터치해서 답 확인
              </span>
            )}
          </button>
          {flip ? (
            <div className="ratings">
              {["모름", "헷갈림", "알고 있음", "완벽히 이해"].map(
                (label, rating) => (
                  <button
                    key={label}
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await api("/review", "POST", {
                          conceptId: c.id,
                          rating,
                          eventId: event.current,
                        });
                        await reload();
                        event.current = crypto.randomUUID();
                        setI(i + 1);
                        setFlip(false);
                        setError("");
                      } catch (e) {
                        setError((e as Error).message);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <span>
                      {
                        [
                          "다시 배우기",
                          "빠르게 복습",
                          "간격 늘리기",
                          "충분히 기억",
                        ][rating]
                      }
                    </span>
                    {label}
                  </button>
                ),
              )}
            </div>
          ) : (
            <p className="muted center small">
              정답을 확인한 뒤, 이해도를 솔직하게 평가해 주세요.
            </p>
          )}
          <div className="center">
            <a className="text-link" href={"#/learn/" + c.id}>
              자세히 다시 배우기
              <ArrowRight size={15} />
            </a>
          </div>
        </>
      ) : (
        <div className="empty">
          <CheckCircle2 size={40} />
          <h2>카드를 모두 복습했어요.</h2>
          <button className="primary" onClick={() => go("/")}>
            오늘의 학습으로
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <section className="panel small muted">
        <strong>복습 일정은 어떻게 정하나요?</strong>
        <p>
          오답과 낮은 이해도는 빠르게 다시 보여줍니다. 연속 정답과 자신 있는
          회상이 쌓이면 간격이 늘어납니다. 시험 직전에는 복습 간격을 짧게
          제한합니다. 주관적 이해도만으로 완전한 숙련을 인정하지 않습니다.
        </p>
      </section>
    </>
  );
}
function Compare({ catalog }: { catalog: Catalog }) {
  const presets = [
    { label: "RAG vs Fine-tuning", terms: [/^RAG$|RAG의 원리/i, /SFT|RAG vs Fine-tuning/i] },
    { label: "Precision vs Recall", terms: [/Precision/i, /Recall/i] },
    { label: "Agent vs Workflow", terms: [/^AI Agent$|에이전트.*AI Agent/i, /Agent vs Workflow/i] },
    { label: "Tool Calling vs MCP", terms: [/^Tool Calling$|도구 호출.*Tool Calling/i, /\bMCP\b/i] },
    { label: "Token vs Embedding", terms: [/Tokenization/i, /^임베딩|^Embedding$/i] },
    { label: "Temperature vs Top-p", terms: [/^Temperature$/i, /Top-p/i] },
    { label: "Training vs Inference", terms: [/Pretraining/i, /Inference/i] },
    { label: "Prompt Injection vs Hallucination", terms: [/Prompt Injection/i, /Hallucination/i] },
  ].flatMap(({ label, terms }) => {
    const pair = terms.map((term) => catalog.concepts.find((c) => term.test(c.title)));
    return pair[0] && pair[1] && pair[0].id !== pair[1].id
      ? [{ label, left: pair[0].id, right: pair[1].id }]
      : [];
  });
  const initial = new URLSearchParams(location.hash.split("?")[1]).get("ids");
  const [left, setLeft] = useState(initial || presets[0]?.left || catalog.concepts[0]?.id || "");
  const [right, setRight] = useState(
    (!initial && presets[0]?.right) || catalog.concepts.find((c) => c.id !== left)?.id || "",
  );
  const a = catalog.concepts.find((c) => c.id === left),
    b = catalog.concepts.find((c) => c.id === right);
  const fields: [string, (c: Concept) => string][] = [
    ["정의", (c) => c.summary],
    ["해결하려는 문제", (c) => c.simpleExplanation],
    ["적합한 상황 · 활용 사례", (c) => c.realWorldExample],
    ["동작 방식 · 적용 조건", (c) => c.technicalExplanation],
    ["장점 · 기억할 핵심", (c) => c.keyTakeaways.join(" ")],
    [
      "단점 · 한계 · 혼동",
      (c) => c.comparisons.map((x) => x.distinction).join(" "),
    ],
    ["잘못 사용하는 사례 · 오개념", (c) => c.commonMisconceptions.join(" ")],
  ];
  return (
    <>
      <Heading eyebrow="CLEAR UP THE CONFUSION" title="비교하면, 더 명확하게.">
        정의부터 활용 조건까지 나란히 읽고 차이를 설명해 보세요.
      </Heading>
      <div className="chips" aria-label="자주 헷갈리는 개념 비교">
        {presets.map((preset) => (
          <button
            key={preset.label}
            className={left === preset.left && right === preset.right ? "selected" : ""}
            onClick={() => { setLeft(preset.left); setRight(preset.right); }}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="compare-pickers">
        {[
          [left, setLeft],
          [right, setRight],
        ].map(([value, setter], i) => (
          <label key={i}>
            비교 개념 {i + 1}
            <select
              value={value as string}
              onChange={(e) => (setter as (s: string) => void)(e.target.value)}
            >
              {catalog.concepts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      {a && b && (
        <>
          <div className="compare-table">
            <div className="compare-head">
              <strong>{a.title}</strong>
              <strong>{b.title}</strong>
            </div>
            {fields.map(([title, value]) => (
              <div className="compare-section" key={title}>
                <h3>{title}</h3>
                <div>
                  <p>{value(a)}</p>
                  <p>{value(b)}</p>
                </div>
              </div>
            ))}
          </div>
          <section className="takeaways">
            <h3>직접 구분해 보세요</h3>
            <p>
              두 개념이 서로 대체 가능한가요? 같은 시스템에서 함께 사용할 수
              있나요?
            </p>
            {[
              ...a.comparisons.filter((c) => c.with === b.title),
              ...b.comparisons.filter((c) => c.with === a.title),
            ].map((c, i) => (
              <p key={i}>{c.distinction}</p>
            ))}
          </section>
        </>
      )}
    </>
  );
}
function Scenarios({ catalog }: { catalog: Catalog }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const s = catalog.scenarios[index];
  return (
    <>
      <Heading
        eyebrow="THINK LIKE A PROBLEM SOLVER"
        title="상황을 읽고, 판단하세요."
      >
        도구 이름보다 중요한 것은 선택의 이유입니다.
      </Heading>
      <div className="chips">
        {catalog.scenarios.map((x, i) => (
          <button
            key={x.id}
            className={i === index ? "selected" : ""}
            onClick={() => {
              setIndex(i);
              setChoice(null);
              setChecked(false);
            }}
          >
            {i + 1}. {x.title}
          </button>
        ))}
      </div>
      {s && (
        <section className="scenario">
          <Pill tone="orange">실전 사고 연습</Pill>
          <h2>{s.title}</h2>
          <p className="lead">{s.situation}</p>
          <div className="constraints">
            <h3>판단에 필요한 제약조건</h3>
            <ul>
              {s.constraints.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <h3>어떤 접근을 선택하겠어요?</h3>
          <div className="options">
            {s.options.map((o, i) => (
              <button
                className={
                  "option " +
                  (choice === i ? "selected " : "") +
                  (checked && s.recommendedIndex === i ? "correct" : "")
                }
                key={o}
                onClick={() => {
                  if (!checked) setChoice(i);
                }}
                disabled={checked}
              >
                <span>{i + 1}</span>
                {o}
              </button>
            ))}
          </div>
          {!checked ? (
            <button
              className="primary"
              disabled={choice === null}
              onClick={() => setChecked(true)}
            >
              내 판단과 권장 접근 비교
            </button>
          ) : (
            <>
              <div className="feedback">
                <h3>
                  {choice === s.recommendedIndex
                    ? "제약조건을 잘 읽었어요."
                    : "이 조건에서 더 적합한 접근을 살펴봐요."}
                </h3>
                <p>{s.approach}</p>
                <h3>대안과 트레이드오프</h3>
                <ul>
                  {s.tradeoffs.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <h3>결과를 검증하는 방법</h3>
                <ul>
                  {s.verification.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <h3>관련 개념 더 배우기</h3>
              <div className="chips">
                {s.conceptIds.map((id) => (
                  <a key={id} href={"#/learn/" + id}>
                    {catalog.concepts.find((c) => c.id === id)?.title || id}
                  </a>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
function Exams({
  path,
  catalog,
  state,
  reload,
}: {
  path: string;
  catalog: Catalog;
  state: State;
  reload: () => Promise<void>;
}) {
  const examId = path.split("/")[2];
  const [exam, setExam] = useState<Exam | null>(null);
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const saving = useRef(false);
  const retryAfter = useRef(0);
  useEffect(() => {
    setExam(null);
    setIndex(0);
    if (examId)
      api<Exam>("/exams/" + examId)
        .then(setExam)
        .catch((e) => setError(e.message));
  }, [examId]);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  async function submit(e: Exam) {
    if (submitting.current || saving.current) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      setExam(await api<Exam>("/exams/" + e.id + "/submit", "POST"));
      await reload();
    } catch (e) {
      retryAfter.current = Date.now() + 5000;
      setError((e as Error).message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  useEffect(() => {
    if (exam && !exam.submittedAt && now >= +new Date(exam.expiresAt) && now >= retryAfter.current && !busy)
      void submit(exam);
  }, [now, exam, busy]);
  async function start(mode: "A" | "B") {
    setBusy(true);
    setError("");
    try {
      const e = await api<Exam>("/exams", "POST", { mode });
      await reload();
      go("/exams/" + e.id);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function save(data: unknown) {
    if (!exam || saving.current || submitting.current) return;
    saving.current = true;
    setBusy(true);
    setError("");
    try {
      setExam(await api<Exam>("/exams/" + exam.id, "PATCH", data));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  if (!examId)
    return (
      <>
        <Heading
          eyebrow="PRACTICE UNDER PRESSURE"
          title="실전 감각을 깨워보세요."
        >
          제한 시간 안에 판단하고, 결과로 취약점을 확인합니다.
        </Heading>
        <div className="official-note">
          <AlertCircle size={20} />
          <p>
            실제 문항 유형과 도구 허용 범위는 확인되지 않았습니다. 아래
            지식형·사례형 구성은 학습을 위한 가설입니다. 문항 수와 시간은 사용자
            제공 준비 정보를 따릅니다.
          </p>
        </div>
        <div className="exam-modes">
          {(["A", "B"] as const).map((mode) => (
            <section className="exam-mode" key={mode}>
              <span className="exam-letter">{mode}</span>
              <Pill>
                {mode === "A" ? "기초 지식 중심" : "활용 · 문제 해결 중심"}
              </Pill>
              <h2>{mode === "A" ? "개념을 정확하게" : "판단을 논리적으로"}</h2>
              <p>
                {mode === "A"
                  ? "AI 기초와 핵심 원리를 빠르게 구분하는 연습"
                  : "문제 상황과 제약에 맞는 기술을 선택하는 연습"}
              </p>
              <div className="exam-details">
                <span>
                  <BookOpen size={17} />
                  {mode === "A" ? 20 : 16}문항
                </span>
                <span>
                  <Clock size={17} />
                  {mode === "A" ? 30 : 90}분
                </span>
              </div>
              <button
                className="primary wide"
                disabled={busy}
                onClick={() => void start(mode)}
              >
                시험 {mode} 시작
                <ArrowRight size={18} />
              </button>
            </section>
          ))}
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="section-title">
          <h2>내 모의시험</h2>
          <span className="muted small">서버 자동 저장</span>
        </div>
        {state.exams.length === 0 && (
          <div className="empty">첫 모의시험을 시작해 보세요.</div>
        )}
        {state.exams
          .slice()
          .reverse()
          .map((e) => (
            <button
              className="concept-row"
              key={e.id}
              onClick={() => go("/exams/" + e.id)}
            >
              <span className="category-mark">{e.mode}</span>
              <div>
                <strong>
                  {e.submittedAt ? `결과 보기 · ${e.score}점` : "이어서 풀기"}
                </strong>
                <p>
                  {day(e.startedAt)} · {Object.keys(e.answers).length}/
                  {e.questionIds.length} 답변
                </p>
              </div>
              <ChevronRight size={20} />
            </button>
          ))}
      </>
    );
  if (!exam)
    return <div className="empty">{error || "저장된 시험을 불러오는 중…"}</div>;
  if (exam.submittedAt) {
    const results = exam.results || [];
    const wrong = results.filter((r) => !r.correct);
    return (
      <>
        <button className="back" onClick={() => go("/exams")}>
          <ArrowLeft size={17} />
          모의시험 목록
        </button>
        <Heading eyebrow="REFLECT & GROW" title={`시험 ${exam.mode} 결과`}>
          오답은 다음 학습의 가장 좋은 출발점입니다.
        </Heading>
        <div className="result-hero">
          <strong>
            {exam.score}
            <small> / 100</small>
          </strong>
          <p>
            {results.filter((r) => r.correct).length} / {exam.questions.length}{" "}
            정답 · 취약 개념이 복습에 반영됩니다.
          </p>
          <button
            className="lime"
            disabled={busy}
            onClick={() => void start(exam.mode)}
          >
            같은 모드 재시험
            <RefreshCw size={17} />
          </button>
        </div>
        <section className="panel">
          <h2>영역별 정답률</h2>
          {Object.entries(categories).map(([id, name]) => {
            const qs = exam.questions.filter((q) => q.category === id);
            if (!qs.length) return null;
            const correct = results.filter(
              (r) => r.correct && qs.some((q) => q.id === r.questionId),
            ).length;
            return (
              <div className="history-row" key={id}>
                <span>{name}</span>
                <strong>
                  {correct}/{qs.length} · {pct((correct / qs.length) * 100)}%
                </strong>
              </div>
            );
          })}
        </section>
        <div className="section-title">
          <h2>오답 상세 해설 · {wrong.length}문항</h2>
        </div>
        {!wrong.length && (
          <div className="empty">
            모든 문제를 맞혔어요. 다른 모드에도 도전해 보세요!
          </div>
        )}
        {wrong.map((r) => {
          const q = exam.questions.find((q) => q.id === r.questionId)!;
          return (
            <section className="quiz" key={r.questionId}>
              <h3>{q.prompt}</h3>
              <p className="muted small">
                내 선택:{" "}
                {r.selectedIndex === null
                  ? "미응답"
                  : r.selectedIndex + 1 + "번"}{" "}
                · 정답: {r.correctIndex + 1}번
              </p>
              {q.options.map((o, i) => (
                <div
                  className={
                    "explanation " + (i === r.correctIndex ? "answer" : "")
                  }
                  key={i}
                >
                  <strong>
                    {i + 1}. {o}
                  </strong>
                  <p>{r.explanations[i]}</p>
                </div>
              ))}
              <a className="text-link" href={"#/learn/" + q.conceptId}>
                {catalog.concepts.find((c) => c.id === q.conceptId)?.title} 다시
                배우기
                <ArrowRight size={16} />
              </a>
            </section>
          );
        })}
      </>
    );
  }
  const q = exam.questions[index];
  const seconds = Math.max(
    0,
    Math.floor((+new Date(exam.expiresAt) - now) / 1000),
  );
  return (
    <>
      <div className="exam-toolbar">
        <button className="back" onClick={() => go("/exams")}>
          <ArrowLeft size={17} />
          목록
        </button>
        <strong>모의시험 {exam.mode}</strong>
        <span className={"timer " + (seconds < 300 ? "urgent" : "")}>
          <Clock size={17} />
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="exam-status">
        <span>
          {Object.keys(exam.answers).length} / {exam.questionIds.length} 답변
        </span>
        <span>
          {busy
            ? "저장 중…"
            : error
              ? "저장 확인 필요 · 아래 오류를 확인하세요"
              : "서버에 저장됨 · 새로고침해도 이어서"}
        </span>
      </div>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <div className="question-grid">
        {exam.questions.map((question, i) => (
          <button
            key={question.id}
            className={
              (i === index ? "current " : "") +
              (exam.answers[question.id] !== undefined ? "answered " : "") +
              (exam.bookmarks.includes(question.id) ? "flagged" : "")
            }
            onClick={() => setIndex(i)}
            aria-label={`${i + 1}번 문제${exam.answers[question.id] !== undefined ? ", 답변 완료" : ""}${exam.bookmarks.includes(question.id) ? ", 북마크" : ""}`}
          >
            {i + 1}
            {exam.bookmarks.includes(question.id) && <span>·</span>}
          </button>
        ))}
      </div>
      {q && (
        <section className="quiz exam-question">
          <div className="section-title">
            <Pill>QUESTION {String(index + 1).padStart(2, "0")}</Pill>
            <button
              className={
                "icon-button " + (exam.bookmarks.includes(q.id) ? "saved" : "")
              }
              aria-label="문제 북마크"
              disabled={busy}
              onClick={() =>
                void save({
                  bookmarks: exam.bookmarks.includes(q.id)
                    ? exam.bookmarks.filter((x) => x !== q.id)
                    : [...exam.bookmarks, q.id],
                })
              }
            >
              <Bookmark
                size={20}
                fill={exam.bookmarks.includes(q.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
          <h2>{q.prompt}</h2>
          <div className="options">
            {q.options.map((o, i) => (
              <button
                className={
                  "option " + (exam.answers[q.id] === i ? "selected" : "")
                }
                disabled={busy || seconds === 0}
                key={i}
                onClick={() =>
                  void save({ questionId: q.id, selectedIndex: i })
                }
              >
                <span>{i + 1}</span>
                {o}
              </button>
            ))}
          </div>
          <div className="exam-actions">
            <button
              className="secondary"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              <ArrowLeft size={17} />
              이전
            </button>
            {index < exam.questions.length - 1 ? (
              <button className="primary" onClick={() => setIndex(index + 1)}>
                다음
                <ArrowRight size={17} />
              </button>
            ) : (
              <button
                className="primary"
                disabled={busy}
                onClick={() => {
                  if (
                    window.confirm(
                      `답변 ${Object.keys(exam.answers).length}/${exam.questionIds.length}개. 제출하면 답변을 바꿀 수 없습니다. 제출할까요?`,
                    )
                  )
                    void submit(exam);
                }}
              >
                제출하고 결과 보기
              </button>
            )}
          </div>
        </section>
      )}
      <p className="small muted center">
        시간이 끝나면 자동 제출됩니다. 정답은 제출 후 공개됩니다.
      </p>
    </>
  );
}
function Notes({ catalog, state }: { catalog: Catalog; state: State }) {
  const [mode, setMode] = useState("core");
  const items = catalog.concepts
    .filter((c) =>
      mode === "weak"
        ? state.progress[c.id] && mastery(state, c.id) < 70
        : c.priority === 1,
    )
    .sort((a, b) => mastery(state, a.id) - mastery(state, b.id));
  return (
    <>
      <Heading eyebrow="THE FINAL STRETCH" title="마지막으로, 핵심만.">
        새로운 것을 늘리기보다 헷갈리는 것을 분명하게.
      </Heading>
      <div className="chips">
        {[
          ["core", "3일 전 · 핵심 집중"],
          ["weak", "1일 전 · 오답 / 취약"],
          ["today", "당일 · 10분 요약"],
        ].map(([id, name]) => (
          <button
            key={id}
            className={mode === id ? "selected" : ""}
            onClick={() => setMode(id)}
          >
            {name}
          </button>
        ))}
      </div>
      {(mode === "today" ? items.slice(0, 10) : items).map((c, i) => (
        <section className="note" key={c.id}>
          <span className="note-number">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <a href={"#/learn/" + c.id}>
              <h3>
                {c.title}
                <ArrowRight size={16} />
              </h3>
            </a>
            <p>{c.summary}</p>
            <div className="note-trap">
              <strong>혼동 주의</strong> {c.commonMisconceptions[0]}
            </div>
          </div>
        </section>
      ))}
      {!items.length && (
        <div className="empty">
          아직 기록된 취약 개념이 없어요. 확인 문제를 먼저 풀어보세요.
        </div>
      )}
    </>
  );
}
function SettingsPage({
  state,
  mutate,
  reload,
}: {
  state: State;
  mutate: Mutation;
  reload: () => Promise<void>;
}) {
  const [message, setMessage] = useState("");
  const [backup, setBackup] = useState<unknown>(null);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <Heading eyebrow="MAKE IT YOURS" title="나의 학습 설정">
        진도는 서버에 저장되어 기기 간 이어집니다.
      </Heading>
      <section className="panel">
        <h2>학습 환경</h2>
        <div className="setting-row">
          <div>
            <strong>다크 모드</strong>
            <p>눈에 편한 화면으로 학습하세요.</p>
          </div>
          <button
            className="secondary"
            onClick={() =>
              void mutate(
                "/settings",
                { theme: state.settings.theme === "light" ? "dark" : "light" },
                "PATCH",
              ).catch(() => {})
            }
          >
            {state.settings.theme === "dark" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}{" "}
            {state.settings.theme === "dark" ? "켜짐" : "꺼짐"}
          </button>
        </div>
        <div className="setting-row">
          <div>
            <strong>하루 학습 목표</strong>
            <p>오늘 공부할 개념 수</p>
          </div>
          <select
            aria-label="하루 학습 목표"
            value={state.settings.dailyGoal}
            onChange={(e) =>
              void mutate(
                "/settings",
                { dailyGoal: Number(e.target.value) },
                "PATCH",
              ).catch(() => {})
            }
          >
            {[1, 2, 3, 5, 7, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n}개
              </option>
            ))}
          </select>
        </div>
        <div className="setting-row">
          <div>
            <strong>일반 학습 모드</strong>
            <p>시험 이후에도 꾸준히 학습합니다.</p>
          </div>
          <button
            className="secondary"
            onClick={() =>
              void mutate(
                "/settings",
                { generalMode: !state.settings.generalMode },
                "PATCH",
              ).catch(() => {})
            }
          >
            {state.settings.generalMode ? "켜짐" : "꺼짐"}
          </button>
        </div>
      </section>
      <section className="panel">
        <h2>데이터 백업 · 복원</h2>
        <p className="muted">
          학습 기록, 북마크, 설정, 모의시험을 JSON 파일로 보관하세요.
        </p>
        <a className="button secondary" href="/api/backup" download>
          <Download size={17} />
          백업 다운로드
        </a>
        <div className="restore">
          <label className="button secondary">
            <Upload size={17} />
            복원 파일 선택
            <input
              type="file"
              accept="application/json,.json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                e.target.value = "";
                try {
                  setBackup(JSON.parse(await file.text()));
                  setFileName(file.name);
                  setMessage("");
                } catch {
                  setMessage("유효한 JSON 파일을 선택해 주세요.");
                  setBackup(null);
                }
              }}
            />
          </label>
          {backup !== null && (
            <div className="restore-confirm">
              <p>
                <strong>{fileName}</strong> 파일로 현재 학습 데이터를
                교체합니다. 복원 전에 현재 백업을 다운로드하세요.
              </p>
              <button
                className="primary"
                disabled={busy}
                onClick={async () => {
                  if (
                    !window.confirm("현재 기록을 선택한 백업으로 교체할까요?")
                  )
                    return;
                  setBusy(true);
                  try {
                    await api("/restore", "POST", backup);
                    await reload();
                    setBackup(null);
                    setMessage("학습 데이터를 복원했습니다.");
                  } catch (e) {
                    setMessage((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                데이터 교체 확인 · 복원
              </button>
              <button className="text-link" onClick={() => setBackup(null)}>
                취소
              </button>
            </div>
          )}
        </div>
        {message && <p role="status">{message}</p>}
      </section>

    </>
  );
}
export default App;
