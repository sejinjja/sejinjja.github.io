---
title: "함수형 파이프라인 구성하기"
description: "map, filter, reduce는 “반복 가능한 값(Iterable)”을 받아 새 배열을 만들거나(map/filter) 하나의 값으로 축약(reduce)하는 기본 도구다."
date: "2026-01-14"
tags: ["javascript"]
notionPageId: "2f9c01ed-7f98-8025-8215-c4c04d4036cf"
source: "notion"
---
# go로 읽는 순서대로 파이프라인 구성하기


### 요약

- `map`, `filter`, `reduce`는 “반복 가능한 값(Iterable)”을 받아 **새 배열을 만들거나**(map/filter) **하나의 값으로 축약**(reduce)하는 기본 도구다. ([MDN: Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [MDN: Array.prototype.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [MDN: Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce))
- `for...of`는 이터러블을 순회하므로, 배열뿐 아니라 `Set`, 제너레이터 같은 값도 같은 방식으로 다룰 수 있다. ([MDN: for…of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of))
- 중첩 호출이 읽기 어려워지면 `go`로 “위에서 아래로” 처리 순서를 드러낼 수 있다.
- `curry`를 더하면 `filter(fn)`, `map(fn)`, `reduce(fn)`처럼 **파이프라인 단계(함수)**를 만들 수 있다.

**한 문장 결론:** `go + curry` 조합은 “데이터 → 변환 → 결과” 흐름을 코드에서 그대로 읽히게 만든다.


---


### 배경/문제


`filter → map → reduce`를 한 번에 쓰면, 코드가 아래처럼 “안쪽에서 바깥쪽”으로 감기기 쉽다.


```javascript
reduce(
  map(
    filter([1, 2, 3], (a) => a % 2),
    (a) => a * a
  ),
  (a, b) => a + b
);
```


기대 결과: 동작은 맞지만, 처리 순서(필터 → 제곱 → 합)가 코드 읽는 순서와 반대로 보여서 흐름 파악이 느려진다.


---


### 핵심 개념


### 1) 이터러블(Iterable)과 for…of


`for...of`는 **반복 가능한 값(이터러블)**에서 값을 하나씩 꺼내 순회한다. 이터러블이 되려면 `[Symbol.iterator]`를 제공해야 한다. ([MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols), [MDN: Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator))


```javascript
const iter = [1, 2, 3][Symbol.iterator]();

console.log(iter.next()); // { value: 1, done: false }
console.log(iter.next()); // { value: 2, done: false }
console.log(iter.next()); // { value: 3, done: false }
console.log(iter.next()); // { value: undefined, done: true }
```


기대 결과: “반복”이 실제로는 `next()`로 값을 뽑는 과정이라는 감이 잡힌다.


---


### 해결 접근

1. `map`, `filter`, `reduce`를 `for...of` 기반으로 직접 구현한다.
2. 중첩 호출을 `go`로 펴서, 코드가 처리 순서를 그대로 보여주게 만든다.
3. `curry`로 `map(fn)`, `filter(fn)` 같은 “단계 함수”를 만들어 `go`에 꽂는다.

---


### 구현(코드)


### 1) map / filter


```javascript
export const map = (iter, fn) => {
  const out = [];
  for (const item of iter) out.push(fn(item));
  return out;
};

export const filter = (iter, pred) => {
  const out = [];
  for (const item of iter) if (pred(item)) out.push(item);
  return out;
};
```


기대 결과: 배열뿐 아니라 `Set`, 제너레이터 등 이터러블이면 동일하게 동작한다.


---


### 2) reduce (초기값 없을 때 처리 + 안전장치)


`reduce`는 “누적값(accumulator)”을 계속 갱신해 하나의 값으로 만든다. ([MDN: Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce))


```javascript
export const reduce = (iter, reducer, initial) => {
  const iterator = iter?.[Symbol.iterator]?.();
  if (!iterator) throw new TypeError("iter is not iterable");

  let acc;
  let cur = iterator.next();

  if (arguments.length >= 3) {
    acc = initial;
  } else {
    if (cur.done) throw new TypeError("Reduce of empty iterable with no initial value");
    acc = cur.value;
    cur = iterator.next();
  }

  for (; !cur.done; cur = iterator.next()) {
    acc = reducer(acc, cur.value);
  }

  return acc;
};
```


기대 결과:
- 초기값이 없으면 첫 값을 초기 누적값으로 쓰고,
- 비어 있는 이터러블이면 에러로 빠르게 문제를 드러낸다.


---


### 3) 중첩을 평평하게: go


`go`는 “첫 값 → 함수들”을 받아, 값을 단계별로 흘려보낸다.


```javascript
export const go = (value, ...fns) =>
  reduce(fns, (acc, fn) => fn(acc), value);
```


기대 결과: 함수 적용 순서를 코드가 그대로 보여준다(위에서 아래로 읽힌다).


---


### 4) numbers 같은 중간 변수를 없애기: curry


커링(currying)은 “인자를 다 받은 시점에만 실행”되도록 함수를 변환한다. ([javascript.info: Currying & partials](https://javascript.info/currying-partials))


```javascript
export const curry =
  (fn) =>
  (a, ...rest) =>
    rest.length ? fn(a, ...rest) : (...rest2) => fn(a, ...rest2);
```


기대 결과: `f(a, b)`뿐 아니라 `f(a)(b)` 형태로도 호출할 수 있다.


---


### 5) 커링을 적용한 map/filter/reduce


파이프라인에 넣기 좋게, **함수 인자를 먼저** 받도록 순서를 바꾼다.


```javascript
export const mapC = curry((fn, iter) => {
  const out = [];
  for (const item of iter) out.push(fn(item));
  return out;
});

export const filterC = curry((pred, iter) => {
  const out = [];
  for (const item of iter) if (pred(item)) out.push(item);
  return out;
});

export const reduceC = curry((reducer, iter, initial) => {
  if (arguments.length >= 3) return reduce(iter, reducer, initial);
  return reduce(iter, reducer);
});
```


기대 결과: `mapC(fn)`이 “이터러블을 받는 함수”가 되어서 `go`에 그대로 꽂힌다.


---


### 6) 최종 사용 예: 홀수만 제곱해서 더하기


```javascript
console.log(
  go(
    [1, 2, 3],
    filterC((a) => a % 2),
    mapC((a) => a * a),
    reduceC((a, b) => a + b)
  )
); // 10
```


기대 결과: `filter → map → reduce` 흐름이 코드 읽는 순서와 같아지고, 중간 변수 없이 단계가 연결된다.


---


### 검증 방법(체크리스트)

- [ ] `mapC(fn, iter)`는 원본을 바꾸지 않고 새 배열을 반환한다. ([MDN: Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map))
- [ ] `filterC(pred, iter)`는 조건을 통과한 값만 모은 새 배열을 반환한다. ([MDN: Array.prototype.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter))
- [ ] `reduce(iter, reducer, initial?)`는 초기값 유무에 따라 누적 규칙이 달라진다. ([MDN: Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce))
- [ ] `Set`, 제너레이터 등 이터러블에서도 동일하게 동작한다. ([MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols))
- [ ] 파이프라인을 읽을 때 처리 순서가 “위에서 아래”로 자연스럽다.

---


### 흔한 실수/FAQ


### Q1. 왜 굳이 직접 구현하나? Array.map/filter/reduce 쓰면 되지 않나?


배열만 다룬다면 내장 메서드가 가장 표준이다. ([MDN: Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map))


다만 **배열이 아닌 이터러블까지 한 방식으로** 다루고 싶거나, `go`처럼 **단계 합성**을 자연스럽게 만들고 싶다면 이런 형태가 편해진다.


### Q2. for…of로 만든 map/filter는 내장 map/filter와 완전히 같은가?


상황에 따라 다를 수 있다. 예를 들어 “배열의 빈 슬롯(희소 배열)” 처리 방식은 내장 메서드와 차이가 날 수 있다. ([MDN: Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map))


포인트는 “이터러블 기반 구현”은 **값이 실제로 순회되는 방식**을 그대로 따른다는 점이다. ([MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols))


### Q3. Next.js에서는 어디에 두고, 어디서 써야 하나?


이 유틸은 브라우저 전용 API(`window`, `document`)를 쓰지 않아서 **서버/클라이언트 어디서든** 호출 자체는 가능하다.


Next.js에서는 “서버 컴포넌트 / 클라이언트 컴포넌트” 경계를 의식해서 모듈을 배치하면 안전하다. ([Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components))


```javascript
// 예: src/lib/fp.js
export { go, curry, mapC, filterC, reduceC };
```


기대 결과: 계산 로직이 UI와 분리되어, 서버/클라이언트 구성에 맞춰 재사용하기 쉬워진다.


---


### 결론

- `map/filter/reduce`는 작은 조합만으로도 꽤 많은 데이터 변환을 표현할 수 있다. ([MDN: Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map))
- 여기에 `go`를 더하면 “중첩”을 “나열”로 바꿔서, 코드가 처리 흐름을 그대로 드러낸다.
- `curry`는 파이프라인 단계를 만들 때 특히 유용하다(`map(fn)`, `filter(pred)` 같은 형태).

---


### 참고(링크)

- [MDN: Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [MDN: Array.prototype.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [MDN: Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- [MDN: Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)
- [MDN: for…of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js: use client directive](https://nextjs.org/docs/app/api-reference/directives/use-client)
- [javascript.info: Currying & partials](https://javascript.info/currying-partials)
