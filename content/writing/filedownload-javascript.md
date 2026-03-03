---
title: "자바스크립트를 이용한 파일다운로드"
description: "자바스크립트를 이용한 파일다운로드"
date: "2026-01-05"
tags: ["javascript"]
notionPageId: "2f9c01ed-7f98-80fc-8828-d2e4035cdc08"
source: "notion"
---
# 클라이언트에서 파일 다운로드 구현하기 (Blob API 활용)


## 요약


웹 애플리케이션에서 서버 없이 클라이언트 측 데이터를 파일로 다운로드해야 할 때가 있습니다. 이 글에서는 Blob API와 Object URL을 사용하여 CSV 파일과 Canvas 이미지를 다운로드하는 방법을 다룹니다. Next.js 환경에서 사용 시 주의사항과 브라우저 호환성 고려사항도 함께 살펴봅니다.


---


## 배경 및 문제


사용자가 생성한 데이터(CSV 리포트, Canvas 그래프, 동적 생성 이미지 등)를 다운로드하려면 일반적으로 서버에 업로드 후 다시 다운로드하는 방식을 사용합니다. 하지만 다음과 같은 상황에서는 클라이언트에서 직접 처리하는 것이 효율적입니다:

- 민감한 데이터를 서버에 전송하고 싶지 않을 때
- 서버 리소스를 절약하고 싶을 때
- 실시간으로 생성된 데이터를 즉시 다운로드해야 할 때

---


## 핵심 개념


### Blob (Binary Large Object)


[Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)은 파일과 유사한 불변 원시 데이터를 담는 객체입니다. 텍스트, 바이너리 데이터 등 다양한 형태의 데이터를 표현할 수 있습니다.


```javascript
const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
```


### Object URL


[URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)은 Blob 객체를 가리키는 임시 URL을 생성합니다. 이 URL은 `blob:` 프로토콜을 사용하며, 브라우저 메모리에 있는 데이터를 참조합니다.


```javascript
const url = URL.createObjectURL(blob);
// 결과: "blob:http://localhost:3000/abc-123-def"
```


### 다운로드 메커니즘


HTML5의 `<a>` 태그 `download` 속성을 사용하면 링크 클릭 시 파일을 다운로드할 수 있습니다.


```html
<a href="blob:..." download="filename.csv">다운로드</a>
```


---


## 해결 접근


클라이언트 측 파일 다운로드는 다음 단계로 구현합니다:

1. **데이터 준비**: 다운로드할 데이터 생성 (문자열, ArrayBuffer 등)
2. **Blob 생성**: 데이터를 Blob 객체로 변환
3. **Object URL 생성**: Blob을 가리키는 임시 URL 생성
4. **다운로드 트리거**: `<a>` 태그를 생성하고 프로그래밍 방식으로 클릭
5. **정리**: 사용한 Object URL 해제 (메모리 누수 방지)

---


## 구현


### 기본 유틸리티 함수


```typescript
/**
 * 클라이언트 측에서 파일 다운로드를 실행합니다.
 *
 *@paramdata - 다운로드할 데이터 (string, ArrayBuffer, Blob 등)
 *@paramfileName - 저장될 파일명
 *@parammimeType - MIME 타입 (기본값: 'text/plain;charset=utf-8')
 */
function downloadFile(
  data: string | ArrayBuffer | Blob,
  fileName: string,
  mimeType: string = 'text/plain;charset=utf-8'
): void {
  // 1. Blob 객체 생성
  const blob = data instanceof Blob
    ? data
    : new Blob([data], { type: mimeType });

  // 2. Object URL 생성
  const url = URL.createObjectURL(blob);

  // 3. 임시 <a> 태그 생성 및 클릭
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  // 접근성: 스크린 리더를 위한 설명
  link.setAttribute('aria-label', `${fileName} 다운로드`);

  // DOM에 추가하지 않고 클릭 (대부분의 현대 브라우저에서 동작)
  link.click();

  // 4. 메모리 정리
  URL.revokeObjectURL(url);

  // 선택사항: link 요소 제거 (필요시)
  // link.remove();
}
```


