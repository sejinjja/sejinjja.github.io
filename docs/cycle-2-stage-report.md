# Cycle 2 Stage Report

## Stage 0: 실행 가드레일/기록 체계 선적용

### 문제 정의
개선 사이클 중 5173(Vite), 3001(Express) 포트가 중단되거나 충돌하면 품질 작업 결과가 무효화될 수 있다.

### 해결 접근
1. 모든 Stage 시작/종료 시 포트 점유 상태를 동일 명령으로 확인하고 본 문서에 누적 기록한다.
2. Stage 결과 기록 템플릿을 `문제 정의 / 해결 접근 / 변경 이유 / 검증 결과 / 잔여 리스크` 5요소로 고정한다.
3. 기존 동작 유지 기준선을 아래 항목으로 고정한다.

### 변경 이유
이번 사이클은 신규 기능 확장보다 기존 동작 보존형 개선이 목적이므로, 서비스 생존과 회귀 추적 가시성을 먼저 확보해야 한다.

### 검증 결과
`포트 점검 공통 명령`
```powershell
$ports = 5173,3001
Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $ports -contains $_.LocalPort } |
  Select-Object LocalPort, OwningProcess, LocalAddress, State |
  Sort-Object LocalPort
```

`기존 동작 유지 기준선`
1. 핵심 라우트: `/`, `/about`, `/projects`, `/writing`, `/feed.xml`, `/sitemap.xml`
2. 홈 QuickNav 노출 유지
3. Footer RSS/Sitemap 링크 노출 유지
4. writing 라우팅 규칙(중첩 경로/숫자 prefix 제거/_ 제외/index 정규화) 유지

`포트 로그`
- Stage 0 시작 (2026-03-07 00:04:20 +09:00)
  - 3001 LISTEN (PID 55568)
  - 5173 LISTEN (PID 46844, 14372)
- Stage 0 종료 (2026-03-07 00:05:45 +09:00)
  - 3001 LISTEN (PID 55568)
  - 5173 LISTEN (PID 46844, 14372)

### 잔여 리스크
일부 환경에서 `Get-NetTCPConnection` 권한 제한이 발생할 수 있으며, 이 경우 `netstat -ano | findstr ":5173"`, `netstat -ano | findstr ":3001"`로 수동 점검해야 한다.

---

## Stage 1: 코드 품질 분석 우선 (백로그 재정렬)

### 문제 정의
Cycle 1 핵심 구현 이후에도 경로 정규화 중복, UI 하드코딩, RSS 자동 발견성 미흡이 남아 있어 우선순위 재정렬이 필요했다.

### 해결 접근
분석 대상을 다음으로 고정했다.
1. `nuxt.config.ts`
2. `server/utils/writingContent.ts`
3. `components/home/*`
4. `components/about/*`
5. `tests/server/routes/*.spec.ts` 및 관련 컴포넌트 테스트

책임 분리 기준을 명시했다.
1. 상태/파생값: `composables/*`
2. 외부 호출/입출력: `server/routes/*`, `server/api/*`
3. 데이터 가공/정규화: `utils/*`, `server/utils/*`
4. 상수 정책: `constants/*` 기존 파일 우선 확인, 없을 때만 확장, UPPER_SNAKE_CASE 준수, 하드코딩 금지

### 변경 이유
과도한 리팩터링을 피하고 사용자 가치와 직접 연결되는 항목만 이번 사이클 범위에 포함하기 위함이다.

### 검증 결과
`확정 백로그`
- P0(버그): `nuxt.config.ts`와 `server/utils/writingContent.ts`에 writing route 정규화 로직 중복. slug 충돌 시 feed/sitemap/prerender 중복 URL 위험.
- P1(구조): `HeroSection.vue`, `KeywordsSection.vue`, `ProfileCard.vue`, `WorkApproach.vue`, `TechPreferences.vue`, `CollaborationGuide.vue`에 copy/route/icon 하드코딩.
- P2(필수 기능 보강): 전역 `app.head`에 RSS autodiscovery(`rel=\"alternate\"`) 링크 부재.

`포트 로그`
- Stage 1 시작 (2026-03-07 00:06:01 +09:00)
  - 3001 LISTEN (PID 55568)
  - 5173 LISTEN (PID 46844, 14372)
- Stage 1 종료 (2026-03-07 00:06:22 +09:00)
  - 3001 LISTEN (PID 55568)
  - 5173 LISTEN (PID 46844, 14372)

### 잔여 리스크
정적 분석만으로 런타임 엣지 케이스를 100% 포착할 수 없으므로 Stage 2~5에서 테스트/통합 검증으로 보완이 필요하다.

---

## Stage 2: 버그 수정 (P0) - Writing 경로 정규화 단일화 + 충돌 방어

### 문제 정의
writing route 생성 규칙이 `nuxt.config.ts`와 `server/utils/writingContent.ts`에 중복되어 있었고, slug 충돌 시 feed/sitemap/prerender에 중복 URL이 생성될 수 있었다.

