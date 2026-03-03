---
title: "중첩을 멈춰라: 콜백을 “평평하게” 만드는 법"
description: "콜백 기반 비동기 API는 Promise로 감싸고, 순차 작업은 async/await + 루프로 펼치면 유지보수가 쉬워진다."
date: "2025-12-23"
tags: ["javascript"]
notionPageId: "2f9c01ed-7f98-80fe-8d36-d661a2595061"
source: "notion"
---
# 중첩을 멈춰라: 콜백을 Promise/async로 “평평하게” 만드는 법


### 요약

- 한 문장 결론: **콜백 기반 비동기 API는 Promise로 감싸고, 순차 작업은** **`async/await + 루프`****로 펼치면 유지보수가 쉬워진다.**
- Electron에서는 “어디서 실행되는지(메인/렌더러/프리로드)”가 곧 안전성과 구조다.
- 메인 프로세스의 레거시 콜백 코드를 Promise로 바꾸면, 렌더러(UI)에서 동기처럼 읽히는 흐름을 만들 수 있다.
- 반복되는 “폴더를 내려가며 찾기”는 복붙 대신 루프로 일반화하는 게 핵심이다.

---


## 배경/문제


비동기 처리는 “나중에 결과가 오는 작업”을 다룰 때 필수다. 문제는 콜백만으로 순차 작업을 이어 붙이면 코드가 쉽게 안쪽으로 파고든다는 점이다. 요구가 깊어질수록 들여쓰기가 늘고, 흐름을 따라가기가 어렵다.


Electron에서는 여기에 한 가지가 더 붙는다. **메인 프로세스(백엔드 역할)와 렌더러(UI)가 분리되어 있기 때문에**, 콜백 중첩이 UI 코드까지 번지면 디버깅과 구조가 더 빠르게 무너진다.


