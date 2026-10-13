# AI Sprint 운영

## 접속

- Mac: http://127.0.0.1:8787
- 개인 tailnet HTTPS: https://macstudio.nutria-sole.ts.net:8788
- Galaxy와 다른 PC는 Tailscale을 연결한 상태에서 HTTPS 주소를 연다.
- 별도 접속 코드나 앱 로그인 없이 바로 이용한다. 접근 통제는 Tailscale tailnet 정책에 따른다. 데이터 디렉터리는 0700이다.
- 외부 LLM API 키나 비용이 필요하지 않다.

## 기존 환경과 분리

개발 전 Tailscale Running, MagicDNS 활성, 기존 Serve 443/3001/3002/5173/8443/8766 구성을 확인했다. 기존 웹/모니터링 서비스가 여러 포트를 점유하므로 AI Sprint는 8787(loopback)과 8788(tailnet HTTPS)을 사용한다. 기존 reverse proxy 설정이나 포트는 수정하지 않는다.

```sh
npm run build
node scripts/install-service.mjs
tailscale serve --bg --https=8788 http://127.0.0.1:8787
```

Serve는 tailnet 내부 공개이며 Funnel은 사용하지 않는다. HTTPS는 Tailscale이 종료한다. 앱과 API는 별도 로그인 없이 접근하며, 서버는 loopback에만 바인딩한다.

## 자동 실행과 재시작

설치 스크립트는 다음 사용자 LaunchAgent만 생성한다.

- `~/Library/LaunchAgents/com.geniuskey.ai-sprint.plist`
- `~/Library/LaunchAgents/com.geniuskey.ai-sprint.backup.plist`

현재 사용자 로그인 시 자동 실행한다. `KeepAlive=true`로 서버 종료 후 자동 재시작한다. 매일 03:15에 JSON 백업을 생성하고 최근 30개 정기 백업을 유지한다. 복원 전 자동 백업은 정기 정리에서 제외한다. 잠자기 중에는 서버 요청을 처리할 수 없고 예약 작업 실행은 macOS 상태에 따른다.

재부팅 후 **edwin 사용자 로그인**이 필요하다. FileVault 해제·로그인 전 실행하는 시스템 LaunchDaemon은 설치하지 않았다. 실제 재부팅은 다른 실행 서비스에 영향을 주므로 검증을 위해 수행하지 않는다. 백그라운드 항목을 macOS 설정에서 허용해야 한다.

서비스 변경 후 재시작:

```sh
npm run check
node scripts/install-service.mjs
```

이 스크립트는 AI Sprint 레이블만 재등록한다. Node 버전/설치 경로가 바뀌면 다시 실행해 plist의 실행 파일 경로를 갱신한다.

## 상태와 로그

```sh
curl --fail http://127.0.0.1:8787/api/health
curl --fail https://macstudio.nutria-sole.ts.net:8788/api/health
launchctl print gui/$(id -u)/com.geniuskey.ai-sprint
tailscale serve status
```

로그는 `data/logs/com.geniuskey.ai-sprint.log` 및 `.error.log`에 기록한다. 백업 작업 로그는 같은 디렉터리의 `com.geniuskey.ai-sprint.backup.*.log`다. 평상시에는 답변 본문을 로그로 남기지 않는다.

## 백업과 복구

설정 → 데이터 백업에서 JSON 파일을 다운로드한다. 설정 → 백업 복원에서 파일을 선택하면 현재 기록 교체 확인을 요청한다. 복원 전에 `data/backups/before-restore-*.json`으로 현재 상태를 자동 보관한다. 백업 파일은 개인 기록이므로 신뢰하는 기기에만 보관한다.

수동 서버 백업:

```sh
node scripts/backup.mjs
```

백업에는 진도, 응답 이력, 시험 문항 스냅샷·결과, 북마크, 설정, 중복 방지 이벤트가 포함된다. DB 파일을 운영 중 단독 복사하면 WAL 변경이 누락될 수 있으므로 JSON 백업을 이용한다.

새 서버로 옮길 때 소스와 의존성을 준비해 실행한 뒤 설정 화면에서 JSON을 복원한다. 기존 콘텐츠 ID를 유지한다. 예전 백업에 현재 없어진 콘텐츠 ID가 있어도 학습 이력은 보존되며 목록에는 현재 콘텐츠만 표시된다.

앱 로그인은 제거되었다. 기존 설치의 접속 코드 파일과 사용하지 않는 인증 세션 테이블은 다음 서버 시작 시 정리된다. 학습 기록은 유지된다.

## 중지와 제거

아래 명령은 AI Sprint의 서비스·Serve 포트만 해제한다. 다른 서비스가 사용하는 `tailscale serve reset`은 실행하지 않는다.

```sh
launchctl bootout gui/$(id -u)/com.geniuskey.ai-sprint
launchctl bootout gui/$(id -u)/com.geniuskey.ai-sprint.backup
tailscale serve --https=8788 off
```

다음 로그인 때도 중지하려면 위 두 AI Sprint plist를 별도로 보관하거나 삭제한다. `data/`는 백업을 확인하기 전 삭제하지 않는다.

## 기기 검증

자동화 브라우저 검사는 Galaxy 크기(412×915), 작은 모바일 및 데스크톱 레이아웃과 학습/복습/시험 흐름을 확인한다. 이는 Galaxy 실기기에서의 직접 접속 확인과 구분한다. 실제 Galaxy에서는 Tailscale 연결 → HTTPS 주소 → 문제 하나 풀이 → PC에서 진도 확인 순서로 점검한다.