### 해결 접근
1. 순수 함수 기반 공용 유틸 `utils/writingRoute.ts`를 도입했다.
2. `nuxt.config.ts`는 markdown 후보를 수집한 뒤 공용 유틸로 라우트를 계산하도록 변경했다.
3. `server/utils/writingContent.ts`도 동일 유틸을 사용하도록 정렬했다.
4. 충돌 발생 시 빌드 실패 대신 `console.warn`으로 경고하고, 결정적 결과(정렬 후 첫 후보 우선)를 유지했다.
5. 테스트를 1:1로 확장했다.
6. `tests/utils/writingRoute.spec.ts` 신규 추가
7. `tests/server/routes/feed.xml.spec.ts`, `tests/server/routes/sitemap.xml.spec.ts` 충돌/정규화 케이스 확장

### 변경 이유
feed/sitemap/writing 접근성 신뢰성과 prerender 정합성은 사용자에게 직접 노출되는 품질 요소이므로 P0로 우선 처리했다.

### 검증 결과
`정규화 규칙 검증`
1. 중첩 경로 처리
2. 숫자 prefix 제거
3. `_` 파일/디렉토리 제외
4. `/index` 정규화
5. 빈 slug 제외
6. 중복 slug 충돌 시 첫 후보 고정(결정적)

`실행 테스트`
- `pnpm vitest run tests/utils/writingRoute.spec.ts tests/server/routes/feed.xml.spec.ts tests/server/routes/sitemap.xml.spec.ts`
  - 3 files, 8 tests 모두 통과

`포트 로그`
- Stage 2 시작 (2026-03-07 00:06:34 +09:00)
  - 3001 LISTEN (PID 55568)
  - 5173 LISTEN (PID 46844, 14372)
- Stage 2 종료 (2026-03-07 00:10:10 +09:00)
  - 3001 LISTEN (PID 55568)
  - 5173 LISTEN (PID 46844, 14372)

### 잔여 리스크
충돌 시 우선 채택 규칙(정렬 후 첫 파일)이 운영자가 기대하는 우선순위와 다를 수 있어, 필요 시 향후 명시적 우선순위 정책이 필요하다.

---

## Stage 3: 구조 개선 (P1) - Home/About 하드코딩 제거 및 책임 정리

### 문제 정의
Home/About 일부 컴포넌트에 copy/route/icon 데이터가 직접 하드코딩되어 수정 누락 및 상수 불일치 위험이 남아 있었다.

### 해결 접근
1. 신규 상수 추가 전 `constants/home.ts`, `constants/about.ts`, `constants/routes.ts`, `constants/navigation.ts`를 우선 확인했다.
2. `constants/home.ts` 확장
3. Hero copy/CTA/route 상수
4. Keywords 섹션 타이틀/서브타이틀/아이템 상수
5. `constants/about.ts` 확장
6. Profile name/role/icon/info 상수
7. WorkApproach/TechPreferences/CollaborationGuide 데이터 상수
8. 대상 컴포넌트는 렌더링 책임만 남기고 상수 import 구조로 전환했다.
9. 컴포넌트별 1:1 동작 기반 테스트를 추가/보강했다.

### 변경 이유
상수 계층으로 정보 구조를 일원화하면 재사용성과 정합성이 높아지고, 회귀 테스트가 단순해진다.

### 검증 결과
`상수화 대상 반영`
1. `components/home/HeroSection.vue`
2. `components/home/KeywordsSection.vue`
3. `components/about/ProfileCard.vue`
4. `components/about/WorkApproach.vue`
5. `components/about/TechPreferences.vue`
6. `components/about/CollaborationGuide.vue`

`테스트 추가/보강`
1. `components/home/HeroSection.spec.ts` 신규
2. `components/home/KeywordsSection.spec.ts` 신규
3. `components/about/ProfileCard.spec.ts` 신규
4. `components/about/WorkApproach.spec.ts` 신규
5. `components/about/CollaborationGuide.spec.ts` 신규
6. `components/about/TechPreferences.spec.ts` 보강

`실행 테스트`
- `pnpm vitest run components/home/HeroSection.spec.ts components/home/KeywordsSection.spec.ts components/about/ProfileCard.spec.ts components/about/WorkApproach.spec.ts components/about/TechPreferences.spec.ts components/about/CollaborationGuide.spec.ts`
  - 6 files, 7 tests 모두 통과

`포트 로그`
- Stage 3 시작 (2026-03-07 00:10:34 +09:00)
  - 3001 LISTEN (PID 55568)
  - 5173 LISTEN (PID 46844, 14372)
- Stage 3 종료 (2026-03-07 00:15:30 +09:00)
  - 3001 LISTEN (PID 55568)
  - 5173 LISTEN (PID 46844, 14372)

### 잔여 리스크
텍스트 이전 과정에서 미세한 문구 오탈자가 발생할 수 있어, 이후 전체 단위 테스트와 스냅샷/시각 확인으로 추가 검증이 필요하다.

---

## Stage 4: 필수 기능 보강 (P2) - RSS 자동 발견성 강화(비파괴)

