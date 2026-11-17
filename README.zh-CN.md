# English Typing

通过反复书写学习英语的本地 **Electron** 桌面应用——可逐句抄写、按含义默写词汇，或默写全文。所有内容保存在本机：无需账户、无云同步，应用本身不发起网络请求。

---

## 功能

- **写作练习**（四个级别）：
  - **照原文输入** — 需匹配大小写、空格与标点；实时绿 / 红 / 灰反馈
  - **提示默写** — 仅显示每个单词首字母；点击检查后评分
  - **独立默写** — 默认隐藏原文，可按需查看
  - **盲写练习** — 完全隐藏原文；实时字符反馈；大小写与标点可选
- **词汇练习** — 根据含义默写英语单词
- **整篇默写** — 默写全文（Enter 用于换行）
- **我的文章** — 添加个人文章（每句话单独一行）
- **界面语言** — 越南语、英语、简体中文
- **主题** — 默认深色；可切换浅色（本地保存）
- **离线字体** — 书写区域使用内置 Roboto

### 快捷键

| 快捷键 | 作用 |
|---|---|
| **Enter** | 检查答案；正确则进入下一句（整篇默写中：换行） |
| **Ctrl+Enter** | 仅检查，不跳转 |
| **Backspace** | 纠错（抄写级别尤其有用） |

答对后才能进入下一句；错误时留在当前句继续修改。

### 练习控制

- **重新练习本句** — 清空当前输入
- **从头练习** — 重新开始当前课程，保留已掌握进度
- **再次练习** — 完成练习后出现
- **重置全部练习** — 清除写作与词汇进度，重置光标，回到内置文章第一句抄写模式（保留个人文章、语言与主题）

---

## 环境要求

- **Node.js** 18+（开发用）
- **Windows** x64（便携版打包推荐）

---

## 快速开始

```bash
npm install
npm run dev
```

通过 `tools/launch.cjs` 启动 Electron 窗口。

---

## 脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` / `npm start` | 本地运行应用 |
| `npm test` | 单元测试（`tests/*.test.mjs`） |
| `npm run typecheck` | TypeScript 检查 |
| `npm run build` | 用 esbuild 打包渲染进程到 `.cache/app.js` |
| `npm run dist:win` | 构建并打包 Windows x64 便携 EXE |
| `node tools/launch.cjs --smoke` | 冒烟测试真实 Electron 窗口（独立测试存储） |

### Windows 便携版

```bash
npm run dist:win
```

输出：`release/English-Typing-Portable.exe`  
无需安装 Node.js 即可运行。程序**尚未签名**。打包时可能下载构建工具；应用本身不发起网络请求。

---

## 项目结构

```
english-typing/
├── src/
│   ├── main/           # Electron 主进程
│   ├── renderer/       # 界面（HTML / CSS / JS）与字体
│   └── shared/         # 打字 / 学习逻辑与 i18n
├── tools/              # 启动与 esbuild 工具
├── tests/              # Node 测试
├── docs/design.md      # 评分与存储设计
├── electron-builder.json
├── package.json
└── tsconfig.json
```

---

## 隐私

- 应用不发起网络请求
- 进度与个人文章保存在本机 Electron 配置目录（`EnglishTyping`）
- 无需账户，不提供云同步
- 不保存尚未提交的输入；暂不记录个人文章完成进度

评分与存储细节见 [docs/design.md](docs/design.md)。

---

## 许可说明

- 应用代码：见仓库所有者约定
- **Roboto** 字体：SIL Open Font License（见 `src/renderer/fonts/OFL-Roboto.txt`）

---

## 相关文档

- English: [README.md](README.md)
- 简体中文: 本文件
