---
title: "여러 파일을 한 번에 다운로드하기"
description: "여러 파일을 한 번에 다운로드하기: 클라이언트에서 ZIP 만들기"
date: "2025-12-11"
tags: ["javascript"]
notionPageId: "2f9c01ed-7f98-807c-90f1-e634c8d2d8e3"
source: "notion"
---
# 여러 파일을 한 번에 다운로드하기: 클라이언트에서 ZIP 만들기 (JSZip + Next.js)


## 요약

- 파일을 각각 다운로드하면 UX가 번거롭고, 브라우저에서 “여러 파일 다운로드” 관련 확인이 뜰 수 있다.
- 클라이언트에서 여러 파일을 **ZIP으로 묶어 1회 다운로드**로 단순화할 수 있다.
- 흐름은 동일하다: **Blob 생성 → Object URL 생성 →** **`<a download>`****로 다운로드 트리거 → URL 해제**. ([MDN: Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob))

---


## 배경/문제


CSV 1개, 이미지 1개처럼 “파일이 몇 개 안 된다”는 상황도 실제로는 귀찮다.

- 파일별 다운로드 버튼/로직이 늘어난다.
- 다운로드가 여러 번 발생하면 브라우저가 추가 확인을 띄우는 흐름이 생길 수 있다.
- 사용자는 다운로드 폴더에서 파일을 다시 찾아야 한다.

해결 방향은 “여러 파일을 ZIP으로 묶어 한 번에 다운로드”다.


---


## 핵심 개념


### Blob (Binary Large Object)


브라우저 메모리에서 “파일처럼 다룰 수 있는 바이너리 덩어리”다. 텍스트/바이너리/이미지 등을 Blob으로 만들 수 있다. ([MDN: Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob))


### Object URL (`URL.createObjectURL`)


`URL.createObjectURL(blob)`는 Blob을 가리키는 임시 URL을 만든다. 이 URL을 `<a href="...">`에 넣고 클릭하면 다운로드를 트리거할 수 있다. 사용이 끝났다면 `URL.revokeObjectURL(url)`로 해제해 브라우저가 메모리를 정리하도록 돕는다. ([MDN: URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static))


### JSZip