공식 보안 가이드는 원격/렌더링 컨텍스트에서 Node.js 통합을 켜기보다는, **preload +** **`contextBridge`****로 필요한 API만 노출**하는 방식을 권장한다. ([Electron Docs: Security](https://www.electronjs.org/docs/latest/tutorial/security))


---


## 핵심 개념

- **메인 프로세스(Main process)**: OS/파일/네이티브 기능을 다루는 “앱의 백엔드”
- **렌더러(Renderer process)**: 화면(UI)을 그리는 “웹 페이지”
- **프리로드(Preload)**: 메인과 렌더러 사이에서, 필요한 기능만 안전하게 연결하는 브리지
- **`ipcRenderer.invoke`** **+** **`ipcMain.handle`**: 렌더러에서 “결과를 기다리는” RPC 형태의 IPC 패턴 ([Electron Docs: ipcRenderer](https://www.electronjs.org/docs/latest/api/ipc-renderer), [Electron Docs: ipcMain](https://www.electronjs.org/docs/latest/api/ipc-main))
- **Promise / async/await**: 콜백을 “반환값”으로 바꿔 흐름을 평평하게 만든다. ([MDN Web Docs: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), [MDN Web Docs: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function))

---


## 해결 접근


아래 예시는 “데모 폴더 트리”를 앱 실행 시 자동으로 만들어 둔 뒤,

1. 메인 프로세스에 **콜백 기반** **`getDirLegacy`** 를 만들고
2. 이를 **Promise로 래핑**한 다음
3. 렌더러(UI)에서 **`async/await + 루프`** 로 “깊게 내려가며 폴더 찾기”를 구현한다.

또한 Electron 권장 구조에 맞춰 **렌더러는** **`window.dirApi`****만 사용**하고, Node.js/파일 시스템 접근은 메인에 둔다. ([Electron Docs: Security](https://www.electronjs.org/docs/latest/tutorial/security))


### `getDirLegacy`만 쓰면 생기는 문제


`getDirLegacy(dirPath, callback)` 형태는 “끝나면 콜백을 부른다”는 규칙만 가진다. 이 방식만으로 순차 작업을 이어가면 아래 문제가 빠르게 드러난다.

- **중첩이 깊어진다**: 다음 단계가 이전 단계 결과에 의존할수록 들여쓰기가 계속 늘어난다.
- **에러 처리가 흩어진다**: 단계마다 `if (err) return ...`이 반복되고, 중간 실패 시 정리 로직도 분산되기 쉽다.
- **조합이 어렵다**: “결과를 반환”하지 않으니, 다른 비동기 흐름(`await`, `.then()`, `Promise.all`)에 끼워 넣기 어렵다.
- **Electron IPC와 결이 안 맞는다**: 렌더러에서 `ipcRenderer.invoke()`로 호출하면 Promise가 오길 기대하는데, 콜백은 반환값이 없어 그대로는 연결되지 않는다.

### (예시) 콜백 중첩 + 에러 처리 반복


```javascript
getDirLegacy(basePath, (err, folders1) => {
  if (err) return console.error("step1 error", err)

  const found1 = folders1.find((name) => name === "Etc")
  if (!found1) return console.log("Etc not found")

  getDirLegacy(path.join(basePath, found1), (err2, folders2) => {
    if (err2) return console.error("step2 error", err2)

    const found2 = folders2.find((name) => name === "Download")
    if (!found2) return console.log("Download not found")

    getDirLegacy(path.join(basePath, found1, found2), (err3, folders3) => {
      if (err3) return console.error("step3 error", err3)
      console.log("folders3", folders3)
    })
  })
})
```


기대 결과/무엇이 달라졌는지


- 동작은 가능하지만, 단계가 늘수록 들여쓰기와 에러 분기가 함께 늘어나 흐름을 읽기 어려워진다.


### (예시) `ipcMain.handle`에서 콜백을 그대로 쓰면 결과가 끊긴다


```javascript
ipcMain.handle("get-dir-legacy", (_event, dirPath) => {
  // ❌ 반환값이 없어서 renderer의 invoke()와 연결되지 않는다.
  getDirLegacy(dirPath, (err, folders) => {
    if (err) console.error(err)
    // 여기서 folders를 만들어도 renderer로 자동 전달되지 않는다.
  })
})
```


기대 결과/무엇이 달라졌는지


- 렌더러에서 `await ipcRenderer.invoke("get-dir-legacy", ...)`를 호출해도, 핸들러가 Promise를 반환하지 않으므로 결과가 자연스럽게 이어지지 않는다.


- 그래서 다음 단계로 가기 위해 **Promise 래핑(또는 Promise 기반 API)** 가 필요해진다.

> ⚠️ 보안/설계 주의
>
> 데모에서는 `demoRoot` 경로를 렌더러로 넘기지만, 실전에서는 **경로/환경 정보 노출을 최소화**하는 편이 안전하다. 또한 렌더러가 전달하는 `dirPath`는 신뢰하지 말고, **메인 프로세스에서 “허용한 루트 경로 하위만 접근”하도록 검증**(예: 루트 고정 + 경로 정규화 후 prefix 검사)을 반드시 넣자. ([Electron Docs: Security](https://www.electronjs.org/docs/latest/tutorial/security))
>
>

---


## 구현(코드)


### 파일 구성

- `main.js` (메인 프로세스)
- `preload.js` (브리지)
- `index.html` (UI)
- `renderer.js` (렌더러 스크립트)

---


### 1) main.js: 콜백 API + Promise 래핑 + IPC 핸들러


```javascript
// main.js
const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("node:path")
const fs = require("node:fs")

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

// 1) 레거시 콜백 스타일 (err-first)
function getDirLegacy(dirPath, callback) {
  fs.readdir(dirPath, { withFileTypes: true }, (err, entries) => {
    if (err) return callback(err)
    const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name)
    callback(null, folders)
  })
}

// 2) Promise로 래핑
function getDir(dirPath) {
  return new Promise((resolve, reject) => {
    getDirLegacy(dirPath, (err, folders) => {
      if (err) return reject(err)
      resolve(folders)
    })
  })
}

function createDemoTree(root) {
  // demo-root/
  //   Documents/
  //   Etc/Download/Download/Download/
  ensureDir(path.join(root, "Documents"))
  ensureDir(path.join(root, "Etc", "Download", "Download", "Download"))
}

function createWindow(preloadPath) {
  const win = new BrowserWindow({
    width: 900,
    height: 650,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  win.loadFile("index.html")
}

app.whenReady().then(() => {
  const demoRoot = path.join(app.getPath("userData"), "demo-tree")
  createDemoTree(demoRoot)

  // invoke/handle 패턴: renderer -> main (결과 반환)
  ipcMain.handle("demo-root", async () => demoRoot)
  ipcMain.handle("get-dir", async (_event, dirPath) => {
    return await getDir(dirPath)
  })

  createWindow(path.join(__dirname, "preload.js"))
})
```


기대 결과/무엇이 달라졌는지


- 콜백 기반 `getDirLegacy`를 유지하면서도, `getDir()`가 Promise를 반환해 “기다릴 수 있는 API”가 된다.


- 렌더러는 파일 시스템을 직접 건드리지 않고 IPC로 요청만 하게 된다. (`invoke`/`handle` 패턴)


- `contextIsolation: true`, `nodeIntegration: false` 기반으로 preload 브리지를 쓰는 구조가 된다. ([Electron Docs: Security](https://www.electronjs.org/docs/latest/tutorial/security))


---


### 2) preload.js: 필요한 API만 `contextBridge`로 노출


```javascript
// preload.js
const { contextBridge, ipcRenderer } = require("electron")
const path = require("node:path")

contextBridge.exposeInMainWorld("dirApi", {
  demoRoot: () => ipcRenderer.invoke("demo-root"),
  getDir: (dirPath) => ipcRenderer.invoke("get-dir", dirPath),
  join: (...parts) => path.join(...parts),
})
```


기대 결과/무엇이 달라졌는지


- 렌더러는 `window.dirApi.getDir()` 같은 “안전한 표면”만 쓴다. ([Electron Docs: contextBridge](https://www.electronjs.org/docs/latest/api/context-bridge))


- `ipcRenderer.invoke`로 요청하면 Promise가 돌아오므로 `await`가 가능해진다. ([Electron Docs: ipcRenderer](https://www.electronjs.org/docs/latest/api/ipc-renderer))


- `join`을 노출한 이유는, 렌더러에서 경로 조립을 `window.dirApi` 안에서만 처리해 “직접적인 Node API 접근”을 늘리지 않기 위함이다.


---


### 3) index.html: 최소 UI


```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Async Directory Demo</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; padding: 16px; }
      input, button { padding: 8px; font-size: 14px; }
      pre { background: #f6f6f6; padding: 12px; border-radius: 8px; overflow: auto; }
      .row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    </style>
  </head>
  <body>
    <h1>폴더 탐색: async/await로 평평하게</h1>

    <div class="row">
      <label>Targets:</label>
      <input id="targets" size="40" value="Etc/Download/Download/Download"/>
      <button id="run">Find</button>
    </div>

    <p id="base"></p>
    <pre id="out">{}</pre>

    <script src="./renderer.js"></script>
  </body>
</html>
```


기대 결과/무엇이 달라졌는지


- 입력값(예: `Etc/Download/...`)을 바꿔서 “얼마나 깊게 내려갈지”를 UI에서 바로 테스트할 수 있다.


---


### 4) renderer.js: `async/await + 루프`로 깊은 순차 작업 처리


```javascript
// renderer.js
const $targets = document.querySelector("#targets")
const $run = document.querySelector("#run")
const $out = document.querySelector("#out")
const $base = document.querySelector("#base")

function toTargets(str) {
  return str.split("/").map((s) => s.trim()).filter(Boolean)
}

async function findNestedPath(basePath, targets) {
  let current = basePath

  for (const target of targets) {
    const folders = await window.dirApi.getDir(current)
    const found = folders.find((name) => name === target)

    if (!found) return null
    current = window.dirApi.join(current, found)
  }

  return current
}

async function run() {
  const basePath = await window.dirApi.demoRoot()
  $base.textContent = `demoRoot:${basePath}`

  const targets = toTargets($targets.value)
  const result = await findNestedPath(basePath, targets)

  $out.textContent = JSON.stringify({ targets, result }, null, 2)
}

$run.addEventListener("click", () => {
  run().catch((err) => {
    $out.textContent = JSON.stringify(
      { error: String(err?.message ?? err) },
      null,
      2
    )
  })
})

// 첫 로드 시 한 번 실행
run()
```


기대 결과/무엇이 달라졌는지


- 콜백 중첩 없이, “현재 경로 → 폴더 목록 조회 → 다음 경로로 이동” 흐름이 위에서 아래로 읽힌다.


- 깊이가 늘어나도 코드는 그대로고, 입력(`targets`)만 바뀐다.


---


## 대안/비교


### 1) `util.promisify`로 래핑하기


콜백 함수가 err-first 규칙을 잘 지키고 있다면 래핑 코드가 더 짧아진다. ([Node.js Docs: util.promisify](https://nodejs.org/api/util.html#utilpromisifyoriginal))


단, `callback(err, result)` 형태(에러-퍼스트 콜백)일 때만 안전하게 적용할 수 있다.


```javascript
const { promisify } = require("node:util")
const getDir = promisify(getDirLegacy)
```


기대 결과/무엇이 달라졌는지


- `new Promise(...)`를 직접 쓰지 않고도 콜백 → Promise 변환이 간결해진다.


### 2) 처음부터 Promise API 쓰기 (`fs.promises`)


레거시 콜백이 아니라면, 애초에 Promise 기반 API를 쓰는 게 가장 깔끔하다. ([Node.js Docs: fs/promises](https://nodejs.org/api/fs.html#fspromisesapi))


```javascript
const fs = require("node:fs/promises")
const entries = await fs.readdir(dirPath, { withFileTypes: true })
```


기대 결과/무엇이 달라졌는지


- “래핑” 자체가 필요 없어지고, `await` 흐름으로 바로 들어간다.


---


## 검증 방법(체크리스트)

- [ ] 렌더러가 Node.js/파일 시스템을 직접 접근하지 않고, `contextBridge`로 노출된 API만 쓰는가? ([Electron Docs: contextBridge](https://www.electronjs.org/docs/latest/api/context-bridge))
- [ ] `ipcRenderer.invoke` ↔︎ `ipcMain.handle`로 “결과를 기다리는” IPC가 구성되어 있는가? ([Electron Docs: IPC](https://www.electronjs.org/docs/latest/tutorial/ipc))
- [ ] 깊이가 늘어나는 요구가 “복붙”이 아니라 루프로 일반화되어 있는가?
- [ ] “찾는 폴더가 없을 때”(`null`)와 “오류”가 구분되어 처리되는가?
- [ ] `nodeIntegration: false`, `contextIsolation: true` 기반으로 preload 브리지를 사용하고 있는가? ([Electron Docs: Security](https://www.electronjs.org/docs/latest/tutorial/security))

---


## 흔한 실수/FAQ


### Q1. `async/await`면 비동기가 동기로 바뀌나요?


아니다. 실행은 비동기지만, **코드가 동기처럼 “읽히는 형태”로 정리되는 것**이다. 렌더러에서 `invoke()`가 Promise를 반환하기 때문에 `await`가 가능해진다. ([Electron Docs: ipcRenderer](https://www.electronjs.org/docs/latest/api/ipc-renderer))


### Q2. 왜 렌더러에서 바로 `fs`를 쓰지 않나요?


렌더러는 UI 컨텍스트라서 외부 입력(XSS 등)과 맞닿아 있다. 공식 보안 가이드는 Node.js 통합을 켜는 것을 피하고, preload에서 필요한 기능만 노출하는 방식을 권장한다. ([Electron Docs: Security](https://www.electronjs.org/docs/latest/tutorial/security))


### Q3. 깊게 내려가며 찾는 로직이 길어지면 어떻게 하나요?


“단계 수가 늘어난다”는 건 반복 패턴이다. `targets`만 늘리고, 로직은 루프로 유지하는 게 포인트다. 필요하면 “최대 깊이 제한”이나 “검색 실패 시 fallback” 같은 정책을 함수 시그니처로 끌어올리면 된다.


---


## 결론


Electron에서 비동기 흐름이 복잡해질 때는, 콜백 중첩을 UI까지 끌고 가지 않는 게 핵심이다. **메인에 레거시 콜백을 두더라도 Promise로 감싸고, 렌더러에서는** **`async/await + 루프`****로 순차 작업을 평평하게** 만들면 코드가 안정적으로 유지된다.


---


## 참고(공식 문서 링크)

- [Electron Docs](https://www.electronjs.org/docs/latest)
- [Electron Docs: Security](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron Docs: Context Isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)
- [Electron Docs: contextBridge](https://www.electronjs.org/docs/latest/api/context-bridge)
- [Electron Docs: IPC](https://www.electronjs.org/docs/latest/tutorial/ipc)
- [Electron Docs: ipcRenderer](https://www.electronjs.org/docs/latest/api/ipc-renderer)
- [Electron Docs: ipcMain](https://www.electronjs.org/docs/latest/api/ipc-main)
- [Electron Docs: app.getPath](https://www.electronjs.org/docs/latest/api/app#appgetpathname)
- [MDN Web Docs: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN Web Docs: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN Web Docs: Array.prototype.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
- [Node.js Docs: util.promisify](https://nodejs.org/api/util.html#utilpromisifyoriginal)
- [Node.js Docs: fs/promises](https://nodejs.org/api/fs.html#fspromisesapi)
- [web.dev](https://web.dev/)
