---
title: "필요한 연산만 더 빠르게: WebAssembly를 “브라우저 성능 옵션”으로 붙이기"
description: "자바스크립트로는 부담스러운 “순수 계산(컴퓨팅)” 구간을 WebAssembly로 분리하면, UI를 유지하면서도 연산 병목을 줄일 수 있다"
date: "2026-01-11"
tags: ["javascript", "프론트엔드"]
notionPageId: "301c01ed-7f98-801d-b234-db9c5c413361"
source: "notion"
---
# 필요한 연산만 더 빠르게: WebAssembly를 “브라우저 성능 옵션”으로 붙이기


한 문장 결론: **자바스크립트로는 부담스러운 “순수 계산(컴퓨팅)” 구간을 WebAssembly로 분리하면, UI를 유지하면서도 연산 병목을 줄일 수 있다.** ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly?utm_source=chatgpt.com))


웹 앱이 느려지는 순간은 생각보다 단순합니다. 네트워크가 아니라 **계산** 때문에 메인 스레드가 막히는 경우가 꽤 많습니다.


포인트는 “모든 걸 WebAssembly로 바꾸자”가 아니라, **비싼 연산만 선택적으로 격리**하는 겁니다. 그러면 UX(클릭/스크롤 반응), 유지보수(경계가 명확한 모듈), 안정성(정확한 정수 연산)까지 같이 챙길 수 있습니다. ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly?utm_source=chatgpt.com))


---


## 배경/문제


다음 조건이 겹치면 브라우저에서 체감 성능이 급격히 떨어집니다.

