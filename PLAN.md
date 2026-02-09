# sejinjja.github.io 전면 재개편 계획

## Context

sejinjja.github.io는 현재 여러 미니 웹앱(근무 스케줄 매니저, Timer, Todo List 등)을 모아놓은 GitHub Pages 사이트입니다. 이를 **me.md 기반의 매력적인 개인 사이트**로 전면 재구축합니다. 기존 앱은 모두 제거하고, Nuxt 3 SSG로 깨끗하게 새로 시작합니다.

---

## 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | **Nuxt 3** (SSG, `nuxt generate`) | Vue/Composition API 선호, GitHub Pages 정적 호스팅 |
| CSS | **Tailwind CSS v3** (`@nuxtjs/tailwindcss`) | 기존 사용 경험, 유틸리티 기반 |
| 콘텐츠 | **@nuxt/content** v2 | 마크다운 기반 글 작성 섹션 |
| 아이콘 | **@nuxt/icon** | Iconify 아이콘셋 지원 |
| 폰트 | **Pretendard** (CDN) | 한국어 웹 표준 폰트 |
| 패키지 매니저 | **pnpm** | 빠르고 디스크 효율적 |
| 배포 | **GitHub Actions → GitHub Pages** | master push 시 자동 배포 |
| Nitro 프리셋 | `github-pages` | GitHub Pages 최적화 (404 처리, base URL) |

---

## 사이트 구성

### 1. 홈 (`/`)
- **히어로 섹션**: 이름(조세진), 역할(프런트엔드/웹 개발자), 한 줄 소개 태그라인
- **핵심 키워드 섹션**: 정확성/일관성, 구조화/재사용, 실전 지향, 학습의 목적성 (4개 카드)
- **퀵 네비게이션**: 다른 페이지로의 안내 카드

### 2. 소개 (`/about`)
- **프로필 카드**: 기본 정보
- **일하는 방식**: 문제 접근 패턴, 품질 기준, 커뮤니케이션 스타일 (me.md 기반)
- **기술 성향**: Vue/Nuxt, Composition API, 설계 원칙
- **함께 일할 때 잘 맞는 방식**: 차별화된 섹션 (하이라이트 카드)
- **강점**: 정합성, 구조화, 도구화 능력, 검증 태도

### 3. 프로젝트 (`/projects`)
- **ls-diff**: Node.js CLI 디렉토리 비교 도구
- **너의 오늘에게**: 감정 기반 편지 생성 서비스
- 프로젝트 카드에 기술 스택 뱃지, 링크 포함

### 4. 글 (`/writing`)
- **@nuxt/content** 기반 마크다운 글 목록
- 개별 글 페이지 (`/writing/[slug]`)
- 제목 스타일: "필요한 만큼만 계산하라: ..." (메시지 선행 + 키워드 부제)
- 코드 하이라이팅 (github-dark 테마)

---

## 구현된 파일 구조

```
sejinjja.github.io/
├── .github/workflows/deploy.yml    # CI/CD 자동 배포
├── .gitignore
├── nuxt.config.ts                  # Nuxt 설정 (SSG, github-pages 프리셋)
├── tailwind.config.ts              # 블루 컬러 팔레트, Pretendard 폰트
├── package.json
├── tsconfig.json
├── pnpm-lock.yaml
├── app.vue                         # 루트 컴포넌트 (글로벌 SEO)
├── assets/css/main.css             # Tailwind 디렉티브, 폰트 임포트
├── components/
│   ├── layout/
│   │   ├── TheHeader.vue           # 스티키 헤더 + 반응형 모바일 메뉴
│   │   └── TheFooter.vue           # 푸터 (GitHub 링크)
│   ├── home/
│   │   ├── HeroSection.vue         # 히어로 (블루 배경 + 태그라인)
│   │   ├── KeywordsSection.vue     # 핵심 키워드 4개 카드
│   │   └── QuickNav.vue            # 페이지 안내 카드
│   ├── about/
│   │   ├── ProfileCard.vue         # 기본 프로필 정보
│   │   ├── WorkApproach.vue        # 일하는 방식 3섹션
│   │   ├── TechPreferences.vue     # 기술 성향
│   │   └── CollaborationGuide.vue  # 함께 일할 때 잘 맞는 방식
│   ├── projects/
│   │   └── ProjectCard.vue         # 프로젝트 카드
│   └── common/
│       ├── SectionTitle.vue        # 재사용 섹션 제목
│       └── BadgeTag.vue            # 재사용 뱃지/태그
├── composables/
│   └── useNavigation.ts            # 모바일 메뉴 상태 (동기, ref 반환)
├── content/
│   └── writing/
│       └── 1.hello-world.md        # 예시 글
├── layouts/
│   └── default.vue                 # 기본 레이아웃 (헤더+메인+푸터)
├── pages/
│   ├── index.vue                   # 홈
│   ├── about.vue                   # 소개
│   ├── projects.vue                # 프로젝트
│   └── writing/
│       ├── index.vue               # 글 목록
│       └── [...slug].vue           # 개별 글
└── public/
    └── robots.txt
```

