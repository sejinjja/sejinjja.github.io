import { SITE_OWNER_NAME } from '~/constants/seo'

export const PROJECTS_PAGE_TITLE = '프로젝트'
export const PROJECTS_PAGE_SUBTITLE = '반복 작업을 도구로 전환하고, 아이디어를 서비스로 만듭니다.'
export const PROJECTS_PAGE_META_DESCRIPTION = '반복 작업을 도구로 전환하고 아이디어를 서비스로 구현한 프로젝트를 소개합니다.'
export const PROJECTS_PAGE_OG_TITLE = `${PROJECTS_PAGE_TITLE} | ${SITE_OWNER_NAME}`

export interface ProjectItem {
  title: string
  description: string
  techStack: string[]
  status?: string
  github?: string
  demo?: string
}

export const PROJECTS_ITEMS: ProjectItem[] = [
  {
    title: 'ls-diff',
    description: '대용량 디렉토리 비교 반복 업무를 줄이기 위해 만든 Node.js CLI. 파일 목록 비교(-l), 파일 내용 비교(-d), 동시 비교(-ld)를 제공하고 include/exclude 패턴으로 비교 범위를 제어할 수 있습니다. 현재는 출력 리포트 포맷과 에러 메시지 가독성을 중심으로 고도화 중입니다.',
    techStack: ['Node.js', 'CLI', 'JavaScript', 'Automation'],
    status: 'MVP 완성 · 고도화 중',
    github: 'https://github.com/sejinjja/ls-diff',
  },
  {
    title: '너의 오늘에게',
    description: '감정 기반 편지 생성 서비스 프로토타입. 감정 선택, 문체/길이 설정, AI 초안 생성, 사용자 수정 후 저장까지의 핵심 흐름을 검증했습니다. 개인화 프롬프트 설계와 안전한 출력 가이드라인을 정리해 정식 출시를 준비 중입니다.',
    techStack: ['Nuxt', 'TypeScript', 'AI', 'Prompt Engineering'],
    status: '프로토타입 검증 완료 · 출시 준비',
  },
]