- 반복문/수치 계산이 길어져 **메인 스레드가 점유**된다.
- 큰 정수(64-bit 정수급)를 다루는데, 자바스크립트 `number` 정밀도 한계 때문에 **값이 깨진다**. ([assemblyscript.org](https://www.assemblyscript.org/compiler.html))
- 브라우저/엔진(V8, JSC 등) 차이로 같은 코드라도 실행 특성이 달라진다. ([tchayen.com](https://tchayen.com/notes-from-benchmarking-wasm-and-optimized-js?utm_source=chatgpt.com))

이 글에서는 **Next.js에서 재현 가능한 형태로**, AssemblyScript(타입스크립트 문법 기반)로 간단한 WebAssembly 모듈을 만들고, **정확도(BigInt) + 측정(performance.now)**까지 한 번에 정리합니다. ([assemblyscript.org](https://www.assemblyscript.org/getting-started.html))


---


## 핵심 개념


WebAssembly는 “브라우저에서 실행 가능한 바이너리 포맷”이고, 자바스크립트와 함께 동작합니다. 즉, **UI/이벤트/DOM은 JS(React)가 맡고**, **무거운 계산만 Wasm**에 맡기는 그림이 기본입니다. ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly?utm_source=chatgpt.com))


```mermaid
flowchart LR
  A["AssemblyScript<br/>코드 작성"] -->|"컴파일"| B[".wasm 생성<br/>(build/)"]
  B -->|"정적 파일로 배포"| C["Next.js public/<br/>wasm 파일 제공"]
  C -->|"fetch + instantiate<br/>(Client Component)"| D["Wasm exports 호출"]
  D -->|"결과 표시"| E["React UI 업데이트"]
```


→ 기대 결과/무엇이 달라졌는지: “연산”이 UI 코드에서 분리됩니다. React는 화면만 책임지고, 계산은 Wasm 모듈 경계 안으로 들어갑니다.


### 왜 `BigInt`가 중요할까?


자바스크립트 `number`는 큰 정수에서 **안전하게 표현 가능한 범위가 제한**됩니다. 64-bit 정수를 정확히 다루려면 `BigInt`로 넘겨야 합니다. ([assemblyscript.org](https://www.assemblyscript.org/compiler.html))


또한 Wasm 함수 시그니처가 `i64/u64`를 쓰면, JS 쪽에서 `BigInt`로 전달/수신하는 방식이 자연스럽습니다. ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Exported_functions?utm_source=chatgpt.com))


---


## 해결 접근


이번 접근은 “최소 구성”을 목표로 합니다.

1. **AssemblyScript로 Wasm 모듈 생성**
    - 왜: 타입(예: i32/i64)을 명확히 두고 계산을 모듈로 분리
    - 기대 결과: 빌드 산출물로 `.wasm`가 생김 ([assemblyscript.org](https://www.assemblyscript.org/getting-started.html))
2. **Next.js** **`public/`****에** **`.wasm`** **배치**
    - 왜: 가장 단순하게 브라우저에서 `fetch()`로 가져오기
    - 기대 결과: `/wasm/xxx.wasm` 경로로 접근 가능 ([nextjs.org](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder?utm_source=chatgpt.com))
3. **Client Component에서 로드/실행/측정**
    - 왜: WebAssembly 로딩/실행은 브라우저 API이므로 클라이언트에서 수행
    - 기대 결과: UI 이벤트로 Wasm 함수를 호출하고 결과를 화면에 표시 ([nextjs.org](https://nextjs.org/docs/app/getting-started/server-and-client-components?utm_source=chatgpt.com))

### 대안/비교 (최소 2개)

- **대안 A: 순수 JS로 최적화 + Worker로 격리**
    - 장점: 빌드 파이프라인 단순, 디버깅 쉬움
    - 단점: 큰 정수 정확도, 특정 계산 패턴에서 한계
- **대안 B: Rust/C++로 Wasm 작성**
    - 장점: 성능/생태계(라이브러리) 선택 폭
    - 단점: 언어/툴체인 진입 비용
    - 참고로 AssemblyScript는 “맛보기/프로토타이핑”에 강점이 있지만, 선택은 팀의 운영 비용과 목표에 따라 달라집니다. ([assemblyscript.org](https://www.assemblyscript.org/getting-started.html))

---


## 구현(코드)


### 1) AssemblyScript 프로젝트 생성


```bash
mkdir wasm-demo && cd wasm-demo
npm init -y
npm install --save-dev assemblyscript
npx asinit .
npm run asbuild
```


→ 기대 결과/무엇이 달라졌는지: `assembly/`에 엔트리 코드가 생기고, `build/`에 컴파일된 `.wasm` 산출물이 생성됩니다. ([assemblyscript.org](https://www.assemblyscript.org/getting-started.html))


### 2) Wasm에 노출할 함수 작성 (`assembly/index.ts`)


아래 예시는 “정확한 큰 정수 합”을 목표로 `i64` 기반으로 작성합니다.


```typescript
// assembly/index.ts

export function add(a: i32, b: i32): i32 {
  return a + b;
}

// 0..n 합 (정확한 정수)
export function sumTo(n: i64): i64 {
  let sum: i64 = 0;
  for (let i: i64 = 0; i <= n; i++) {
    sum += i;
  }
  return sum;
}
```


→ 기대 결과/무엇이 달라졌는지: JS에서 호출 가능한 `exports.add`, `exports.sumTo`가 생깁니다. 특히 `sumTo`는 64-bit 정수로 결과를 반환합니다. ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Exported_functions?utm_source=chatgpt.com))


다시 빌드합니다.


```bash
npm run asbuild
```


→ 기대 결과/무엇이 달라졌는지: 변경된 로직이 `.wasm`에 반영됩니다.


### 3) Next.js에 `.wasm` 배치


Next.js 앱 루트에 `public/wasm/` 폴더를 만들고, `build/` 산출물 중 사용할 `.wasm` 파일을 복사합니다.


예시:


```bash
mkdir -p public/wasm
cp build/*.wasm public/wasm/
```


→ 기대 결과/무엇이 달라졌는지: 브라우저에서 `/wasm/<파일명>.wasm` 경로로 `.wasm`을 로드할 수 있습니다. ([nextjs.org](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder?utm_source=chatgpt.com))


### 4) Client Component에서 Wasm 로드 + 벤치마크


`app/wasm-bench/page.tsx` 예시입니다.


```typescript
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type WasmExports = {
  add(a: number, b: number): number;
  sumTo(n: bigint): bigint; // i64 <-> BigInt
};

async function loadWasm(url: string): Promise<WasmExports> {
  // 가능한 경우 streaming이 효율적입니다.
  // (서버가 올바른 MIME(application/wasm)을 내려주는 환경에서 특히 유리)
  if (WebAssembly.instantiateStreaming) {
    try {
      const res = await fetch(url);
      const { instance } = await WebAssembly.instantiateStreaming(res);
      return instance.exports as unknown as WasmExports;
    } catch {
      // MIME/CSP 등 환경 이슈가 있으면 arrayBuffer fallback
    }
  }

  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(buf);
  return instance.exports as unknown as WasmExports;
}

function bench(label: string, fn: () => void) {
  const t0 = performance.now();
  fn();
  const t1 = performance.now();
  return { label, ms: t1 - t0 };
}

export default function Page() {
  const wasmUrl = useMemo(() => "/wasm/optimized.wasm", []);
  const [wasm, setWasm] = useState<WasmExports | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    loadWasm(wasmUrl).then((m) => {
      if (alive) setWasm(m);
    });
    return () => {
      alive = false;
    };
  }, [wasmUrl]);

  const run = useCallback(() => {
    if (!wasm) return;

    // ⚠️ 너무 큰 n은 메인 스레드를 오래 점유합니다.
    // 여기서는 재현 가능한 수준의 값으로 시작하고, 필요하면 점진적으로 올리세요.
    const n = 200_000_000n;

    const jsNumber = () => {
      // number 기반(정확도 한계가 있을 수 있음)
      let sum = 0;
      for (let i = 0; i <= Number(n); i++) sum += i;
      // 결과는 출력만 해서 최적화로 날아가지 않게 함
      void sum;
    };

    const jsBigInt = () => {
      let sum = 0n;
      for (let i = 0n; i <= n; i++) sum += i;
      void sum;
    };

    const wasmBigInt = () => {
      const sum = wasm.sumTo(n);
      void sum;
    };

    const r1 = bench("js(number)", jsNumber);
    const r2 = bench("js(BigInt)", jsBigInt);
    const r3 = bench("wasm(i64/BigInt)", wasmBigInt);

    setLogs((prev) => [
      ...prev,
      `${r1.label}: ${r1.ms.toFixed(1)}ms`,
      `${r2.label}: ${r2.ms.toFixed(1)}ms`,
      `${r3.label}: ${r3.ms.toFixed(1)}ms`,
      "---",
    ]);
  }, [wasm]);

  return (
    <main style={{ padding: 16 }}>
      <h1>Wasm Benchmark</h1>
      <p>
        Wasm 로딩 후 버튼을 눌러 측정합니다. 측정은{" "}
        <code>performance.now()</code> 기반입니다.
      </p>

      <button onClick={run} disabled={!wasm}>
        {wasm ? "Run" : "Loading wasm..."}
      </button>

      <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
        {logs.join("\n")}
      </pre>
    </main>
  );
}
```


→ 기대 결과/무엇이 달라졌는지: Next.js 페이지에서 `.wasm`을 로드하고, **JS(number) / JS(BigInt) / Wasm(i64↔︎BigInt)** 세 가지를 같은 조건으로 측정해 비교할 수 있습니다. ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now?utm_source=chatgpt.com))


---


## 검증 방법(체크리스트)

- [ ] `.wasm`이 **Next.js** **`public/`** **아래**에 있고, 브라우저에서 `/wasm/...`로 직접 열렸을 때 다운로드(혹은 바이너리 응답)가 된다. ([nextjs.org](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder?utm_source=chatgpt.com))
- [ ] Wasm 로드는 **Client Component**에서 수행된다. (`"use client"`, `useEffect`) ([nextjs.org](https://nextjs.org/docs/app/getting-started/server-and-client-components?utm_source=chatgpt.com))
- [ ] 측정은 `Date`가 아니라 `performance.now()` 기반이다. ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now?utm_source=chatgpt.com))
- [ ] 64-bit 정수 결과가 필요하면 `i64/u64` ↔︎ `BigInt`로 전달/수신한다. ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Exported_functions?utm_source=chatgpt.com))
- [ ] `instantiateStreaming`이 실패할 때를 대비해 `arrayBuffer` fallback이 있다. ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/instantiateStreaming_static?utm_source=chatgpt.com))

---


## 흔한 실수/FAQ


### Q1. 값이 “줄어든 숫자”로 나온다


자바스크립트 `number`로 큰 정수를 누적하면 정밀도 한계로 결과가 깨질 수 있습니다. 64-bit 정수 정확도가 필요하면 `BigInt`를 사용하고, Wasm 쪽도 `i64/u64`로 설계합니다. ([assemblyscript.org](https://www.assemblyscript.org/compiler.html))


### Q2. `instantiateStreaming`이 에러 난다


환경에 따라 `.wasm` MIME이 기대와 다르거나, CSP 정책 때문에 컴파일/실행이 막힐 수 있습니다. 이때는 `fetch → arrayBuffer → instantiate`로 fallback을 두고, 배포 환경의 보안 정책도 함께 점검합니다. ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/instantiateStreaming_static?utm_source=chatgpt.com))


### Q3. “Wasm이 항상 더 빠른가?”


항상은 아닙니다. 연산 패턴, 엔진 최적화, 호출 오버헤드, 워밍업(JIT) 등에 따라 결과가 달라질 수 있습니다. 그래서 작은 단일 실행보다 **재현 가능한 측정 하네스**를 먼저 만들고, 실제 워크플로우에서 병목을 확인하는 쪽이 안전합니다. ([tchayen.com](https://tchayen.com/notes-from-benchmarking-wasm-and-optimized-js?utm_source=chatgpt.com))


### Q4. 버튼 누르면 화면이 멈춘다


반복문이 길면 메인 스레드가 막히는 게 정상입니다. 이 경우 “Wasm을 쓰느냐”와 별개로 **Worker로 격리**하는 게 UX에 더 큰 영향을 줄 수 있습니다(계산이 UI 스레드에서 빠짐). ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Performance?utm_source=chatgpt.com))


---


## 요약(3~5줄)

- WebAssembly는 브라우저에서 실행되는 바이너리 포맷으로, JS와 함께 동작합니다. ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly?utm_source=chatgpt.com))
- Next.js에서는 `.wasm`을 `public/`에 두고 Client Component에서 `fetch + instantiate`로 로드하는 구성이 단순합니다. ([nextjs.org](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder?utm_source=chatgpt.com))
- 큰 정수 정확도가 필요하면 `i64/u64` ↔︎ `BigInt` 경계를 명확히 잡아야 합니다. ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Exported_functions?utm_source=chatgpt.com))
- 측정은 `performance.now()`로 하고, `instantiateStreaming` + fallback을 기본으로 두면 환경 적응력이 좋아집니다. ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now?utm_source=chatgpt.com))