---

## 컬러 팔레트 (블루 기반)

| 용도 | 색상 |
|------|------|
| 히어로 배경 | `primary-900` (#1e3a5f) + 흰 텍스트 |
| 본문 배경 | `white` / `gray-50` |
| 제목 | `gray-900` |
| 본문 텍스트 | `gray-600` |
| 액센트 (링크, 활성 네비, 버튼) | `primary-500` (#3b82f6) ~ `primary-600` |
| 카드 호버 보더 | `primary-200` |
| 뱃지/태그 | `primary-100` 배경 + `primary-700` 텍스트 |

블루와 그레이만 사용. 깔끔하고 구조적인 느낌.

---

## GitHub Actions 자동 배포

파일: `.github/workflows/deploy.yml`

- master push 시 자동 트리거
- pnpm + Node 20 + `nuxt generate` 로 정적 빌드
- `actions/deploy-pages@v4`로 GitHub Pages 배포

**필수 수동 설정**: GitHub 레포 Settings > Pages > Source를 **"GitHub Actions"**으로 변경

---

## 구현 완료 상태

| Phase | 내용 | 상태 |
|-------|------|------|
| 0 | 기존 파일 제거 & Nuxt 3 초기화 | ✅ 완료 |
| 1 | 기반 구축 (Tailwind, Content, Icon) | ✅ 완료 |
| 2 | 레이아웃 & 네비게이션 | ✅ 완료 |
| 3 | 홈 페이지 | ✅ 완료 |
| 4 | 소개 페이지 | ✅ 완료 |
| 5 | 프로젝트 페이지 | ✅ 완료 |
| 6 | 글 섹션 | ✅ 완료 |
| 7 | CI/CD & 배포 | ✅ 완료 |
| 8 | 마무리 (robots.txt, 빌드 확인) | ✅ 완료 |

- `pnpm nuxt generate` 빌드 성공 확인됨
- 15개 라우트 프리렌더링 완료

---

## 디자인 원칙

- **구조 > 장식**: 잘 정리된 문서 같은 느낌. 불필요한 애니메이션 없음
- **콘텐츠 퍼스트**: 히어로 이미지 대신 한 줄 소개 태그라인이 주인공
- **최소 라우팅**: 4개 페이지 (홈, 소개, 프로젝트, 글 + 글 상세)
- **모바일 퍼스트**: Tailwind 모바일 우선 브레이크포인트
- **클라이언트 상태 최소화**: SSG이므로 Pinia 불필요. Composable은 동기적, ref 반환

---

## 남은 작업

1. GitHub 레포 Settings > Pages > Source를 "GitHub Actions"으로 변경
2. 커밋 & master push → 자동 배포 확인
3. (선택) favicon 추가
4. (선택) 글 콘텐츠 추가 (`content/writing/` 에 마크다운 파일 추가)

---

## 검증 방법

1. `pnpm dev`로 로컬 개발 서버에서 모든 페이지 확인
2. `pnpm nuxt generate`로 정적 빌드 성공 확인
3. `.output/public/` 디렉토리에 HTML 파일들 생성 확인
4. master push 후 GitHub Actions 워크플로우 성공 확인
5. `https://sejinjja.github.io` 접속하여 모든 페이지 동작 확인
6. 모바일 기기에서 반응형 레이아웃 확인

---

## 운영 절차 (2026-02 업데이트)

### 배포 파이프라인

- 브랜치: `master`
- 배포 소스: GitHub Pages `GitHub Actions`
- CI 순서: `pnpm install --frozen-lockfile` → `pnpm typecheck` → `pnpm generate` → artifact upload → deploy

### 저장소 정책

- `dist/`는 더 이상 Git 추적 대상이 아님 (CI 아티팩트 기반 배포)
- 정적 결과물은 `.output/public`에서만 검증

### 롤백 기준

- `build` 또는 `deploy` job이 red이면 배포 중단
- 복구는 직전 green commit을 `master`에 재배포(re-run 또는 revert 후 push)
- 복구 후 확인 항목:
  1. GitHub Actions `build` / `deploy` green
  2. `https://sejinjja.github.io` 정상 응답
  3. 주요 경로(`/`, `/about`, `/projects`, `/writing`, `/writing/hello-world`) 렌더링 정상
