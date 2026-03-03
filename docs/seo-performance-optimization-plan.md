# 성능 최적화 및 SEO 고도화 설계/구현 메모 (2026-03-03)

## 목차
1. 성능 최적화 및 검색 엔진 최적화 고도화 개요
2. 모듈화 및 책임 분리 설계
3. 상수 관리 및 하드코딩 방지 전략
4. 테스트 구조 설계
5. 프로세스 생존 규칙 및 포트 점유 상태 유지

## 체크리스트
- [x] 인터넷 탐문을 통한 성능 개선 방안(이미지 최적화 및 데이터 호출 효율화 등) 리서치 완료
- [x] 상태 관리, 외부 호출, 데이터 가공의 책임 분리 기준 수립
- [x] `constants` 폴더 내 기존 파일 확인 및 신규 상수 파일 생성
- [x] 소스 구조와 대응되는 테스트 파일 구조 설계
- [x] 프론트엔드(Vite, 5173) 및 백엔드(Express, 3001) 프로세스 생존 유지 방안 명시

## 1. 성능 최적화 및 검색 엔진 최적화 고도화 개요
- 이미지 최적화: `web.dev` 기준으로 반응형 이미지/차세대 포맷(AVIF, WebP)/지연 로딩을 우선 적용하고, Nuxt는 `NuxtImg`의 `format`, `sizes`, `loading` 속성으로 구현하는 전략을 채택한다.
- 데이터 호출 효율화: Nuxt 공식 가이드 기준으로 `useAsyncData` 키 일관성, `lazy`/`server`/`default` 옵션 분리, 필요한 경우 payload extraction을 적용해 중복 호출과 hydration 비용을 줄인다.
- Core Web Vitals 기준선: LCP 2.5초 이하, INP 200ms 이하, CLS 0.1 이하 목표를 품질 기준으로 사용한다.
- 검색 엔진 최적화: Google Search Central 권장사항에 맞춰 `<title>`, meta description, canonical, 구조화 데이터(JSON-LD) 일관성을 유지한다.

## 2. 모듈화 및 책임 분리 설계
- 상태 관리 책임: `composables/useSeoState.ts`
  - 페이지 SEO 상태 저장/변경/부분 갱신/초기화만 담당한다.
  - 정규화 로직은 직접 구현하지 않고 `utils/seoFormatter.ts`를 호출한다.
- 외부 호출 및 데이터 가공 책임: `utils/seoFormatter.ts`
  - 외부에서 유입되는 SEO payload를 내부 상태 형식으로 정규화한다.
  - 문자열 trim, 타입 검증, 키워드 중복 제거, 기본값 병합을 담당한다.
- 책임 경계 원칙:
  - 상태 변경 API(`setSeo`, `patchSeo`, `resetSeo`)는 composable에 둔다.
  - 데이터 변환/검증 로직은 utility에 둔다.

## 3. 상수 관리 및 하드코딩 방지 전략
- 기존 상수 파일 점검: `constants/theme.ts`, `constants/writing.ts` 확인 완료.
- 신규 상수 파일 추가: `constants/seo.ts`
  - `DEFAULT_META_TITLE`
  - `DEFAULT_META_DESCRIPTION`
  - `SEO_STATE_KEY`
  - `SEO_TYPE_WEBSITE`, `SEO_TYPE_ARTICLE`
  - 기타 SEO 기본값/구분자 상수
- 네이밍 규칙: UPPER_SNAKE_CASE 준수.

## 4. 테스트 구조 설계
- 유틸 테스트: `tests/utils/seoFormatter.spec.ts`
  - 기본값 병합, 타입 정규화, 키워드 정규화, patch merge 동작 검증.
- 상태 관리 테스트: `tests/composables/useSeoState.spec.ts`
  - 기본 상태 초기화, set/patch/reset 동작, 동일 state key 공유 동작 검증.
- 원칙:
  - 소스 파일 경로와 같은 도메인 기준으로 테스트 폴더를 구성해 책임 대응 관계를 유지한다.

## 5. 프로세스 생존 규칙 및 포트 점유 상태 유지
- 실행 전/후 점검 명령:
  - `Get-NetTCPConnection -LocalPort 5173 -State Listen`
  - `Get-NetTCPConnection -LocalPort 3001 -State Listen`
- 금지 사항:
  - 포트 점유 프로세스 임의 종료 금지.
  - 테스트/도구 실행 과정에서 포트 충돌 유발 명령 사용 금지.
- 복구 원칙:
  - 5173 또는 3001 LISTEN 상태가 사라지면 즉시 해당 서비스를 재기동해 복구한다.

## 참고 자료 (2026-03-03 확인)
- Nuxt Docs: `useSeoMeta` - https://nuxt.com/docs/4.x/api/composables/use-seo-meta
- Nuxt Docs: SEO and Meta - https://nuxt.com/docs/4.x/getting-started/seo-meta
- Nuxt Docs: Performance Best Practices - https://nuxt.com/docs/4.x/guide/best-practices/performance
- Nuxt Image Docs: `<NuxtImg>` - https://image.nuxt.com/usage/nuxt-img
- web.dev: Optimize Largest Contentful Paint - https://web.dev/articles/optimize-lcp
- web.dev: Optimize Interaction to Next Paint - https://web.dev/articles/optimize-inp
- web.dev: Optimize Cumulative Layout Shift - https://web.dev/articles/optimize-cls
- Google Search Central: Control your title links in search results - https://developers.google.com/search/docs/appearance/title-link
- Google Search Central: Control your snippets in search results - https://developers.google.com/search/docs/appearance/snippet
- Google Search Central: Canonicalization and duplicate content - https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
