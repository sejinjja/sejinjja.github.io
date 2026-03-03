---
title: "JS 없이도 UI가 반응한다: scroll-state 쿼리와 타입 있는 attr()"
description: "스크롤 가능 방향(위/아래)과 HTML 속성 값(색/숫자/키워드)을 CSS가 직접 읽고 검증하면, \"작은 UI 디테일\"을 JS 없이도 안정적으로 구현할 수 있습니다."
date: "2026-02-10"
tags: ["프론트엔드", "css"]
notionPageId: "303c01ed-7f98-807e-ad0c-f6ff6e89536a"
source: "notion"
---
# JS 없이도 UI가 반응한다: scroll-state 쿼리와 타입 있는 attr()


한 문장 결론: **스크롤 가능 방향(위/아래)과 HTML 속성 값(색/숫자/키워드)을 CSS가 직접 읽고 검증하면, “작은 UI 디테일”을 JS 없이도 안정적으로 구현할 수 있습니다.** ([MDN: Container scroll-state queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries))


## 배경/문제


세로 스크롤 영역에서 “여기 더 내려갈 수 있어요” 같은 힌트를 주고 싶을 때가 많습니다. 대표적으로:

- 코드 블록/표/리스트처럼 **세로로 스크롤되는 영역**이 있는 UI
- 타이포그래피, 그리드 정렬처럼 **레이아웃 디테일이 UX 품질을 좌우**하는 화면

그런데 이 힌트(그림자)는 보통 JS로 스크롤 위치를 계산해서 토글합니다. 유지보수 포인트가 늘고, 스크롤 이벤트 성능도 신경 써야 하죠.


또 하나. HTML과 CSS 사이 값 전달도 자주 애매해집니다.

- 테마 색을 바꾸려고 inline style을 쓰거나
- 그리드 컬럼 수를 바꾸려고 class를 늘리거나
- `data-*` 값을 쓰고 싶어도 CSS에서 “문자열”로만 처리되는 제약이 있었습니다 ([MDN: attr()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/attr))

포인트는 단순합니다. **CSS가 “상태(스크롤 가능 방향)”와 “입력값(HTML 속성)”을 직접 다루면 JS 의존도를 크게 줄일 수 있습니다.** ([MDN: Container scroll-state queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries))


## 핵심 개념


### 1) scroll-state 컨테이너 쿼리로 “스크롤 가능 방향”을 질의하기


`container-type: scroll-state`를 설정하면, CSS에서 `@container scroll-state(scrollable: top|bottom|y...)` 형태로 **해당 방향으로 스크롤이 가능한지**를 질의할 수 있습니다. ([MDN: Container scroll-state queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries))


### 2) 타입이 있는 attr()로 “HTML 속성 값을 CSS 타입으로 파싱하기”


