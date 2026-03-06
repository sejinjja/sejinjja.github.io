# Approved Plan Stage Report

## Stage 0
- 문제 정의: 작업 중 포트(5173/3001) 점유 프로세스가 중단될 수 있으나, 절차상 보호 루틴이 없었습니다.
- 해결 접근: 각 단계 시작/종료, 주요 도구 실행 전/후에 `Get-NetTCPConnection -LocalPort 5173,3001 -State Listen`으로 LISTEN/PID를 기록했습니다.
- 변경 이유: 진단/수정/빌드 과정에서 프런트엔드(Vite)/백엔드(Express) 프로세스 중단을 방지하기 위해서입니다.
- 검증 결과: 모든 단계와 `lint/typecheck/test:unit/generate/test:smoke` 실행 전후에 5173/3001 LISTEN 상태가 유지되었습니다.
- 잔여 리스크: 환경 정책으로 일부 네트워크 진단 명령이 제한될 경우 동일 루틴을 수동 체크리스트로 강제해야 합니다.

## Stage 1
- 문제 정의: 사용자 가치에 직접 영향을 주는 결함(P0)과 구조 부채(P1/P2)가 혼재되어 우선순위 기준선이 필요했습니다.
- 해결 접근: 심각도(P0/P1/P2), 사용자 영향, 수정 범위를 기준으로 승인된 백로그를 유지하고 해당 항목만 구현 대상으로 고정했습니다.
- 변경 이유: 포트폴리오/글 배포/SEO/유지보수성 목표와 직접 연결된 변경만 반영하기 위해서입니다.
- 검증 결과: 기준선 항목(P0 feed item 0개, P0 work-schedule-manager prerender/sitemap 누락, P1 하드코딩, P1 feed/sitemap 중복, P2 unit 테스트 내 generate 실행)을 후속 단계에서 모두 추적 가능한 형태로 연결했습니다.
- 잔여 리스크: 콘솔 인코딩 환경에 따라 일부 한글 출력 가독성이 달라질 수 있습니다.

## Stage 2
- 문제 정의: RSS 무효(item 누락)와 `/work-schedule-manager` 비프리렌더/사이트맵 누락이 발견성에 직접 타격을 주고 있었습니다.
- 해결 접근:
  - `server/utils/writingContent.ts`를 도입해 CRLF/LF 독립 frontmatter 파싱 및 콘텐츠 수집 로직을 공통화했습니다.
  - `server/routes/feed.xml.ts`를 공통 유틸 기반으로 재작성해 item 생성을 보장했습니다.
  - `constants/routes.ts`의 정적 라우트를 `nuxt.config.ts` prerender와 `server/routes/sitemap.xml.ts`에 공통 적용했습니다.
  - feed 채널 title/description을 `constants/writing.ts` 상수로 전환했습니다.
- 변경 이유: 검색/구독 채널 정상화가 사용자 가치가 가장 큰 P0 문제였기 때문입니다.
- 검증 결과:
  - `pnpm generate` 성공.
  - `.output/public/feed.xml`의 `<item>` 개수 64개 확인.
  - `.output/public/sitemap.xml`에 `/work-schedule-manager` 포함 확인.
  - `.output/public/work-schedule-manager/index.html` 생성 확인.
- 잔여 리스크: frontmatter 날짜 형식이 비정상인 문서는 정렬/lastmod에서 보수적으로 처리됩니다.

## Stage 3
- 문제 정의: feed/sitemap 간 파일 수집/메타 파싱 로직이 중복되어 회귀 위험이 있었습니다.
- 해결 접근:
  - `server/utils/writingContent.ts`로 공통 로직(경로 정규화, XML escape, markdown 수집, frontmatter 파싱, route 변환)을 분리했습니다.
  - `constants/workScheduleManager.ts`, `constants/navigation.ts`, `constants/routes.ts`로 상수 책임을 분리했습니다.
  - 하드코딩 대상 파일(`pages/work-schedule-manager.vue`, `components/layout/TheHeader.vue`, `server/routes/feed.xml.ts`)을 상수 참조로 전환했습니다.
- 변경 이유: 책임 경계를 명확히 해 변경 영향도를 예측 가능하게 유지하기 위해서입니다.
- 검증 결과: feed/sitemap는 공통 유틸 경유로 동작하며, 하드코딩 문자열이 상수 참조로 대체되었습니다.
- 잔여 리스크: 공통 유틸 범위를 넓히면 가독성이 떨어질 수 있어 현재는 파일 수집/메타 파싱 수준으로 제한했습니다.

## Stage 4
- 문제 정의: 핵심 도구 페이지(work-schedule-manager) 발견성과 RSS 구독 식별성이 부족했습니다.
- 해결 접근:
  - Header 네비게이션(`HEADER_NAV_ITEMS`)에 `WORK_SCHEDULE_MANAGER_ROUTE_PATH`를 추가했습니다.
  - RSS item에 frontmatter `tags` 기반 `<category>`를 추가했습니다.
  - work-schedule-manager route/SEO 문구를 `constants/workScheduleManager.ts`로 상수화했습니다.
- 변경 이유: 신규 기능 추가보다 기존 핵심 기능의 접근성과 재사용성을 우선 강화하기 위해서입니다.
- 검증 결과:
  - `components/layout/TheHeader.spec.ts`에서 work-schedule-manager 링크 노출 검증 통과.
  - `tests/server/routes/feed.xml.spec.ts`에서 category 출력 검증 통과.
- 잔여 리스크: 헤더 항목 증가로 모바일 메뉴 밀도가 높아질 수 있어 정보구조 점검이 필요합니다.

## Stage 5
- 문제 정의: 소스-테스트 대응과 스모크/유닛 테스트 경계가 불명확했습니다.
- 해결 접근:
  - 테스트 매핑 정렬:
    - `server/routes/feed.xml.ts` ↔ `tests/server/routes/feed.xml.spec.ts`
    - `server/routes/sitemap.xml.ts` ↔ `tests/server/routes/sitemap.xml.spec.ts`
    - `pages/work-schedule-manager.vue`/신규 상수 ↔ `tests/page-content-constants.spec.ts` 확장
    - `components/layout/TheHeader.vue` ↔ `components/layout/TheHeader.spec.ts` 확장
  - `server/api/writing/list.get.spec.ts`에서 `pnpm generate` 스모크를 제거하고 `tests/smoke/prerender-generate.spec.ts`로 분리했습니다.
  - `package.json`에 `test:smoke` 스크립트를 추가하고 `test:unit`에서 `tests/smoke/**`를 제외했습니다.
- 변경 이유: 유지보수성과 회귀 방지를 위해 소스-테스트 1:1 대응과 테스트 경계 분리가 필요했기 때문입니다.
- 검증 결과:
  - `pnpm lint` 통과(경고 3건, 에러 0건).
  - `pnpm typecheck` 통과.
  - `pnpm test:unit` 통과(21 files, 69 tests).
  - `pnpm generate` 통과.
  - `pnpm test:smoke` 통과(1 file, 1 test).
- 잔여 리스크: 스모크 테스트는 `pnpm generate`를 포함하므로 실행 시간이 길어질 수 있습니다.