JSZip은 브라우저에서 ZIP을 만들 수 있는 라이브러리다. `zip.file()`, `zip.folder()`로 구조를 구성하고, `generateAsync({ type: "blob" })`로 ZIP Blob을 생성한다. ([JSZip](https://stuk.github.io/jszip/))


---


## 해결 접근

1. 파일로 만들 데이터를 준비한다(CSV 문자열, 이미지 등).
2. JSZip에 파일/폴더를 추가한다.
3. ZIP을 Blob으로 생성한다.
4. Object URL을 만든 뒤 `<a download>`로 ZIP을 저장한다.

---


## 구현(코드)

> 브라우저 API(window, document, canvas, URL)를 사용하므로 Next.js에서는 Client Component에서 실행한다. (Next.js: Server/Client Components)

### 0) 설치


```bash
npm i jszip
```


기대 결과
- 프로젝트에서 JSZip을 import해서 ZIP 생성이 가능해진다.


---


### 1) 다운로드 유틸: Blob → `<a download>` 다운로드


```typescript
// app/download-zip/downloadBlob.ts
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  // 일부 환경에서 DOM에 붙어 있어야 안정적으로 동작하는 케이스를 줄이기 위해 append
  document.body.appendChild(a);
  a.click();
  a.remove();

  // 너무 빨리 revoke 하면 다운로드가 끊기는 환경이 있어, 다음 tick에 해제
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
```


기대 결과 / 무엇이 달라졌는지
- 어떤 Blob이든 파일로 저장하는 공통 함수를 갖게 된다.
- Object URL을 해제해 메모리 누수 가능성을 낮춘다. ([MDN: URL.revokeObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static))


---


### 2) ZIP 생성 + 다운로드 (CSV + Canvas 이미지)


```typescript
// app/download-zip/DownloadZipClient.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { downloadBlob } from "./downloadBlob";

const CSV_TEXT =
  "policyID,statecode,county\n" +
  "119736,FL,CLAY COUNTY\n" +
  "448094,FL,CLAY COUNTY\n";

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("canvas.toBlob() failed"))),
      type,
      quality
    );
  });
}

export default function DownloadZipClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 데모용 간단한 그림
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Hello World", canvas.width / 2, canvas.height / 2);
  }, []);

  async function downloadAllAsZip() {
    if (downloading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setDownloading(true);
    try {
      // 필요할 때만 로드(초기 번들 부담을 줄이기 위한 선택)
      const JSZip = (await import("jszip")).default;

      const zip = new JSZip();

      // 1) CSV: 문자열 → Blob
      const csvBlob = new Blob([CSV_TEXT], { type: "text/csv;charset=utf-8" });
      zip.file("test.csv", csvBlob);

      // 2) 이미지: canvas → Blob
      const imageBlob = await canvasToBlob(canvas, "image/jpeg", 0.92);

      const imgFolder = zip.folder("images");
      imgFolder?.file("resized.jpeg", imageBlob);

      // 3) ZIP 생성
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // 4) 다운로드
      downloadBlob(zipBlob, "example.zip");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>ZIP 다운로드 데모</h1>

      <canvas
        ref={canvasRef}
        width={600}
        height={240}
        style={{ border: "1px solid #ccc" }}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={downloadAllAsZip} disabled={downloading}>
          {downloading ? "ZIP 만드는 중..." : "CSV + 이미지 ZIP으로 다운로드"}
        </button>
      </div>
    </div>
  );
}
```


기대 결과 / 무엇이 달라졌는지
- 버튼 1번으로 `example.zip`이 다운로드되고, ZIP 내부에 `test.csv`, `images/resized.jpeg`가 들어간다.
- 이미지는 `toDataURL()`로 base64 문자열을 만들지 않고 `toBlob()`로 바로 Blob을 생성한다. ([MDN: canvas.toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob))
- ZIP은 `generateAsync({ type: "blob" })`로 Blob 형태로 생성된다. ([JSZip: generateAsync](https://stuk.github.io/jszip/documentation/api_jszip/generate_async.html))


---


### 3) 페이지에서 Client Component 사용


```typescript
// app/download-zip/page.tsx
import DownloadZipClient from "./DownloadZipClient";

export default function Page() {
  return <DownloadZipClient />;
}
```


기대 결과
- `/download-zip`에서 ZIP 다운로드가 동작한다.
- 브라우저 API 사용 코드를 Client Component로 분리해 서버 렌더링 오류를 피한다. ([Next.js: use client](https://nextjs.org/docs/app/api-reference/directives/use-client))


---


## 검증 방법(체크리스트)

- [ ] 버튼 클릭 시 `example.zip` 1개만 다운로드되는가?
- [ ] ZIP 내부에 `test.csv`와 `images/resized.jpeg`가 존재하는가?
- [ ] CSV 인코딩(문자 깨짐)이 없는가?
- [ ] 다운로드 후 Object URL을 해제하고 있는가? ([MDN: URL.revokeObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static))
- [ ] 브라우저별 다운로드 UX 차이를 확인했는가? (`a.download`는 동작을 “보장”하지 않는다) ([MDN: a.download](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/download))

---


## 흔한 실수/FAQ


### Q1. `URL.revokeObjectURL()`을 바로 호출했더니 다운로드가 가끔 실패한다.


Object URL은 “사용 후 해제”가 맞지만, 너무 빠르게 해제하면 환경에 따라 다운로드가 끊기는 케이스가 있다. 예제처럼 다음 tick으로 미루는 패턴이 흔하다. ([MDN: URL.revokeObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static))


### Q2. Safari/iOS에서 다운로드 UX가 기대와 다르다.


`a.download` 값은 다운로드 동작을 보장하지 않는다. 플랫폼/브라우저 정책에 따라 저장 흐름이 달라질 수 있으므로, 지원 범위를 정하고 실제 기기에서 확인하는 편이 안전하다. ([MDN: a.download](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/download))


### Q3. 파일이 많거나 크면 브라우저가 버벅인다.


JSZip은 ZIP 생성 과정에서 메모리/CPU 사용량이 늘 수 있다. 필요 시 진행률 UI 제공, 생성 대상 축소, 서버 압축 전환 등을 검토한다. ([JSZip: generateAsync](https://stuk.github.io/jszip/documentation/api_jszip/generate_async.html))


### Q4. 사용자 입력 파일명을 ZIP 내부 파일명으로 그대로 써도 되나?


권장하지 않는다. ZIP 내부 파일명에 `../` 같은 패턴이 섞이면 일부 압축 해제 도구에서 위험한 경로로 풀릴 여지가 있다. 사용자 입력을 파일명으로 사용할 경우 정규화/필터링 정책을 별도로 두는 편이 안전하다. _(프로젝트 정책에 맞춰 검토 필요)_


---


## 결론


여러 파일 다운로드를 ZIP 1개로 합치면, 저장 흐름이 단순해지고 파일 관리도 쉬워진다.


핵심은 Blob/Object URL/a 다운로드 패턴을 유지한 채, JSZip으로 “중간 산출물”을 ZIP Blob으로 만드는 것이다. ([MDN: Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob))


---


## 참고(공식 문서)

- JSZip `generateAsync()` 문서. ([JSZip: generateAsync](https://stuk.github.io/jszip/documentation/api_jszip/generate_async.html))
- JSZip 사용 예시(파일/폴더 추가 포함). ([JSZip: Examples](https://stuk.github.io/jszip/documentation/examples.html))
- MDN: `Blob`. ([MDN: Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob))
- MDN: `URL.createObjectURL()` / `URL.revokeObjectURL()`, blob URL. ([MDN: URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static))
- MDN: `HTMLAnchorElement.download`. ([MDN: a.download](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/download))
- MDN: `HTMLCanvasElement.toBlob()`. ([MDN: canvas.toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob))
- Next.js: Server/Client Components, `'use client'`. ([Next.js Docs](https://nextjs.org/docs/app/getting-started/server-and-client-components))