**기대 결과**: 이 함수를 호출하면 브라우저의 다운로드 동작이 트리거되어 사용자가 파일을 저장할 수 있습니다.


### CSV 파일 다운로드 예시


```typescript
function downloadCSV(): void {
  const csvData = [
    ['이름', '나이', '직업'],
    ['홍길동', '30', '개발자'],
    ['김철수', '25', '디자이너']
  ];

  // CSV 형식으로 변환
  const csvContent = csvData
    .map(row => row.join(','))
    .join('\n');

  downloadFile(
    csvContent,
    'data.csv',
    'text/csv;charset=utf-8;'
  );
}
```


**기대 결과**: CSV 파일이 다운로드되며, Excel이나 스프레드시트 프로그램에서 열 수 있습니다.


### Canvas 이미지 다운로드 예시


```typescript
function downloadCanvasImage(canvasId: string): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

  if (!canvas) {
    console.error('Canvas를 찾을 수 없습니다.');
    return;
  }

  // Canvas를 Blob으로 변환 (비동기)
  canvas.toBlob((blob) => {
    if (!blob) {
      console.error('Blob 생성 실패');
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'canvas-image.png';
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
```


**기대 결과**: Canvas에 그려진 내용이 PNG 이미지로 다운로드됩니다.


**참고**: [HTMLCanvasElement.toBlob()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)은 비동기 방식으로 동작하므로 콜백 함수를 사용합니다.


### Base64 이미지 다운로드 (레거시 방식)


```typescript
function downloadBase64Image(base64Data: string, fileName: string): void {
  // data:image/png;base64, 헤더 제거
  const base64Content = base64Data.includes('base64,')
    ? base64Data.split('base64,')[1]
    : base64Data;

  // Base64를 바이너리로 변환
  const binaryString = atob(base64Content);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: 'image/png' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}
```


