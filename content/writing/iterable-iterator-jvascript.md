---
title: "iterable/iterator 프로토콜 이해하기"
description: "for...of는 “값을 나열할 수 있는 규약(Iteration protocols)”을 가진 대상만 순회한다."
date: "2025-11-25"
tags: ["javascript"]
notionPageId: "2f9c01ed-7f98-80cd-9a96-cc66a6632d6d"
source: "notion"
---
# `for...of`는 왜 Object에서 동작하지 않을까? — iterable/iterator 프로토콜로 이해하기


## 요약

- `for...of`는 “값을 나열할 수 있는 규약(Iteration protocols)”을 가진 대상만 순회한다. ([MDN: for…of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of))
- `Array`, `Set`, `Map`, `String`은 기본적으로 iterable이지만, 일반 Object는 기본 iterable이 아니다.
- Object를 순회할 때는 보통 `Object.entries()/values()/keys()`로 변환해서 순회하고, 정말 필요할 때만 `Symbol.iterator`를 직접 구현한다. ([MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols))

---


## 배경/문제


`for...of`는 “배열을 도는 문법”처럼 보이지만, 실제 기준은 더 단순하다.


**반복할 수 있느냐(iterable)** 가 전부다.


```javascript
const arr = [1, 2, 3, 4];
for (const value of arr) console.log(value);

const set = new Set([1, 2, 3, 4]);
for (const value of set) console.log(value);

const obj = { 0: 1, 1: 2, 2: 3, 3: 4 };
for (const value of obj) console.log(value); // TypeError: obj is not iterable
```


기대 결과 / 무엇이 달라졌는지
- `arr`, `set`은 순회된다.
- `obj`는 `is not iterable` 오류가 난다(환경에 따라 메시지는 조금 다를 수 있다).


---


## 핵심 개념


### 1) iterable이란?


**`Symbol.iterator`****를 통해 iterator를 꺼낼 수 있는 대상**을 말한다.


이게 있으면 `for...of`, `...spread`, `Array.from()` 같은 곳에서 “반복 가능한 값”으로 취급된다. ([MDN: Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator))


간단히 말하면:
- **iterable protocol**: `obj[Symbol.iterator]()`가 **iterator**를 반환
- **iterator protocol**: iterator는 `next()`가 있고, `{ value, done }`을 반환


([MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols))


---


### 2) iterator 결과 `{ value, done }`는 무엇인가?


`next()`는 매번 “다음 값”을 내주거나, 더 없으면 종료를 알린다.

- `value`: 이번에 꺼낸 값
- `done`: 순회 종료 여부 (`true`면 끝)

이 규약이 있기 때문에 `for...of`는 내부적으로 이렇게 동작한다고 보면 된다.


```javascript
const it = [1, 2][Symbol.iterator]();
console.log(it.next()); // { value: 1, done: false }
console.log(it.next()); // { value: 2, done: false }
console.log(it.next()); // { value: undefined, done: true }
```


기대 결과 / 무엇이 달라졌는지
- “반복”이 사실상 `next()` 호출의 연속이라는 감각이 잡힌다.


---


### 3) 그럼 왜 Object는 기본 iterable이 아닐까?


핵심은 “Object는 순회 규칙이 애매해지기 쉬운 타입”이라는 점이다.

- **키를 돌까, 값을 돌까, [키, 값]을 돌까?**
- **속성 순서 규칙은 어떤 기준으로 보장할까?**
- 프로토타입 체인/열거 가능성(enumerable) 같은 속성도 얽힌다.

그래서 자바스크립트는 Object를 기본 iterable로 취급하지 않고, 대신 `Object.keys/values/entries` 같은 **명시적인 변환 API**를 제공한다.


Object 순회 방식이 코드에 드러나면, 읽는 입장에서 덜 헷갈린다. ([MDN: Object.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries))


---


## 해결 접근


Object를 순회해야 한다면 보통 아래 순서로 고르면 된다.

1. **[키, 값]이 필요** → `Object.entries(obj)`
2. **값만 필요** → `Object.values(obj)`
3. **키만 필요** → `Object.keys(obj)`
4. **정말로** **`for...of obj`** **형태가 필요** → `Symbol.iterator` 직접 구현

---


## 구현(코드)


### 1) `Object.entries()`로 `[key, value]` 순회


```javascript
const obj = { 0: 1, 1: 2, 2: 3, 3: 4 };

for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
```


기대 결과 / 무엇이 달라졌는지
- Object를 “순회 가능한 배열 형태”로 바꿔서 `for...of`에 넣는다.
- `key`는 문자열로 나온다(예: `"0"`). ([MDN: Object.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries))


---


### 2) 값만 필요하면 `Object.values()`


```javascript
const obj = { 0: 1, 1: 2, 2: 3, 3: 4 };

for (const value of Object.values(obj)) {
  console.log(value);
}
```


기대 결과 / 무엇이 달라졌는지
- 값만 순회하니 목적이 더 분명해진다. ([MDN: Object.values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values))


