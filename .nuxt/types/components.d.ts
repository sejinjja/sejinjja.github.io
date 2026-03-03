
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

interface _GlobalComponents {
  ProseImg: typeof import("../../components/content/ProseImg.vue")['default']
  AboutCollaborationGuide: typeof import("../../components/about/CollaborationGuide.vue")['default']
  AboutProfileCard: typeof import("../../components/about/ProfileCard.vue")['default']
  AboutTechPreferences: typeof import("../../components/about/TechPreferences.vue")['default']
  AboutWorkApproach: typeof import("../../components/about/WorkApproach.vue")['default']
  CommonBadgeTag: typeof import("../../components/common/BadgeTag.vue")['default']
  CommonContentCard: typeof import("../../components/common/ContentCard.vue")['default']
  CommonIconFeatureCard: typeof import("../../components/common/IconFeatureCard.vue")['default']
  CommonSectionTitle: typeof import("../../components/common/SectionTitle.vue")['default']
  CommonThemeToggle: typeof import("../../components/common/ThemeToggle.vue")['default']
  HomeHeroSection: typeof import("../../components/home/HeroSection.vue")['default']
  HomeKeywordsSection: typeof import("../../components/home/KeywordsSection.vue")['default']
  HomeQuickNav: typeof import("../../components/home/QuickNav.vue")['default']
  LayoutTheFooter: typeof import("../../components/layout/TheFooter.vue")['default']
  LayoutTheHeader: typeof import("../../components/layout/TheHeader.vue")['default']
  ProjectsProjectCard: typeof import("../../components/projects/ProjectCard.vue")['default']
  ProseA: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseA.vue")['default']
  ProseBlockquote: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseBlockquote.vue")['default']
  ProseCode: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseCode.vue")['default']
  ProseEm: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseEm.vue")['default']
  ProseH1: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH1.vue")['default']
  ProseH2: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH2.vue")['default']
  ProseH3: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH3.vue")['default']
  ProseH4: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH4.vue")['default']
  ProseH5: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH5.vue")['default']
  ProseH6: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH6.vue")['default']
  ProseHr: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseHr.vue")['default']
  ProseLi: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseLi.vue")['default']
  ProseOl: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseOl.vue")['default']
  ProseP: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseP.vue")['default']
  ProsePre: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProsePre.vue")['default']
  ProseScript: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseScript.vue")['default']
  ProseStrong: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseStrong.vue")['default']
  ProseTable: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTable.vue")['default']
  ProseTbody: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTbody.vue")['default']
  ProseTd: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTd.vue")['default']
  ProseTh: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTh.vue")['default']
  ProseThead: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseThead.vue")['default']
  ProseTr: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTr.vue")['default']
  ProseUl: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseUl.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../node_modules/.pnpm/@nuxt+image@2.0.0_db0@0.3.4_better-sqlite3@12.6.2__ioredis@5.9.2_magicast@0.5.2/node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']
  NuxtPicture: typeof import("../../node_modules/.pnpm/@nuxt+image@2.0.0_db0@0.3.4_better-sqlite3@12.6.2__ioredis@5.9.2_magicast@0.5.2/node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']
  ContentRenderer: typeof import("../../node_modules/.pnpm/@nuxt+content@3.11.2_better-sqlite3@12.6.2_magicast@0.5.2/node_modules/@nuxt/content/dist/runtime/components/ContentRenderer.vue")['default']
  Icon: typeof import("../../node_modules/.pnpm/@nuxt+icon@2.2.1_magicast@0.5.2_vite@7.3.1_@types+node@25.2.2_jiti@2.6.1_lightningcss@1.30.2__4klwsklie2nljpx6anruufekla/node_modules/@nuxt/icon/dist/runtime/components/index")['default']
  ColorScheme: typeof import("../../node_modules/.pnpm/@nuxtjs+color-mode@4.0.0_magicast@0.5.2/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue")['default']
  NuxtPage: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Body']
  MDC: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDC.vue")['default']
  MDCCached: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDCCached.vue")['default']
  MDCRenderer: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDCRenderer.vue")['default']
  MDCSlot: typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDCSlot.vue")['default']
  NuxtIsland: typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyProseImg: LazyComponent<typeof import("../../components/content/ProseImg.vue")['default']>
  LazyAboutCollaborationGuide: LazyComponent<typeof import("../../components/about/CollaborationGuide.vue")['default']>
  LazyAboutProfileCard: LazyComponent<typeof import("../../components/about/ProfileCard.vue")['default']>
  LazyAboutTechPreferences: LazyComponent<typeof import("../../components/about/TechPreferences.vue")['default']>
  LazyAboutWorkApproach: LazyComponent<typeof import("../../components/about/WorkApproach.vue")['default']>
  LazyCommonBadgeTag: LazyComponent<typeof import("../../components/common/BadgeTag.vue")['default']>
  LazyCommonContentCard: LazyComponent<typeof import("../../components/common/ContentCard.vue")['default']>
  LazyCommonIconFeatureCard: LazyComponent<typeof import("../../components/common/IconFeatureCard.vue")['default']>
  LazyCommonSectionTitle: LazyComponent<typeof import("../../components/common/SectionTitle.vue")['default']>
  LazyCommonThemeToggle: LazyComponent<typeof import("../../components/common/ThemeToggle.vue")['default']>
  LazyHomeHeroSection: LazyComponent<typeof import("../../components/home/HeroSection.vue")['default']>
  LazyHomeKeywordsSection: LazyComponent<typeof import("../../components/home/KeywordsSection.vue")['default']>
  LazyHomeQuickNav: LazyComponent<typeof import("../../components/home/QuickNav.vue")['default']>
  LazyLayoutTheFooter: LazyComponent<typeof import("../../components/layout/TheFooter.vue")['default']>
  LazyLayoutTheHeader: LazyComponent<typeof import("../../components/layout/TheHeader.vue")['default']>
  LazyProjectsProjectCard: LazyComponent<typeof import("../../components/projects/ProjectCard.vue")['default']>
  LazyProseA: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseA.vue")['default']>
  LazyProseBlockquote: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseBlockquote.vue")['default']>
  LazyProseCode: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseCode.vue")['default']>
  LazyProseEm: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseEm.vue")['default']>
  LazyProseH1: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH1.vue")['default']>
  LazyProseH2: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH2.vue")['default']>
  LazyProseH3: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH3.vue")['default']>
  LazyProseH4: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH4.vue")['default']>
  LazyProseH5: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH5.vue")['default']>
  LazyProseH6: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH6.vue")['default']>
  LazyProseHr: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseHr.vue")['default']>
  LazyProseLi: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseLi.vue")['default']>
  LazyProseOl: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseOl.vue")['default']>
  LazyProseP: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseP.vue")['default']>
  LazyProsePre: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProsePre.vue")['default']>
  LazyProseScript: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseScript.vue")['default']>
  LazyProseStrong: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseStrong.vue")['default']>
  LazyProseTable: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTable.vue")['default']>
  LazyProseTbody: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTbody.vue")['default']>
  LazyProseTd: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTd.vue")['default']>
  LazyProseTh: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTh.vue")['default']>
  LazyProseThead: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseThead.vue")['default']>
  LazyProseTr: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTr.vue")['default']>
  LazyProseUl: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseUl.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxt+image@2.0.0_db0@0.3.4_better-sqlite3@12.6.2__ioredis@5.9.2_magicast@0.5.2/node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxt+image@2.0.0_db0@0.3.4_better-sqlite3@12.6.2__ioredis@5.9.2_magicast@0.5.2/node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']>
  LazyContentRenderer: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxt+content@3.11.2_better-sqlite3@12.6.2_magicast@0.5.2/node_modules/@nuxt/content/dist/runtime/components/ContentRenderer.vue")['default']>
  LazyIcon: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxt+icon@2.2.1_magicast@0.5.2_vite@7.3.1_@types+node@25.2.2_jiti@2.6.1_lightningcss@1.30.2__4klwsklie2nljpx6anruufekla/node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
  LazyColorScheme: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+color-mode@4.0.0_magicast@0.5.2/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue")['default']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyMDC: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDC.vue")['default']>
  LazyMDCCached: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDCCached.vue")['default']>
  LazyMDCRenderer: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDCRenderer.vue")['default']>
  LazyMDCSlot: LazyComponent<typeof import("../../node_modules/.pnpm/@nuxtjs+mdc@0.20.1_magicast@0.5.2/node_modules/@nuxtjs/mdc/dist/runtime/components/MDCSlot.vue")['default']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@25.2.2_@vue+compiler-sfc@3.5.28_better-sqlite3@1_z5dnk6vebqy37dmjbay4nes77m/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
