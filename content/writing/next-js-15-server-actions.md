---
title: "Next.js 15에서 Server Actions 활용하기"
description: "Next.js 15에서 Server Actions 활용하기 Next.js 15는 웹 개발자들에게 새로운 기능을 제공합니다. 그 중 하나가..."
date: "2026-02-10"
tags: []
notionPageId: "303c01ed-7f98-818f-803e-ebe96fc54ce1"
source: "notion"
---
# Next.js 15에서 Server Actions 활용하기


Next.js 15는 웹 개발자들에게 새로운 기능을 제공합니다. 그 중 하나가 Server Actions입니다. 이 글에서는 초보자를 위한 Server Actions의 활용법을 단계별로 쉽게 설명하겠습니다.


## Server Actions란?


Server Actions는 Next.js 15에서 도입된 기능으로, 서버 측 로직을 통해 클라이언트 요청을 처리할 수 있도록 돕습니다. 이는 서버와 클라이언트 간의 데이터 처리를 간소화하여, 더 나은 사용자 경험을 제공합니다.


### Server Actions의 장점

1. 간편한 서버 로직 작성: JS로 서버 코드를 쉽게 작성할 수 있습니다.
2. 성능 향상: 서버에서 직접 데이터를 처리함으로써 클라이언트의 부담을 줄입니다.
3. 보안 강화: 민감한 데이터를 서버에서 안전하게 처리할 수 있습니다.

## Server Actions 활용하기


이제 Server Actions을 어떻게 활용할 수 있는지 단계별로 살펴보겠습니다.


### 1. Next.js 프로젝트 생성


먼저, Next.js 프로젝트를 생성해야 합니다. 터미널에서 다음 명령어를 실행하여 새 프로젝트를 만듭니다.


```bash
npx create-next-app@latest my-next-app
cd my-next-app
```


### 2. Server Actions 설정


Server Actions를 활성화하려면 next.config.js 파일을 수정해야 합니다.


```javascript
// next.config.js
module.exports = {
  experimental: {
    serverActions: true,
  },
}
```


### 3. 간단한 Server Action 만들기


pages/api 폴더에 새로운 파일을 생성하고, 간단한 서버 액션을 작성해봅시다.


```javascript
// pages/api/submit.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name } = req.body;
    res.status(200).json({ message: `Hello, ${name}!` });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
```


위 코드는 클라이언트에서 보낸 POST 요청을 처리하고, 사용자에게 맞춤 인사말을 반환합니다.


### 4. 클라이언트에서 Server Action 호출하기


이제 클라이언트 측에서 방금 만든 Server Action을 호출하는 예제를 만들어봅시다.


```javascript
// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) =&gt; {
    e.preventDefault();
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    &lt;div&gt;
      &lt;h1&gt;Server Actions 예제&lt;/h1&gt;
      &lt;form onSubmit={handleSubmit}&gt;
        &lt;input
          type="text"
          value={name}
          onChange={(e) =&gt; setName(e.target.value)}
          placeholder="이름을 입력하세요"
        /&gt;
        &lt;button type="submit"&gt;전송&lt;/button&gt;
      &lt;/form&gt;
      {message &amp;&amp; &lt;p&gt;{message}&lt;/p&gt;}
    &lt;/div&gt;
  );
}
```


이 코드는 사용자가 이름을 입력하고 제출하면, 서버에 요청을 보내 환영 메시지를 받아옵니다.


## 결론


이렇게 간단한 예제를 통해 Next.js 15의 Server Actions를 활용하는 방법을 알아보았습니다. 이 기능은 서버와 클라이언트 간의 상호작용을 더욱 직관적으로 만들며, 효율적인 웹앱 개발을 가능하게 합니다. 지금 바로 Next.js 15를 사용해 새로운 기능을 경험해보세요!
