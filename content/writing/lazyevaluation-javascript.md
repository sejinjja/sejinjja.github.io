---
title: "필요한 만큼만 계산하라"
description: "“일부 결과만” 필요하다면, 배열을 끝까지 가공하는 대신 지연 평가(Lazy Evaluation) 파이프라인을 만들어 조건을 만족하는 순간 즉시 멈추는 구조가 더 유리하다."
date: "2025-11-19"
tags: ["javascript"]
notionPageId: "2f9c01ed-7f98-8009-b536-c6ec1c105f20"
source: "notion"
---
# 필요한 만큼만 계산하라: Lazy Evaluation로 조기 종료


**한 문장 결론:** `take(2)`처럼 “일부 결과만” 필요하다면, 배열을 끝까지 가공하는 대신 _지연 평가(Lazy Evaluation)_ 파이프라인을 만들어 **조건을 만족하는 순간 즉시 멈추는 구조**가 더 유리하다.


## 요약

- “조건을 만족하는 2명만” 뽑는데도 전체 데이터를 `map → filter → map → filter`로 끝까지 훑으면 불필요한 계산이 커진다.
- `Generator function(function*)`으로 `LazyMap`, `LazyFilter`를 만들면 `take(2)`가 파이프라인 전체를 **조기 종료(Early Termination)** 시킬 수 있다.
- 진짜 이득을 내려면 “중간 배열 생성”을 없애야 한다. `range`부터 데이터 생성까지 이터레이터로 흘려 보내야 한다.
- 상황에 따라 함수형 파이프라인보다 단일 `for...of` 루프가 더 단순하고 빠를 수도 있다.

---


## 배경/문제


요구사항이 이런 식으로 왔다고 치자.

- 사용자 데이터에서 **포인트 × 가족 수**를 계산한다.
- 그 값이 **1000 이상**인 사람들 중,
- 그 값의 **제곱근을 구해 소수점을 버린 값이 홀수**인 사람을 찾는다.
- 그중 **두 사람의 마지막 계산된 포인트**(여기서는 “조건을 만족하는 순서대로 2개”)를 뽑는다.

문제는 결과가 2개뿐인데도, 전체를 끝까지 변환/필터링하는 흐름이라면:

- 계산량이 커지고
- 중간 배열/객체가 늘어나 GC 부담이 커지고
- “2개만 필요”한 요구치고는 처리 시간이 길어질 수 있다

---


## 핵심 개념


### Iterable/Iterator 프로토콜


`for...of`로 순회 가능한 객체는 **이터러블(Iterable)**이고, 실제 순회 상태를 갖는 객체가 **이터레이터(Iterator)**다. 이 구조를 따르면 “하나씩 꺼내서 처리하다가 멈추기”가 가능해진다.

