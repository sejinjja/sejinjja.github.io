
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T


export const ProseImg: typeof import("../components/content/ProseImg.vue")['default']
export const AboutCollaborationGuide: typeof import("../components/about/CollaborationGuide.vue")['default']
export const AboutProfileCard: typeof import("../components/about/ProfileCard.vue")['default']
export const AboutTechPreferences: typeof import("../components/about/TechPreferences.vue")['default']
export const AboutWorkApproach: typeof import("../components/about/WorkApproach.vue")['default']
export const CommonBadgeTag: typeof import("../components/common/BadgeTag.vue")['default']
export const CommonContentCard: typeof import("../components/common/ContentCard.vue")['default']
export const CommonIconFeatureCard: typeof import("../components/common/IconFeatureCard.vue")['default']
export const CommonSectionTitle: typeof import("../components/common/SectionTitle.vue")['default']
export const CommonThemeToggle: typeof import("../components/common/ThemeToggle.vue")['default']
export const HomeHeroSection: typeof import("../components/home/HeroSection.vue")['default']
export const HomeKeywordsSection: typeof import("../components/home/KeywordsSection.vue")['default']
export const HomeQuickNav: typeof import("../components/home/QuickNav.vue")['default']
export const LayoutTheFooter: typeof import("../components/layout/TheFooter.vue")['default']
export const LayoutTheHeader: typeof import("../components/layout/TheHeader.vue")['default']
export const ProjectsProjectCard: typeof import("../components/projects/ProjectCard.vue")['default']
export const ProseA: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseA.vue")['default']
export const ProseBlockquote: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseBlockquote.vue")['default']
export const ProseCode: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseCode.vue")['default']
export const ProseEm: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseEm.vue")['default']
export const ProseH1: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH1.vue")['default']
export const ProseH2: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH2.vue")['default']
export const ProseH3: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH3.vue")['default']
export const ProseH4: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH4.vue")['default']
export const ProseH5: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH5.vue")['default']
export const ProseH6: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH6.vue")['default']
export const ProseHr: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseHr.vue")['default']
export const ProseLi: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseLi.vue")['default']
export const ProseOl: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseOl.vue")['default']
export const ProseP: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseP.vue")['default']
export const ProsePre: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProsePre.vue")['default']
export const ProseScript: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseScript.vue")['default']
export const ProseStrong: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseStrong.vue")['default']
export const ProseTable: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTable.vue")['default']
export const ProseTbody: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTbody.vue")['default']
export const ProseTd: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTd.vue")['default']
export const ProseTh: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTh.vue")['default']
export const ProseThead: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseThead.vue")['default']
export const ProseTr: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTr.vue")['default']
export const ProseUl: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseUl.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/.pnpm/@nuxt+image@2.0.0_db0@0.3.4_better-sqlite3@12.6.2__ioredis@5.9.2_magicast@0.5.2/node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']
export const NuxtPicture: typeof import("../node_modules/.pnpm/@nuxt+image@2.0.0_db0@0.3.4_better-sqlite3@12.6.2__ioredis@5.9.2_magicast@0.5.2/node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']
export const ContentRenderer: typeof import("../node_modules/.pnpm/@nuxt+content@3.11.2_better-sqlite3@12.6.2_magicast@0.5.2/node_modules/@nuxt/content/dist/runtime/components/ContentRenderer.vue")['default']
export const Icon: typeof import("../node_modules/.pnpm/@nuxt+icon@2.2.1_magicast@0.5.2_vite@7.3.1_@types+node@25.2.2_jiti@2.6.1_lightningcss@1.30.2__4klwsklie2nljpx6anruufekla/node_modules/@nuxt/icon/dist/runtime/components/index")['default']
export const ColorScheme: typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@4.0.0_magicast@0.5.2/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue")['default']
export const NuxtPage: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Body']
export const MDC: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDC.vue")['default']
export const MDCCached: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDCCached.vue")['default']
export const MDCRenderer: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDCRenderer.vue")['default']
export const MDCSlot: typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDCSlot.vue")['default']
export const NuxtIsland: typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyProseImg: LazyComponent<typeof import("../components/content/ProseImg.vue")['default']>
export const LazyAboutCollaborationGuide: LazyComponent<typeof import("../components/about/CollaborationGuide.vue")['default']>
export const LazyAboutProfileCard: LazyComponent<typeof import("../components/about/ProfileCard.vue")['default']>
export const LazyAboutTechPreferences: LazyComponent<typeof import("../components/about/TechPreferences.vue")['default']>
export const LazyAboutWorkApproach: LazyComponent<typeof import("../components/about/WorkApproach.vue")['default']>
export const LazyCommonBadgeTag: LazyComponent<typeof import("../components/common/BadgeTag.vue")['default']>
export const LazyCommonContentCard: LazyComponent<typeof import("../components/common/ContentCard.vue")['default']>
export const LazyCommonIconFeatureCard: LazyComponent<typeof import("../components/common/IconFeatureCard.vue")['default']>
export const LazyCommonSectionTitle: LazyComponent<typeof import("../components/common/SectionTitle.vue")['default']>
export const LazyCommonThemeToggle: LazyComponent<typeof import("../components/common/ThemeToggle.vue")['default']>
export const LazyHomeHeroSection: LazyComponent<typeof import("../components/home/HeroSection.vue")['default']>
export const LazyHomeKeywordsSection: LazyComponent<typeof import("../components/home/KeywordsSection.vue")['default']>
export const LazyHomeQuickNav: LazyComponent<typeof import("../components/home/QuickNav.vue")['default']>
export const LazyLayoutTheFooter: LazyComponent<typeof import("../components/layout/TheFooter.vue")['default']>
export const LazyLayoutTheHeader: LazyComponent<typeof import("../components/layout/TheHeader.vue")['default']>
export const LazyProjectsProjectCard: LazyComponent<typeof import("../components/projects/ProjectCard.vue")['default']>
export const LazyProseA: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseA.vue")['default']>
export const LazyProseBlockquote: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseBlockquote.vue")['default']>
export const LazyProseCode: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseCode.vue")['default']>
export const LazyProseEm: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseEm.vue")['default']>
export const LazyProseH1: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH1.vue")['default']>
export const LazyProseH2: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH2.vue")['default']>
export const LazyProseH3: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH3.vue")['default']>
export const LazyProseH4: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH4.vue")['default']>
export const LazyProseH5: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH5.vue")['default']>
export const LazyProseH6: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH6.vue")['default']>
export const LazyProseHr: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseHr.vue")['default']>
export const LazyProseLi: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseLi.vue")['default']>
export const LazyProseOl: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseOl.vue")['default']>
export const LazyProseP: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseP.vue")['default']>
export const LazyProsePre: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProsePre.vue")['default']>
export const LazyProseScript: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseScript.vue")['default']>
export const LazyProseStrong: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseStrong.vue")['default']>
export const LazyProseTable: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTable.vue")['default']>
export const LazyProseTbody: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTbody.vue")['default']>
export const LazyProseTd: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTd.vue")['default']>
export const LazyProseTh: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTh.vue")['default']>
export const LazyProseThead: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseThead.vue")['default']>
export const LazyProseTr: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTr.vue")['default']>
export const LazyProseUl: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseUl.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+image@2.0.0_db0@0.3.4_better-sqlite3@12.6.2__ioredis@5.9.2_magicast@0.5.2/node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+image@2.0.0_db0@0.3.4_better-sqlite3@12.6.2__ioredis@5.9.2_magicast@0.5.2/node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']>
export const LazyContentRenderer: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+content@3.11.2_better-sqlite3@12.6.2_magicast@0.5.2/node_modules/@nuxt/content/dist/runtime/components/ContentRenderer.vue")['default']>
export const LazyIcon: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+icon@2.2.1_magicast@0.5.2_vite@7.3.1_@types+node@25.2.2_jiti@2.6.1_lightningcss@1.30.2__4klwsklie2nljpx6anruufekla/node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
export const LazyColorScheme: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@4.0.0_magicast@0.5.2/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyMDC: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDC.vue")['default']>
export const LazyMDCCached: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDCCached.vue")['default']>
export const LazyMDCRenderer: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDCRenderer.vue")['default']>
export const LazyMDCSlot: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDCSlot.vue")['default']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