`attr()`는 HTML 속성 값을 CSS에서 꺼내 쓰는 함수입니다. 여기에 `type(<color>)`, `type(<integer>)` 같은 타입을 붙이면 **파싱 + 검증 + fallback**까지 한 번에 처리할 수 있습니다. ([Chrome for Developers: advanced attr()](https://developer.chrome.com/blog/advanced-attr))


```mermaid
flowchart LR
  A["HTML<br/>data-* / 커스텀 속성"] -->|"\\"attr()로 읽기\\""| B["CSS<br/>type()로 파싱/검증<br/>fallback 지정"]
  B -->|"\\"계산된 스타일\\""| C["UI 결과<br/>색상/그리드/정렬 반영"]
  D["스크롤 컨테이너"] -->|"\\"scroll-state 질의\\""| E["그림자 토글<br/>(위/아래 방향)"]
```


→ 기대 결과/무엇이 달라졌는지: **HTML은 “값”만 제공하고, CSS는 그 값을 “타입 안정적으로” 해석**합니다. 스크롤 힌트도 **브라우저 상태를 CSS가 직접 질의**해 토글할 수 있습니다. ([MDN: Container scroll-state queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries))


## 해결 접근

1. **스크롤 영역에 컨테이너 이름/타입을 부여**합니다. (`container-type: scroll-state`)
2. **위/아래 그림자 레이어를 만들고 기본은 숨김** 처리합니다.
3. `@container ... scrollable: top/bottom` 조건이 참일 때만 **그림자를 켭니다.** ([MDN: Container scroll-state queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries))
4. 테마/그리드 같은 값은 HTML 속성으로 전달하고, CSS에서 `attr(... type(...), fallback)`으로 받아 씁니다. ([Chrome for Developers: advanced attr()](https://developer.chrome.com/blog/advanced-attr))

## 구현(코드)


아래 예시는 Next.js(App Router)에서 바로 붙여볼 수 있는 형태로 구성했습니다.


### `app/page.tsx`


```typescript
import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.page}>
      <section className={styles.theme} data-bg="white" data-fg="deeppink">
        <h1 className={styles.title}>Scroll Hint + Typed attr()</h1>
        <p className={styles.desc}>
          스크롤 영역은 위/아래 방향에 따라 그림자를 표시하고,
          테마/그리드 값은 HTML 속성으로 전달합니다.
        </p>
      </section>

      <section className={styles.grid} data-columns="3">
        {Array.from({ length: 9 }).map((_, i) => (
          <article key={i} className={styles.card}>
            Card {i + 1}
          </article>
        ))}
      </section>

      <section className={styles.scrollArea} aria-label="Scrollable content">
        <div className={styles.shadowTop} aria-hidden="true" />
        <div className={styles.shadowBottom} aria-hidden="true" />

        <div className={styles.scrollContent}>
          {Array.from({ length: 40 }).map((_, i) => (
            <p key={i} className={styles.line}>
              Line {i + 1} — 스크롤하면서 위/아래 그림자 변화를 확인합니다.
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
```


→ 기대 결과/무엇이 달라졌는지: **그림자/테마/그리드가 전부 “HTML 속성 + CSS”만으로 연결**됩니다. JS로 스크롤 위치를 읽는 코드를 만들지 않아도 됩니다. ([MDN: Container scroll-state queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries))


### `app/page.module.css`


```css
.page {
  padding: 24px;
  display: grid;
  gap: 20px;
}

/* 1) Typed attr()로 테마 연결 */
.theme {
  padding: 16px;
  border-radius: 12px;

  /* 기본값(호환성/안전성) */
  background: black;
  color: white;
}

/* typed attr() 지원 환경에서만 업그레이드 */
@supports (color: attr(data-fg type(<color>), white)) {
  .theme {
    background: attr(data-bg type(<color>), black);
    color: attr(data-fg type(<color>), white);
  }
}

.title {
  margin: 0 0 6px;
}
.desc {
  margin: 0;
}

/* 2) Typed attr()로 그리드 컬럼 수 연결 */
.grid {
  display: grid;
  gap: 12px;

  /* 기본값 */
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@supports (width: attr(data-columns type(<integer>), 3)) {
  .grid {
    --_cols: attr(data-columns type(<integer>), 3);
    grid-template-columns: repeat(var(--_cols), minmax(0, 1fr));
  }
}

.card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  padding: 14px;
}

/* 3) scroll-state 쿼리로 스크롤 방향 힌트(그림자) */
.scrollArea {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);

  height: 220px;
  overflow: auto;
  position: relative;

  /* 컨테이너 쿼리 설정 */
  container-name: scroller;
  container-type: scroll-state;
}

/* 그림자 레이어: 레이아웃을 밀지 않도록 음수 마진으로 겹치기 */
.shadowTop,
.shadowBottom {
  pointer-events: none;
  position: sticky;
  left: 0;
  right: 0;
  height: 14px;
  opacity: 0;
  transition: opacity 160ms ease;
  z-index: 1;
}

.shadowTop {
  top: 0;
  margin-bottom: -14px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.22), transparent);
}

.shadowBottom {
  bottom: 0;
  margin-top: -14px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.22), transparent);
}

/* scroll-state 지원 환경에서만 방향별로 그림자 토글 */
@supports (container-type: scroll-state) {
  @container scroller scroll-state(scrollable: top) {
    .shadowTop {
      opacity: 1;
    }
  }

  @container scroller scroll-state(scrollable: bottom) {
    .shadowBottom {
      opacity: 1;
    }
  }
}

.scrollContent {
  padding: 12px 14px;
}

.line {
  margin: 0 0 10px;
}
```


→ 기대 결과/무엇이 달라졌는지: **(1) 테마/그리드 값은 HTML 속성에서 CSS로 “타입 안정적으로” 이동**하고, **(2) 스크롤 가능 방향은 CSS가 직접 질의**해서 위/아래 그림자를 자동으로 토글합니다. ([MDN: Container scroll-state queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries))


### (추가) “enum처럼” 키워드만 받게 만들기


아래처럼 `type(start | center | end)`로 허용 키워드만 받게 만들면, 잘못된 값은 fallback으로 안전하게 떨어집니다. ([MDN: type()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/type))


```css
[scroll-snap] {
  scroll-snap-align: attr(scroll-snap type(start | center | end), start);
}
```


→ 기대 결과/무엇이 달라졌는지: HTML이 `scroll-snap="nothing"`처럼 엉뚱한 값을 보내도, CSS는 **유효한 값만 받아들이고 기본값으로 안전하게 복구**합니다. ([MDN: type()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/type))


## 검증 방법(체크리스트)

- [ ] 스크롤 영역이 **최상단**일 때: 아래 그림자만 보인다. ([MDN: Container scroll-state queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries))
- [ ] 스크롤 영역이 **중간**일 때: 위/아래 그림자가 모두 보인다. ([MDN: Container scroll-state queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries))
- [ ] 스크롤 영역이 **최하단**일 때: 위 그림자만 보인다. ([MDN: Container scroll-state queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries))
- [ ] `data-columns`에 잘못된 값(예: `"abc"`)을 넣어도 레이아웃이 깨지지 않고 fallback으로 유지된다. ([W3C: CSS Values and Units Level 5](https://www.w3.org/TR/css-values-5/))
- [ ] `data-bg`, `data-fg`에 유효하지 않은 색을 넣어도 기본 색(black/white)으로 동작한다. ([Chrome for Developers: advanced attr()](https://developer.chrome.com/blog/advanced-attr))

## 흔한 실수/FAQ


### Q1. `attr(data-bg color, black)`처럼 “타입 이름만” 쓰면 되나요?


공식 문서 기준으로는 `type(<color>)`처럼 **`type()`****로 감싸는 형태**가 핵심입니다. (문법/지원은 환경에 따라 달라질 수 있습니다.) ([Chrome for Developers: advanced attr()](https://developer.chrome.com/blog/advanced-attr))


### Q2. `attr()`로 URL을 만들어 `background-image`에 넣을 수 있나요?


`attr()`로 만들어진 값은 URL로 사용될 때 제한이 걸릴 수 있습니다. 스타일 목적이라면 색/숫자/키워드 같은 “안전한 타입” 위주로 설계하는 편이 좋습니다. ([W3C: CSS Values and Units Level 5](https://www.w3.org/TR/css-values-5/))


### Q3. 이 기능이 없는 브라우저에서는 어떻게 하나요?

- 테마/그리드 값 전달: **CSS 커스텀 프로퍼티(****`-var`****) + inline style**이 가장 단순한 대안입니다. ([MDN: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties))
- “enum” 매핑: `[attr="value"]` **속성 선택자**로 분기하면 호환성이 넓습니다.
- 스크롤 그림자: **IntersectionObserver/scroll 이벤트**로 `data-scroll-top` 같은 플래그를 토글하는 방식이 대안입니다. ([MDN: IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API))

## 요약(3~5줄)

- `scroll-state` 컨테이너 쿼리는 **스크롤 가능 방향을 CSS가 직접 질의**해 그림자를 토글할 수 있게 합니다. ([MDN: Container scroll-state queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries))
- 타입이 있는 `attr()`는 HTML 속성 값을 **색/숫자/키워드로 파싱**하고, 실패 시 fallback으로 안전하게 복구합니다. ([Chrome for Developers: advanced attr()](https://developer.chrome.com/blog/advanced-attr))
- `@supports`로 감싸면 **점진적 향상(Progressive Enhancement)** 패턴으로 적용하기 쉽습니다. ([MDN: Conditional rules](https://developer.mozilla.org/en-US/docs/Web/CSS/Conditional_rules))

## 결론


타이포그래피와 그리드 정렬처럼 “디테일이 곧 품질”인 UI에서는, **JS로 상태를 추적하기보다 CSS가 상태/입력값을 직접 다루게 만드는 편이 유지보수에 유리**합니다.


scroll-state 쿼리와 타입 있는 attr()는 HTML–CSS 연결을 한 단계 더 강하게 만들어 줍니다. ([MDN: Container scroll-state queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries))


## 참고(공식 문서 링크)

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [MDN: attr()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/attr)
- [MDN: type()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/type)
- [MDN: Container scroll-state queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries)
- [W3C: CSS Conditional Rules Level 5](https://www.w3.org/TR/css-conditional-5/)
- [W3C: CSS Values and Units Level 5](https://www.w3.org/TR/css-values-5/)
- [Chrome for Developers: CSS scroll-state()](https://developer.chrome.com/blog/css-scroll-state-queries)
- [Chrome for Developers: CSS attr() gets an upgrade](https://developer.chrome.com/blog/advanced-attr)
- [MDN: IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [MDN: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