- 참고: [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- 참고: [MDN: for…of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)

### Generator function(function*)


`function*`는 호출 시점에 값을 전부 만들지 않고, `next()`가 호출될 때마다 값을 하나씩 만들어 내는 **이터레이터 생성기**다.

- 참고: [MDN: function* (generator function)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/function*)

---


## 해결 접근


핵심은 “**필요한 만큼만 계산**”하게 만드는 것.

1. `take(2)`가 _소비자(consumer)_가 되어 “2개가 모이면 즉시 반환”한다.
2. `map/filter`는 _생산자(producer)_로서 “요청받을 때만 값 1개를 계산”한다.
3. 이 둘을 이터레이터 체인으로 연결하면, 조건을 만족하는 2개를 찾는 순간 전체가 멈춘다.

---


## 구현(코드)


### 1) `curry`, `go`, `take` 만들기


```javascript
const curry = (f) => (a, ...rest) =>
  rest.length ? f(a, ...rest) : (...rest2) => f(a, ...rest2);

const go = (...args) => args.reduce((acc, f) => f(acc));

const take = curry((count, iter) => {
  const res = [];
  for (const item of iter) {
    res.push(item);
    if (res.length === count) return res;
  }
  return res;
});
```


기대 결과: `take(2)`는 2개를 모으는 순간 순회를 멈추며, 이후 단계는 더 계산되지 않는다.


---


### 2) eager(즉시) `map/filter` (비교용)


배열 기반으로 중간 결과를 계속 생성하는 방식이다.


```javascript
const map = curry((func, iter) => {
  const ret = [];
  for (const item of iter) ret.push(func(item));
  return ret;
});

const filter = curry((pred, iter) => {
  const ret = [];
  for (const item of iter) if (pred(item)) ret.push(item);
  return ret;
});
```


기대 결과: 파이프라인을 구성하기 쉽지만, 데이터가 많을수록 중간 배열 생성 비용이 커진다.


---


### 3) 데이터 생성도 이터레이터로: `rangeL`, `genMember`


성능 이야기를 할 때 자주 놓치는 포인트가 있다.

- `members = map(genMember, range(...))`처럼 **배열을 먼저 만들면**, 이후 단계가 lazy여도 “데이터 생성 비용”은 이미 선불로 다 낸다.

그래서 `range`부터 지연 평가로 만든다.


```javascript
const rangeL = function* (limit) {
  let i = 0;
  while (i < limit) yield i++;
};

const genMember = () => ({
  family: Math.ceil(Math.random() * 8),
  point: Math.ceil(Math.random() * 8000),
});
```


기대 결과: `rangeL`는 값을 요청받을 때마다 하나씩 만들어 내며, 메모리에 큰 배열을 쌓지 않는다.


---


### 4) LazyMap / LazyFilter 구현


이제 `map/filter`를 generator로 만든다.


```javascript
const L = {};

L.map = curry(function* (func, iter) {
  for (const item of iter) yield func(item);
});

L.filter = curry(function* (pred, iter) {
  for (const item of iter) if (pred(item)) yield item;
});
```


기대 결과: 아직 아무것도 계산되지 않는다. `take` 같은 소비자가 값을 요구할 때만 `yield`로 흘러간다.


---


### 5) 요구사항 파이프라인: 2개 나오면 바로 종료


```javascript
const calcPointList = go(
  rangeL(1_000_000),

  // 1) 멤버 생성도 lazy로 흘린다
  L.map(() => genMember()),

  // 2) calPoint 계산
  L.map(({ family, point }) => {
    const calPoint = family * point;
    return { family, point, calPoint };
  }),

  // 3) calPoint >= 1000
  L.filter(({ calPoint }) => calPoint >= 1000),

  // 4) floor(sqrt(calPoint)) 추출
  L.map(({ calPoint }) => Math.floor(Math.sqrt(calPoint))),

  // 5) 홀수만
  L.filter((sqrtPoint) => (sqrtPoint % 2) === 1),

  // 6) 2개만
  take(2)
);

console.log(calcPointList);
```


기대 결과: 조건을 만족하는 값 2개를 찾는 순간, 그 뒤 데이터는 더 만들지도/계산하지도 않는다.


---


## 검증 방법

- [ ] `take(2)`에서 실제로 연산이 멈추는가? (로그를 넣어 호출 횟수를 확인)
- [ ] 중간에 `members`처럼 대규모 배열을 만들지 않는가?
- [ ] `rangeL`부터 데이터 생성까지 이터레이터 체인으로 이어져 있는가?
- [ ] 값이 싼 조건부터 먼저 걸러 계산량을 줄일 수 있는가? (필터 순서 점검)

---


## 흔한 실수/FAQ


### Q1. lazy로 바꿨는데도 왜 느리지?


대개 “데이터를 이미 배열로 만들어버린 경우”다.


`members = map(genMember, range(...))`처럼 큰 배열을 먼저 만들면, lazy는 후반 단계에만 적용된다. 데이터 생성부터 소비까지 이터레이터로 이어야 조기 종료 효과가 확실하다.


### Q2. generator는 여러 번 순회할 수 있나?


대부분의 generator iterator는 **한 번 소비하면 끝**이다. 같은 흐름을 다시 돌리려면 “이터레이터를 반환하는 함수” 형태로 매번 새로 만들어야 한다.

- 참고: [MDN: Iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators)

### Q3. “마지막 2개”가 필요하면 어떻게 하지?


“마지막”은 의미상 끝까지 봐야 할 가능성이 크다. 이 경우 `take(2)`처럼 조기 종료가 아니라, 고정 크기 버퍼로 마지막 N개만 유지하는 방식이 안전하다.


```javascript
const takeLast = curry((count, iter) => {
  const buf = [];
  for (const item of iter) {
    buf.push(item);
    if (buf.length > count) buf.shift();
  }
  return buf;
});
```


기대 결과: 전체를 순회하되, 메모리는 항상 `count`개만 유지한다.


---


## Next.js에서의 주의사항

- 이 로직은 **순수 자바스크립트 연산**이라 서버/클라이언트 어디서든 실행 가능하지만, “어디에서 돌리느냐”에 따라 성능/부하 지점이 달라진다.
- 클라이언트에서 큰 반복 연산을 돌리면 UI가 버벅일 수 있다. 필요하면 서버에서 계산하거나, 클라이언트에서는 작업 분할/워커 같은 전략을 고려한다.
- 참고: [Next.js Docs: Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-and-client-components)

---


## 결론


`take(2)`처럼 “조금만 필요”한 요구라면, 정답은 단순하다.

- **생산자는 lazy(이터레이터)로**
- **소비자는 take로**
- **2개가 모이면 즉시 종료**

이 구조를 갖추면 “전체를 다 만들고 다 걸러서 마지막에 조금만 쓰는” 낭비를 줄일 수 있다.


---


## 참고(공식 문서 링크)

- [MDN: function* (generator function)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/function*)
- [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- [MDN: for…of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
- [MDN: Iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators)
- [Next.js Docs: Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-and-client-components)
