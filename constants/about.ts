import { SITE_OWNER_NAME } from '~/constants/seo'

export const ABOUT_PAGE_TITLE = '소개'
export const ABOUT_PAGE_META_DESCRIPTION = '문제 접근 패턴, 품질 기준, 기술 성향과 협업 방식 등 조세진 개발자의 일하는 방식을 소개합니다.'
export const ABOUT_PAGE_OG_TITLE = `${ABOUT_PAGE_TITLE} | ${SITE_OWNER_NAME}`

export interface AboutStrength {
  title: string
  description: string
}

export const ABOUT_PAGE_STRENGTHS: AboutStrength[] = [
  {
    title: '정의와 구현의 정합성',
    description: '문서/코드/동작이 서로 다르게 해석되는 상황을 싫어하고, 이를 줄이는 방향으로 정리합니다.',
  },
  {
    title: '실무 감각 있는 구조화',
    description: '라이브러리/패턴을 "왜 필요한가, 언제 무너지는가"로 평가합니다.',
  },
  {
    title: '도구화 능력',
    description: '반복 작업을 CLI/가이드/템플릿으로 전환해 생산성을 끌어올리는 타입입니다.',
  },
  {
    title: '깊이 있는 검증 태도',
    description: '"대충 맞는 설명"보다 근거와 경계 조건을 챙기는 편입니다.',
  },
]

export const ABOUT_PROFILE_NAME = '조세진'
export const ABOUT_PROFILE_ROLE = '프런트엔드/웹 개발자'
export const ABOUT_PROFILE_AVATAR_ICON = 'heroicons:user'

export interface AboutProfileInfoItem {
  icon: string
  text: string
}

export const ABOUT_PROFILE_INFO_ITEMS: AboutProfileInfoItem[] = [
  {
    icon: 'heroicons:building-office-2',
    text: '삼성카드 재직',
  },
  {
    icon: 'heroicons:map-pin',
    text: '미사 거주',
  },
  {
    icon: 'heroicons:code-bracket',
    text: '컴퓨터 프로그래머',
  },
]

export const ABOUT_WORK_APPROACH_TITLE = '일하는 방식'

export interface AboutWorkApproachItem {
  title: string
  icon: string
  points: string[]
}

export const ABOUT_WORK_APPROACH_ITEMS: AboutWorkApproachItem[] = [
  {
    title: '문제 접근 패턴',
    icon: 'heroicons:magnifying-glass',
    points: [
      '현상을 먼저 관찰하고, 원인 범위를 좁힌 뒤 해결합니다.',
      '재현 가능한 최소 사례(최소 입력/최소 코드)를 만들고, 이후 확장합니다.',
      '"왜 이렇게 해야 하는가"를 납득할 수 있어야 움직입니다.',
    ],
  },
  {
    title: '품질 기준',
    icon: 'heroicons:shield-check',
    points: [
      '엣지 케이스와 예외 처리(실패 조건)를 포함한 "완결성"을 중시합니다.',
      '성능 이슈는 감(느낌)이 아니라, 관찰 가능한 지표(측정/프로파일링) 중심으로 다루려 합니다.',
    ],
  },
  {
    title: '커뮤니케이션 스타일',
    icon: 'heroicons:chat-bubble-left-right',
    points: [
      '표현의 작은 차이가 구현 차이를 만든다고 보고, 문장/정의의 정확도를 챙깁니다.',
      '피드백은 건설적이고 구체적인 개선 방향이 있어야 가치 있다고 느낍니다.',
    ],
  },
]

export const ABOUT_TECH_PREFERENCES_TITLE = '기술 성향'

export interface AboutTechPreferenceItem {
  title: string
  details: string[]
}

export const ABOUT_TECH_PREFERENCE_ITEMS: AboutTechPreferenceItem[] = [
  {
    title: 'Vue / Nuxt 제품 개발',
    details: [
      'Composition API 기반으로 화면 로직과 도메인 로직을 분리해 유지보수성을 높입니다.',
      '페이지는 단순하게 유지하고, 공통 상태/행동은 composable과 서버 API 계층으로 올립니다.',
      'SSR/SEO/접근성을 초기 설계에 포함해 Nuxt의 장점을 기본값으로 가져갑니다.',
    ],
  },
  {
    title: '설계 원칙과 코드 품질',
    details: [
      '상태는 필요한 범위에서만 관리하고 전역 스토어 남용을 피합니다.',
      '기능 추가 전 타입 경계를 먼저 정의해 변경 영향도를 예측 가능하게 만듭니다.',
      '작은 단위 컴포넌트, 명확한 네이밍, 일관된 디렉토리 규칙을 우선합니다.',
    ],
  },
  {
    title: '성능과 운영 관점',
    details: [
      '요청/렌더 병목은 캐싱, 배치 처리, 불필요한 반응성 축소로 선제 대응합니다.',
      '타입체크와 자동화 스크립트를 배포 전 기본 게이트로 두어 회귀를 줄입니다.',
      '문제 발생 시 재현 가능한 로그와 에러 메시지를 남겨 대응 시간을 단축합니다.',
    ],
  },
  {
    title: '협업 방식',
    details: [
      'PR에는 구현 의도, 대안, 트레이드오프를 함께 기록해 의사결정을 투명하게 공유합니다.',
      '리뷰는 취향보다 사용자 영향과 리스크 중심으로 진행합니다.',
      '반복 이슈는 개인 실수로 끝내지 않고 시스템 개선 과제로 환원합니다.',
    ],
  },
]

export const ABOUT_COLLABORATION_GUIDE_TITLE = '함께 일할 때 잘 맞는 방식'

export const ABOUT_COLLABORATION_GUIDE_ITEMS = [
  '"지금 무엇이 확정이고, 무엇이 미정인지"를 명시해주면 최고의 퍼포먼스를 냅니다.',
  '요구사항에 입력 계약 / 실패 조건 / 검증 기준을 같이 주면 구현 품질이 급상승합니다.',
  '변경 요청은 "왜 바뀌는지"와 "어디까지 보장해야 하는지(테스트 범위)"가 포함되면 가장 좋습니다.',
] as const
