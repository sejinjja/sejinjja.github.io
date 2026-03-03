---
title: "필요한 만큼만 Hydrate하라: SSR과 Hydration의 진짜 비용"
description: "SSR이 빠르다고 느껴지는 이유와, Hydration이 실제로 어디에서 병목이 되는지. Next.js/Nuxt에서 바로 적용 가능한 전략까지."
date: "2026-02-10"
tags: ["javascript", "프론트엔드"]
notionPageId: "303c01ed-7f98-80c8-9072-f91702902aab"
source: "notion"
---
> SSR이 빠르다고 느껴지는 이유와, Hydration이 실제로 어디에서 병목이 되는지. Next.js/Nuxt에서 바로 적용 가능한 전략까지.

**태그:** SSR, Hydration, Next.js, Nuxt, Web Performance, SEO  


**작성일:** 2026-02-10


---


SSR(Server Side Rendering)을 도입하면 **초기 화면이 빨라지고 SEO가 좋아진다**는 이야기는 익숙합니다. 그런데 실무에서 "SSR 했는데도 체감이 느려요", "초기 화면은 뜨는데 클릭이 안 먹어요" 같은 상황이 자주 발생합니다.


대부분의 원인은 **Hydration 비용을 과소평가**했기 때문입니다.


이 글은 다음 흐름으로 정리합니다.

1. SSR이 _무엇을_ 해결하고 _무엇을_ 해결하지 못하는지
2. Hydration이 _어떤 작업_을 하고 _왜 무거운지_
3. Next.js / Nuxt에서 **'필요한 만큼만' Hydrate**하는 실전 전략

---


## 1. SSR이 해결하는 것 vs 해결하지 못하는 것


### SSR이 해결하는 것

- **초기 HTML이 이미 완성되어 내려옴** → 브라우저가 빠르게 페인트 가능
- 크롤러가 **즉시 콘텐츠를 읽을 수 있음** → SEO에 유리
- 느린 네트워크/저사양에서도 "일단 보인다"를 달성하기 쉬움

### SSR이 해결하지 못하는 것

- SSR HTML은 **정적 상태**입니다. 즉, 버튼 클릭/입력/드롭다운 같은 상호작용은 **JS가 붙기 전까지는 불가능**합니다.
- 따라서 SSR만으로는 **TTI(Time To Interactive)**를 보장하지 못합니다. (눈에는 보이는데, 손이 안 닿는 화면)

---


## 2. Hydration이 실제로 하는 일


Hydration은 간단히 말하면:

> "서버가 만든 HTML" 위에
> "클라이언트 JS가 가진 가상 DOM/렌더 결과"를 맞춰보고,
> 이벤트 핸들러를 연결해 **상호작용 가능한 앱 상태**로 바꾸는 과정

### Hydration 중에 비용이 커지는 지점

- **컴포넌트 트리 전부 실행** (렌더 함수/템플릿 평가, 훅 실행, 계산 속성/워처 초기화 등)
- **이벤트 리스너 부착**
- **DOM 매칭/검증** 서버 HTML과 클라이언트 렌더 결과가 다르면 "Hydration mismatch"가 발생하며 추가 비용/경고/재렌더가 생김
- **추가 데이터 패칭이 겹침** 서버에서도 데이터 요청, 클라이언트에서도 다시 요청 → 낭비 + 지연

---


## 3. 증상으로 빠르게 원인 찾기 (체크리스트)


아래 중 하나라도 자주 보이면 Hydration 병목일 가능성이 큽니다.

- 초기 화면은 빨리 보이는데, **스크롤/클릭이 1~2초 먹통**
- Lighthouse에서 **TBT/INP**가 나쁨
- "Hydration mismatch" 경고가 간헐적으로 뜸
- 리스트/카드/차트처럼 **DOM이 많은 구간**에서 초기 인터랙션이 느림
- 3rd-party 스크립트(analytics, chat widget)가 초기 로딩에 붙어있음

---


## 4. 전략: "필요한 만큼만" Hydrate하기


핵심은 단순합니다.

- **보이는 것**과 **상호작용하는 것**을 분리한다.
- 상호작용이 필요한 영역만 **클라이언트 컴포넌트**로 두고, 나머지는 **서버 렌더(또는 정적)**로 유지한다.
- 사용자 행동(스크롤/클릭/뷰포트 진입)에 맞춰 **점진적으로** Hydrate한다.

아래는 실무에서 바로 적용 가능한 패턴들입니다.


---


## 5. 패턴 A: 인터랙션 "껍데기"만 클라이언트로


### 아이디어

- 카드 목록 UI는 SSR로 빠르게 보여준다.
- "좋아요 버튼", "장바구니 담기" 같은 **작은 상호작용만** 클라이언트로 감싼다.

### Next.js(App Router) 예시


