# 코드 품질 개선 단계별 보고서

날짜: 2026-03-06

---

## Stage 0: 실행 가드레일과 진단 기록 체계

**문제 정의**: 포트(5173/3001) 생존 규칙 및 단계별 기준 없이 변경하면 우선순위가 흔들린다.

**해결 접근**: 포트 점유 상태 확인 + 각 단계별 템플릿(문제/접근/변경이유/검증/잔여리스크)으로 문서화.

**변경 이유**: 순차 우선순위 + 단계별 근거가 요청의 핵심이라 실행 프로세스 표준화 선행.

**검증 결과**: 이 문서 자체가 Stage 0 산출물. 포트 확인은 정책 제한으로 자동화 불가, 정적 코드 진단 중심 진행.

**잔여 리스크**: 로컬 정책 제한으로 포트 상태 자동 검증과 pnpm 빌드 검증 자동화는 실제 구현 단계에서 재수행 필요.

---

## Stage 1: 코드 품질 분석 (우선순위 산정)

**문제 정의**: 하드코딩/중복/책임 혼합 구간이 남아 있고, 테스트는 구현 문자열 결합 편중.

**해결 접근**: 책임 분류 (composables: 상태관리 / server/api+scripts: 외부호출 / utils: 데이터가공), P0/P1/P2 백로그 확정.

**백로그 결과**:
- P0: `nuxt.config.ts` writingRoutes가 flat 파일만 수집 (sitemap/feed와 불일치)
- P0: `deploy.yml` Notion sync `continue-on-error: true` 가 실패를 완전히 은닉
- P0(이미 완료): feed/sitemap 날짜 파싱 안전 처리 - `parseDateToIso`, `parseDateToUtc`, `toDateTimestamp` 모두 NaN 방어 있음
- P1: `QuickNav.vue` 하드코딩 라우트+텍스트
- P1: `TheFooter.vue` 하드코딩 GitHub URL + 저작권명, feed/sitemap 링크 부재

**잔여 리스크**: 실제 실행 시나리오(빌드/SSR/프리렌더)에서만 드러나는 문제는 Stage 5 smoke test에서 보완 필요.

---

## Stage 2: 버그 수정 (P0)

### 2-1: nuxt.config.ts 재귀 라우트 수집

**문제 정의**: `readdirSync`로 flat 파일만 수집 → 중첩 경로 writing 글이 sitemap/feed에는 노출되지만 prerender 안됨.

**해결 접근**: `collectWritingRoutes(dir, root)` 재귀 함수로 교체. `toWritingRoute` 로직과 동일하게 숫자 접두사 제거, `_` prefix 필터링, index 슬러그 정규화 적용.

**변경 이유**: sitemap/feed와 prerender 라우트 일치 보장 → "노출된 URL은 반드시 렌더 가능" 상태.

**변경 파일**: `nuxt.config.ts`

**검증 결과**: 기존 flat 파일 라우트 수집도 동일하게 작동. `tests/server/routes/sitemap.xml.spec.ts`의 중첩 경로 케이스와 일치.

**잔여 리스크**: 현재 content/writing은 flat 구조라 즉각 차이 없음. 중첩 구조 추가 시 자동 적용됨.

### 2-2: deploy.yml Notion sync 실패 가시성

**문제 정의**: `continue-on-error: true`만 있으면 Notion sync 실패가 CI 로그에서 묻혀 원인 추적 불가.

**해결 접근**: step에 `id: notion-sync` 추가 후 `if: steps.notion-sync.outcome == 'failure'` 조건으로 `::warning::` 애노테이션 출력 step 추가. 빌드는 계속되되 실패 사실이 GitHub Actions summary에 노출됨.

**변경 이유**: Notion API 장애/토큰 만료 시 캐시 콘텐츠로 빌드되는 사실을 운영자가 인지해야 함.

**변경 파일**: `.github/workflows/deploy.yml`

**검증 결과**: 구문 정확성은 정적 확인. 실제 CI 실행에서 NOTION_TOKEN 없을 때 warning 노출 예상.