### 문제 정의
feed 경로는 존재하지만 전역 `head`의 RSS autodiscovery 링크가 없어 일부 리더/브라우저에서 자동 탐지가 약할 수 있다.

### 해결 접근
1. 기존 상수 재사용 우선 점검 후 `constants/writing.ts`를 확장했다.
2. `WRITING_FEED_AUTO_DISCOVERY_TYPE`, `WRITING_FEED_AUTO_DISCOVERY_TITLE` 상수를 추가했다.
3. `nuxt.config.ts`의 `app.head.link`에 `rel: 'alternate'` RSS 링크를 상수 기반으로 추가했다.
4. `tests/nuxt-head-rss-link.spec.ts`를 신규 추가해 source 상수 참조와 실제 head link 값을 분리 검증했다.

### 변경 이유
기존 UI/라우팅 동작을 깨지 않으면서 RSS 구독 발견성을 직접 개선할 수 있는 비파괴 개선이다.

### 검증 결과
`실행 테스트`
- `pnpm vitest run tests/nuxt-head-rss-link.spec.ts`
  - 1 file, 2 tests 통과

`검증 항목`
1. `nuxt.config.ts`에 `rel='alternate'` 링크 존재
2. `href`가 `FEED_ROUTE_PATH` 상수 참조
3. `type`이 `WRITING_FEED_AUTO_DISCOVERY_TYPE` 상수 참조
4. `title`이 `WRITING_FEED_AUTO_DISCOVERY_TITLE` 상수 참조

`포트 로그`
- Stage 4 시작 (2026-03-07 00:16:12 +09:00)
  - 3001 LISTEN (PID 55568)
  - 5173 LISTEN (PID 46844, 14372)
- Stage 4 종료 (2026-03-07 00:17:35 +09:00)
  - 3001 LISTEN (PID 55568)
  - 5173 LISTEN (PID 46844, 14372)

### 잔여 리스크
페이지 단위 `useHead`가 동일 `rel='alternate'` 항목을 중복 선언할 경우 merge 순서 영향이 있을 수 있어, 추후 페이지별 head 정책 점검이 필요하다.

---

## Stage 5: 통합 검증 및 단계별 결과 문서화

### 문제 정의
개선 완료 후 기존 동작 보존과 품질 게이트 통과 여부를 한 번에 검증하고, 다음 사이클 인수 가능한 형태로 기록해야 했다.

### 해결 접근
1. Stage별 완료 직후 결과를 본 문서에 즉시 반영했다.
2. 통합 검증 명령을 순서대로 실행했다.
3. 기능 검증(QuickNav/Footer/feed/sitemap/writing 라우팅)은 관련 단위/스모크 테스트 통과로 확인했다.
4. 미해결 리스크는 다음 사이클 백로그로 이관했다.

### 변경 이유
이번 요청의 핵심 산출물이 단계별 문제/해결/근거/검증/리스크 문서이므로, 코드 변경과 동일한 비중으로 검증/기록 완결성이 필요했다.

### 검증 결과
`품질 검증`
1. `pnpm lint` 통과 (error 0, 기존 warning 3 유지)
2. `pnpm typecheck` 통과
3. `pnpm test:unit` 통과 (30 files, 89 tests)
4. `pnpm test:smoke` 통과 (prerender generate 1 test)

`기능 검증`
1. QuickNav 노출: `components/home/QuickNav.spec.ts` 통과
2. Footer RSS/Sitemap 노출: `components/layout/TheFooter.spec.ts` 통과
3. feed/sitemap 라우팅 및 writing 경로 정규화: `tests/server/routes/feed.xml.spec.ts`, `tests/server/routes/sitemap.xml.spec.ts`, `tests/utils/writingRoute.spec.ts` 통과
4. prerender 산출물(feed/sitemap/writing/work-schedule-manager): `tests/smoke/prerender-generate.spec.ts` 통과

`포트 로그`
- Stage 5 시작 (2026-03-07 00:18:06 +09:00)
  - 3001 LISTEN (PID 55568)
  - 5173 LISTEN (PID 46844, 14372)
- Stage 5 종료 (2026-03-07 00:19:50 +09:00)
  - 3001 LISTEN (PID 55568)
  - 5173 LISTEN (PID 46844, 14372)

### 잔여 리스크
`pnpm lint`의 기존 경고(`components/content/ProseImg.vue` 기본값 권고)는 이번 승인 범위 밖이라 유지되며, 후속 사이클에서 정책 결정 후 처리가 필요하다.

---

## 다음 사이클 이관 백로그 (P0/P1/P2)
- P1: slug 충돌 시 우선 선택 정책을 운영자 의도와 맞추는 명시적 우선순위 규칙(예: frontmatter weight) 검토
- P1: `ProseImg.vue` lint warning 3건(`vue/require-default-prop`) 처리 여부 결정 및 반영
- P2: 페이지 단위 `useHead`와 RSS autodiscovery 링크 중복 선언 방지 가이드 문서화