---


### 3) `Map`은 기본적으로 iterable이고, 무엇이 나오나?


`Map`은 `for...of`에서 기본적으로 **[key, value] 쌍**을 뽑는다.


```javascript
const map = new Map([
  ["a", 1],
  ["b", 2],
]);

for (const [k, v] of map) {
  console.log(k, v);
}
```


기대 결과 / 무엇이 달라졌는지
- `Map`이 “키/값 쌍을 순서대로 나열할 수 있는 구조”라는 점이 드러난다. ([MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map))


---


### 4) “iterable인지” 빠르게 확인하는 방법


```javascript
function isIterable(value) {
  return value != null && typeof value[Symbol.iterator] === "function";
}

console.log(isIterable([1, 2, 3]));           // true
console.log(isIterable(new Set([1, 2, 3])));  // true
console.log(isIterable({ a: 1 }));            // false
```


기대 결과 / 무엇이 달라졌는지
- 런타임에서 “for…of 가능한 대상인지”를 안전하게 가드할 수 있다. ([MDN: Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator))


---


### 5) Object를 iterable로 “직접” 만들기 (`Symbol.iterator`)


정말로 `for...of obj` 형태가 필요할 때는 `Symbol.iterator`를 구현할 수 있다.


다만 “무엇을 어떤 순서로 순회할지”를 **직접 결정해야 한다**.


아래는 숫자 키를 가진 “array-like” 객체를 값 순회하도록 만든 예시다. (규칙을 명확히 하려고 `length`를 둔다.)


```javascript
const obj = { 0: 1, 1: 2, 2: 3, 3: 4, length: 4 };

obj[Symbol.iterator] = function* () {
  for (let i = 0; i < this.length; i++) {
    yield this[i];
  }
};

for (const value of obj) {
  console.log(value);
}
```


기대 결과 / 무엇이 달라졌는지
- `obj`가 iterable이 되어 `for...of obj`가 동작한다.
- 순회 규칙(0부터 length-1까지, 값은 `this[i]`)이 코드로 고정된다. ([MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols))


---


## 검증 방법(체크리스트)

- [ ] `for...of` 대상이 iterable인지 `isIterable()`로 확인했는가?
- [ ] Object 순회는 `entries/values/keys` 중 목적에 맞는 것을 선택했는가?
- [ ] `Symbol.iterator`를 구현했다면 “순회 규칙(순서/종료 조건/반환 값)”이 명확한가?
- [ ] `for...in`을 사용하는 경우 프로토타입 체인 속성이 섞이지 않도록 가드했는가? ([MDN: for…in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in))

---


## 흔한 실수/FAQ


### Q1. spread(`...`)도 iterable 규약을 따르나?


상황에 따라 다르다.

- `const a = [...set]`, `fn(...arr)` 같은 **배열/함수 호출에서의 spread**는 iterable을 요구한다. ([MDN: Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax))
- `{...obj}` 같은 **객체 spread**는 iterator를 쓰는 게 아니라, **own enumerable properties를 복사**하는 동작이다. Object가 iterable이 아니어도 `{...obj}`는 동작할 수 있다. ([MDN: Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax))

기대 결과 / 무엇이 달라졌는지
- “spread는 전부 iterable 기반”이라는 오해를 피할 수 있다.


---


### Q2. Object에 `Symbol.iterator`를 붙이면 깔끔하지 않나?


짧은 코드에서는 깔끔해 보일 수 있다. 하지만 주의할 점이 있다.

- Object 순회 규칙을 팀/프로젝트에서 통일하지 않으면, 코드 해석 비용이 올라간다.
- 같은 Object라도 “키/값/쌍” 중 무엇을 순회하는지 코드만 봐서는 감이 흐려질 수 있다.

대부분은 `Object.entries()`처럼 변환을 통해 의도를 드러내는 편이 안전하다. ([MDN: Object.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries))


---


### Q3. `for...in`은 쓰면 안 되나?


목적에 따라 쓸 수 있다. 다만 `for...in`은 **키 열거**이고, 프로토타입 체인 속성이 섞일 수 있다. 그래서 보통은 own property만 통과시키는 가드를 둔다.


```javascript
for (const key in obj) {
  if (!Object.hasOwn(obj, key)) continue;
  // ...
}
```


([MDN: Object.hasOwn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn))


---


## 결론


`for...of`는 iterable만 순회한다. 그래서 `Array`, `Set`, `Map`은 되지만 일반 Object는 안 된다.


Object 순회는 `Object.entries/values/keys`로 변환해 의도를 드러내는 방식이 기본이고, `for...of obj` 형태가 꼭 필요할 때만 `Symbol.iterator`를 구현해 순회 규칙을 직접 정의한다.


---


## 참고

- [`for...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)[ 문](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
- [Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- [`Symbol.iterator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)
- [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
- [`Object.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values)
- [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
- [`for...in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)[ 문](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)
- [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