**잔여 리스크**: Notion API 자체 장애는 코드로 해결 불가. 재시도 정책은 별도 운영 레이어에서 관리.

### 2-3: feed/sitemap 날짜 파싱 (이미 완료 상태)

**문제 정의**: 잘못된 날짜 문자열이 feed/sitemap을 깨뜨릴 수 있음.

**검증 결과**: `parseDateToIso`, `parseDateToUtc`, `toDateTimestamp` 모두 `Number.isNaN` 방어 있음. 추가 수정 불필요.

---

## Stage 3: 구조 개선 (P1)

### 3-1: 상수 추가

**변경 파일**: `constants/seo.ts`, `constants/navigation.ts`, `constants/home.ts`

- `constants/seo.ts`: `SITE_GITHUB_URL` 추가
- `constants/navigation.ts`: `FOOTER_GITHUB_URL`, `FOOTER_GITHUB_ARIA_LABEL`, `FOOTER_FEED_TO`, `FOOTER_FEED_LABEL`, `FOOTER_SITEMAP_TO`, `FOOTER_SITEMAP_LABEL`, `FOOTER_COPYRIGHT_NAME` 추가
- `constants/home.ts`: `QUICK_NAV_ABOUT_*`, `QUICK_NAV_PROJECTS_*`, `QUICK_NAV_WRITING_*`, `QUICK_NAV_WSM_*`, `QUICK_NAV_ITEMS` 추가

### 3-2: QuickNav.vue 리팩터

**변경**: 하드코딩 `navItems` 배열 제거 → `QUICK_NAV_ITEMS` 상수 참조. 그리드 레이아웃 4열로 조정 (WSM 항목 추가에 맞춰).

**변경 파일**: `components/home/QuickNav.vue`

### 3-3: TheFooter.vue 리팩터

**변경**: 하드코딩 GitHub URL/저작권명 → 상수 참조. feed/sitemap NuxtLink 추가.

**변경 파일**: `components/layout/TheFooter.vue`

---

## Stage 4: 기능 추가/개선 (P2)

### 4-1: QuickNav에 work-schedule-manager 노출

**변경**: `QUICK_NAV_ITEMS`에 WSM 항목(`/work-schedule-manager`, `heroicons:calendar-days`) 포함.

**검증**: `QUICK_NAV_ITEMS` 상수에 `/work-schedule-manager` 경로 포함 확인.

### 4-2: TheFooter에 feed/sitemap 접근 링크

**변경**: `FOOTER_FEED_TO`, `FOOTER_SITEMAP_TO` NuxtLink로 footer에 추가.

### 4-3: robots.txt 정책

**검증**: 현재 `Allow: /` (전체 허용) + sitemap 명시. 변경 불필요.

---

## Stage 5: 최종 검증

**테스트 결과**: `pnpm test:unit` → 23 파일, **75 tests 전부 통과**.

**신규 테스트**:
- `components/home/QuickNav.spec.ts` (3 tests): QUICK_NAV_ITEMS 상수 사용, 하드코딩 제거, 필수 필드 검증
- `components/layout/TheFooter.spec.ts` (3 tests): navigation 상수 사용, feed/sitemap 링크 존재, 상수값 검증

**완료 기준 체크**:
- [x] P0 결함 수정 (nuxt.config.ts 재귀 수집, deploy.yml 경고 가시성)
- [x] P0 날짜 파싱 이미 안전 (추가 수정 불필요 확인)
- [x] P1 구조 개선 (하드코딩 → 상수 참조)
- [x] P2 기능 (WSM QuickNav 노출, footer feed/sitemap 링크)
- [x] 회귀 테스트 전부 통과 (75/75)

**잔여 리스크**:
- prerender smoke test (`pnpm generate`)는 환경 제한으로 이번 턴에 실행 불가. 실제 CI 푸시 또는 로컬 `pnpm generate`로 재검증 필요.
- Notion sync 경고 노출은 실제 CI 실행에서만 확인 가능.
