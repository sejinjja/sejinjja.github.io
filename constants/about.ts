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