---


## 결론


WebAssembly는 “JS를 대체하는 기술”이라기보다, **계산 병목을 옵션으로 분리하는 도구**에 가깝습니다.


Next.js에서는 정적 자산으로 `.wasm`을 제공하고, Client Component에서 로드해 호출하는 것만으로도 “연산 모듈 경계”를 만들 수 있습니다. 그리고 그 경계 위에 **정확도(BigInt)와 측정(performance.now)**를 같이 올려두면, 브라우저에서 성능/정확도 이슈를 다루는 방식이 훨씬 선명해집니다. ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly?utm_source=chatgpt.com))


---


## 참고(공식 문서 링크)

- [Next.js Docs — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) ([nextjs.org](https://nextjs.org/docs/app/getting-started/server-and-client-components?utm_source=chatgpt.com))
- [Next.js Docs — ](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)[`public`](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)[ folder](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder) ([nextjs.org](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder?utm_source=chatgpt.com))
- [AssemblyScript Book — Getting started](https://www.assemblyscript.org/getting-started.html) ([assemblyscript.org](https://www.assemblyscript.org/getting-started.html))
- [AssemblyScript Book — Types](https://www.assemblyscript.org/types.html) ([assemblyscript.org](https://www.assemblyscript.org/types.html?utm_source=chatgpt.com))
- [MDN — WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly) ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly?utm_source=chatgpt.com))
- [MDN — WebAssembly.instantiateStreaming](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/instantiateStreaming_static) ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/instantiateStreaming_static?utm_source=chatgpt.com))
- [MDN — Exported WebAssembly functions (i64/BigInt)](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Exported_functions) ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Exported_functions?utm_source=chatgpt.com))
- [MDN — performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now?utm_source=chatgpt.com))
- [MDN — High precision timing](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/High_precision_timing) ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/High_precision_timing?utm_source=chatgpt.com))