**참고**: Canvas의 경우 위의 `toBlob()` 방식이 더 권장됩니다. [atob()](https://developer.mozilla.org/en-US/docs/Web/API/atob)는 유지 관리 모드이지만 여전히 안전하게 사용 가능합니다.


---


## Next.js에서 사용하기


Next.js는 서버 사이드 렌더링(SSR)을 지원하므로, `window`, `document` 같은 브라우저 전용 API는 클라이언트에서만 실행되어야 합니다.


### App Router (권장)


```typescript
'use client'; // 클라이언트 컴포넌트로 지정

import { useState } from 'react';

export default function DownloadExample() {
  const handleDownload = () => {
    // 브라우저 환경 체크
    if (typeof window === 'undefined') return;

    const data = 'Hello, World!';
    downloadFile(data, 'example.txt', 'text/plain');
  };

  return (
    <button onClick={handleDownload}>
      파일 다운로드
    </button>
  );
}
```


**주의사항**:
- `'use client'` 지시어를 파일 최상단에 추가해야 합니다.
- 서버 컴포넌트에서는 브라우저 API를 사용할 수 없습니다.


### Pages Router


```typescript
import { useEffect } from 'react';

export default function DownloadPage() {
  useEffect(() => {
    // 클라이언트에서만 실행
    // downloadFile 함수 정의...
  }, []);

  return (
    <button onClick={() => downloadFile('data', 'file.txt')}>
      다운로드
    </button>
  );
}
```


**참고**: [Next.js Rendering Documentation](https://nextjs.org/docs/app/building-your-application/rendering)


---


## 검증 방법


다운로드 기능을 구현한 후 다음 사항을 확인하세요:

- [ ] 파일이 올바른 이름으로 다운로드되는가?
- [ ] 파일 내용이 정확한가? (텍스트 편집기나 해당 프로그램으로 열어 확인)
- [ ] 브라우저 콘솔에 에러가 없는가?
- [ ] 메모리 누수가 없는가? (`revokeObjectURL` 호출 확인)
- [ ] 다양한 브라우저(Chrome, Firefox, Safari, Edge)에서 동작하는가?
- [ ] Next.js 프로젝트의 경우: SSR 에러가 발생하지 않는가?

**테스트 팁**: Chrome DevTools의 Memory 탭에서 Object URL이 제대로 해제되는지 확인할 수 있습니다.


---


## 흔한 실수 및 FAQ


### Q1. Safari에서 다운로드가 동작하지 않습니다.


**A**: 과거 Safari는 `<a>` 태그의 프로그래밍 방식 클릭을 제한했지만, **현재 Safari(iOS 13+, macOS 10.15+)는 정상 동작합니다**. 다만 다음을 확인하세요:

- 사용자 인터랙션(버튼 클릭 등) 내에서 다운로드 함수를 호출해야 합니다.
- 비동기 작업 후 다운로드 시 일부 제약이 있을 수 있습니다.

```typescript
// ✅ 좋은 예: 사용자 클릭 이벤트 핸들러에서 바로 호출
button.addEventListener('click', () => {
  downloadFile(data, 'file.txt');
});

// ⚠️ 주의: setTimeout 같은 비동기 내에서는 제약 가능
button.addEventListener('click', () => {
  setTimeout(() => {
    downloadFile(data, 'file.txt'); // Safari에서 차단될 수 있음
  }, 1000);
});
```


### Q2. URL.revokeObjectURL은 언제 호출해야 하나요?


**A**: Object URL은 브라우저 메모리를 사용하므로, 사용 후 즉시 해제하는 것이 좋습니다. 다운로드 직후 호출하면 됩니다.


```typescript
link.click();
URL.revokeObjectURL(url); // 바로 해제해도 다운로드는 정상 진행됨
```


**참고**: [URL.revokeObjectURL() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL)


### Q3. Next.js에서 “window is not defined” 에러가 발생합니다.


**A**: 서버 사이드에서 브라우저 API를 호출했기 때문입니다. 다음 방법으로 해결하세요:

1. **App Router**: 컴포넌트에 `'use client'` 추가
2. **조건부 실행**: `typeof window !== 'undefined'` 체크
3. **동적 import**: `next/dynamic`으로 클라이언트 전용 컴포넌트 로드

```typescript
// 방법 3: 동적 import
import dynamic from 'next/dynamic';

const DownloadButton = dynamic(() => import('./DownloadButton'), {
  ssr: false // 서버 렌더링 비활성화
});
```


**참고**: [Next.js Dynamic Import](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)


### Q4. 한글 파일명이 깨집니다.


**A**: 브라우저마다 인코딩 처리가 다를 수 있습니다. 특수문자가 포함된 파일명은 `encodeURIComponent`를 사용하지 않고 그대로 전달하는 것이 현대 브라우저에서 권장됩니다.


```typescript
// ✅ 현대 브라우저는 UTF-8 파일명을 직접 지원
link.download = '데이터_리포트.csv';

// ❌ 불필요: encodeURIComponent 사용 안 함
// link.download = encodeURIComponent('데이터_리포트.csv');
```


### Q5. 대용량 파일 다운로드 시 브라우저가 느려집니다.


**A**: Blob은 메모리에 데이터를 보관합니다. 매우 큰 파일(수백 MB 이상)의 경우:

- [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)를 사용하여 청크 단위로 처리
- 서버 측 다운로드 엔드포인트를 고려
- [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)로 메인 스레드 부하 분산

---


## 결론


Blob API와 Object URL을 활용하면 서버 없이 클라이언트에서 파일 다운로드를 구현할 수 있습니다. 주요 장점은 다음과 같습니다:

- **빠른 응답**: 서버 왕복 없이 즉시 다운로드
- **프라이버시**: 민감한 데이터를 서버에 전송하지 않음
- **서버 부하 감소**: 클라이언트 리소스 활용

Next.js 같은 SSR 프레임워크에서는 클라이언트/서버 경계를 명확히 이해하고 사용해야 합니다. 브라우저 호환성도 지속적으로 개선되고 있어, 현대 웹 애플리케이션에서 안전하게 사용할 수 있습니다.


---


## 참고


### 공식 문서

- [Blob API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [URL.createObjectURL() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
- [HTMLCanvasElement.toBlob() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
- [HTML download attribute - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download)
- [Next.js Client Components - Official Docs](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

### 관련 기술

- [File API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [Streams API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [Web Workers API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