```typescript
// app/products/page.tsx (Server Component)
import LikeButton from "./LikeButton";

export default async function ProductsPage() {
  const products = await fetch("https://example.com/api/products", { cache: "no-store" })
    .then(r => r.json());

  return (
    <main>
      <h1>Products</h1>
      <ul>
        {products.map((p: any) => (
          <li key={p.id}>
            <strong>{p.name}</strong>
            <span> · {p.price}</span>
            <LikeButton productId={p.id} initialLiked={p.liked} />
          </li>
        ))}
      </ul>
    </main>
  );
}
```


```typescript
// app/products/LikeButton.tsx (Client Component)
"use client";

import { useState, useTransition } from "react";

export default function LikeButton({
  productId,
  initialLiked,
}: {
  productId: string;
  initialLiked: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          setLiked(v => !v);
          await fetch(`/api/like?productId=${productId}`, { method: "POST" });
        });
      }}
    >
      {liked ? "♥ Liked" : "♡ Like"}
    </button>
  );
}
```


**효과:** 페이지 전체가 아니라 **필요한 버튼만** hydration 대상이 됩니다.


---


## 6. 패턴 B: "뷰포트 진입" 후에만 Hydrate하기


리스트 아래쪽에 있는 무거운 컴포넌트(차트, 맵, 코드 하이라이터 등)는 **사용자가 스크롤로 도달했을 때** 로드/하이드레이트하는 편이 낫습니다.


### Next.js: dynamic import + ssr false (클라이언트 전용 로드)


```typescript
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./HeavyChart"), { ssr: false });

export default function Page() {
  return (
    <>
      <section>가벼운 콘텐츠(SSR)</section>
      <section style= height: 1200 >스크롤 구간</section>
      <HeavyChart />
    </>
  );
}
```


### Nuxt 3: `<ClientOnly>` + 동적 import


```javascript
<template>
  <section>가벼운 콘텐츠(SSR)</section>

  <div style="height: 1200px">스크롤 구간</div>

  <ClientOnly>
    <HeavyChart />
  </ClientOnly>
</template>

<script setup>
const HeavyChart = defineAsyncComponent(() => import("~/components/HeavyChart.vue"));
</script>
```


**주의:** `ssr: false` / `<ClientOnly>`는 "그 구간은 SSR로는 비워두겠다"는 의미입니다. 즉 SEO가 필요하거나 레이아웃 점프가 민감한 영역은 신중히 사용하세요.


---


## 7. 패턴 C: 서버/클라이언트 데이터 요청 "중복 제거"


SSR에서 데이터를 이미 가져왔다면, 클라이언트에서 같은 요청을 다시 하게 만들면 안 됩니다.


### 지침

- SSR이 내려준 데이터를 **초기 상태로 주입**하고, 클라이언트는 그걸 재사용한다.
- 캐시 레이어(React Query, SWR, Pinia 등)를 쓴다면 **dehydrate/rehydrate** 흐름을 고려한다.
- "서버에서는 A 요청, 클라이언트에서는 B 요청"처럼 쪼개서 중복을 줄인다.

---


## 8. 패턴 D: Hydration mismatch를 줄이는 규칙


Hydration mismatch는 "서버 렌더 결과"와 "클라이언트 첫 렌더 결과"가 다를 때 발생합니다.


### 자주 터지는 원인

- [`Date.now`](http://date.now/)`()`, `Math.random()`을 렌더 과정에서 직접 사용
- 클라이언트에서만 있는 값(localStorage, window size)을 SSR 렌더에서 참조
- 타임존/로케일/포맷이 서버와 클라이언트에서 다름

### 실전 규칙

- 랜덤/시간 값은 렌더가 아니라 **이펙트(마운트 이후)**에서 채운다.
- `window`/`document` 접근은 **클라이언트 전용 코드**로 격리한다.
- 포맷은 서버와 클라이언트가 동일한 기준을 쓰게 한다(특히 날짜).

---


## 9. 결론: SSR은 "보이게" 하고, Hydration은 "만지게" 한다


SSR로는 **초기 화면의 인지 속도**를 개선합니다. Hydration으로는 **상호작용 가능 상태**를 완성합니다.


그래서 성능 목표를 이렇게 잡는 게 실무적으로 낫습니다.

- **SSR로 LCP를 당긴다** (빠르게 보이게)
- **Hydration 범위를 줄인다** (빠르게 만지게)
- **무거운 컴포넌트는 늦춘다** (필요할 때만)

---


## 부록: 빠른 의사결정 매트릭스

- **SEO 중요 + 콘텐츠 중심 페이지**

    → SSR/SSG 중심, 인터랙션은 부분 클라이언트화

- **대시보드/앱성 UI (인터랙션이 대부분)**

    → SSR은 최소(껍데기/레이아웃), 본체는 클라이언트 + 캐시/코드스플릿

- **3rd-party 스크립트가 많음**

    → 초기 로딩에서 분리(지연 로딩), 성능 영향 측정 후 단계적 적용


---


## 한 줄 요약

> SSR은 "빨리 보이게" 만들고, Hydration은 "빨리 만지게" 만든다.
> 둘 중 하나만 최적화하면 체감 성능은 절반만 좋아진다.
