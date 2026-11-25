# 炎冬岁叙 · REPO

一个冬日飘雪主题的单页网页 Demo：展品画廊、短篇试阅、作者 freetalk、匿名留言墙，以及通过 [PostMail](https://postmail.invotes.com/) 寄给作者的私信。

## 本次改版新增

- **作者心语（FREETALK）**：每位作者一张卡片，头像 + 作者 ID + 想说的话，主笔的话会横向展开。
- **匿名留言墙**：深蓝色毛毡板，白色到浅蓝色的便利贴，贴纸上有留言、读者 ID 与日期；桌面三列、平板两列、手机一列。
- **我也要留言**：点击毛毡板右上角的按钮或墙上的空白便利贴，会打开留言弹窗；填写后立刻贴到墙上，并保存在当前浏览器中。
- **手机适配**：320px 起即可正常浏览，便利贴自动单列，留言弹窗在矮屏上会变成近乎全屏的面板，按钮始终可见。
- **GitHub Pages 兼容**：全部为静态文件、相对路径，无后端、无构建步骤，放在仓库根目录或子目录都能直接打开。

## 如何打开

> 直接双击 `index.html` 也能看到页面和留言墙；但如果要测试「写信」的 PostMail 寄送，请通过本地服务器打开。

双击 **`start-server.bat`**，浏览器会自动打开：

```
http://127.0.0.1:8080/
```

如果 8080 端口被占用，可以右键编辑 `start-server.bat`，把其中的 `8080` 改成其他端口。

也可以在当前文件夹手动运行：

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

## 页面流程

1. 进入页面，浏览首屏、展品、试阅，以及作者们的 freetalk。
2. 到「匿名留言墙」看看其他读者贴的便利贴。
3. 点击「我也要留言」，填写留言（可不署名），选一张便利贴颜色，点「贴到墙上」。
4. 新留言会出现在墙的最前面，并保存到浏览器的 `localStorage`；刷新或下次打开仍在。
5. 想私下对作者说的话，可以到「来信」区通过 PostMail 寄出。

发件参数写在 `index.html` 的隐藏字段中：

- `access_token`：`0emv4dw5qew9ocwrto69y9wd`
- 收件邮箱：`1608794168@qq.com`（由 PostMail token 绑定）
- `success_url` / `error_url`：由 `js/main.js` 在运行时自动写入当前页面的绝对地址，保证本地服务器和线上部署都能返回本页。

> 说明：PostMail 是纯前端服务，access token 会出现在页面源码中。这是该服务的工作方式；请勿把这个 token 用于敏感场景，若发现滥用可在 PostMail 重新申请。

## 留言墙的数据说明

- 初始的 10 张便利贴来自 `js/config.js` 的 `wall.seed`，是所有访客都能看到的示例内容。
- 读者新贴的便利贴只保存在**当前浏览器**的 `localStorage`（键名 `yandong-wall-notes-v1`），不会上传到服务器，也不会出现在别人的设备上。
- 换浏览器、换设备、清理浏览器数据后，自己贴的留言会消失；这是纯静态 Demo 的预期行为。
- 若需要「所有人共享的留言墙」，需要接入后端或第三方数据库，本 Demo 未包含。

清空自己贴的留言，可在浏览器控制台执行：

```js
localStorage.removeItem("yandong-wall-notes-v1");
localStorage.removeItem("yandong-wall-name-v1");
```

## 文件结构

```
repoPageYDSX/
├─ index.html               页面结构
├─ css/
│  └─ style.css             全部样式、响应式、毛毡板与便利贴、留言弹窗
├─ js/
│  ├─ config.js             展品 / 文件 / 试阅 / 作者心语 / 留言墙配置
│  └─ main.js               渲染、留言墙逻辑、PostMail、雪花 canvas
├─ img/
│  ├─ favicon.svg
│  ├─ avatars/
│  │  ├─ avatar-shuo.svg
│  │  ├─ avatar-ayao.svg
│  │  ├─ avatar-linjian.svg
│  │  ├─ avatar-xuejian.svg
│  │  └─ avatar-mang.svg
│  ├─ sample-cover.jpg
│  ├─ sample-cover-art.jpg
│  ├─ sample-snow.jpg
│  ├─ sample-cats.jpg
│  └─ sample-collage.jpg
├─ txt/
│  ├─ 谈春.docx
│  └─ 谈春-试阅.txt
├─ start-server.bat         本地预览服务器
├─ preview.jpg              页面预览截图
└─ README.md
```

## 后续替换素材

### 1. 作者与 freetalk

把头像放进 `img/avatars/`，然后编辑 `js/config.js` 的 `freetalk.authors`：

```js
{
  name: "作者 ID",
  handle: "@author_id",
  role: "主笔 · 《谈春》",
  avatar: "img/avatars/author.svg",
  avatarAlt: "头像的无障碍说明",
  text: "想对读者说的话。",
  meta: "写于 12 月 21 日 · 雪",
  featured: true // 可选：横跨两列展示
}
```

`featured` 只建议给一位作者使用；头像加载失败时会自动退化为作者名字的首字。

### 2. 留言墙的示例便利贴

编辑 `js/config.js` 的 `wall.seed`：

```js
{
  id: "seed-11",
  reader: "读者 ID",
  text: "留言内容，建议 40 字以内。",
  time: "12 月 26 日",
  color: "ice",       // snow / ice / sky
  rotate: -1.4        // 倾斜角度，-3 到 3
}
```

同时可以调整：

```js
wall: {
  maxLength: 120,     // 单条留言字数上限
  maxNotes: 120,      // localStorage 中最多保留多少条读者留言
  anonymousName: "匿名的旅人",
  storageKey: "yandong-wall-notes-v1"
}
```

`wall.colors` 与 CSS 里的 `.note--snow` / `.note--ice` / `.note--sky` 对应；新增颜色时需要同时补样式。修改 `maxLength` 时，也请同步调整 `index.html` 中留言输入框的 `maxlength`、字数提示，以及弹窗底部的「最多 120 字」文案。

### 3. 背景图（已预留）

把背景图放进 `img/`，例如 `img/background.jpg`，然后打开 `css/style.css`，把文件开头的：

```css
--page-bg: none;
```

改成：

```css
--page-bg: url("../img/background.jpg");
```

`--page-bg-opacity` 可调整背景浓度，默认 `0.28`。

### 4. 展品图片

把正式图片放进 `img/`，然后编辑 `js/config.js` 的 `gallery` 数组：

```js
{
  src: "img/你的图片.jpg",
  alt: "图片说明（供无障碍阅读）",
  tag: "COVER / 01",
  title: "展品标题",
  caption: "一行短说明",
  description: "点击大图后显示的详细说明"
}
```

数组顺序对应四个展位：第 1 张为大幅竖图，第 2 张为横幅，第 3、4 张为小图。

### 5. 文本与下载文件

- 直接替换 `txt/谈春.docx`、`txt/谈春-试阅.txt`，或者在 `js/config.js` 的 `files` 数组中增加条目。
- 试阅区文字在 `js/config.js` 的 `excerpt.paragraphs` 中修改。
- 文件路径、类型、大小的显示值也在 `files` 数组中维护。

## 部署到 GitHub Pages

1. 新建一个仓库（或使用已有仓库）。
2. 把本文件夹里的 `index.html`、`css/`、`js/`、`img/`、`txt/` 一并上传到仓库。`index.html` 需要位于站点根目录（仓库根目录，或你想作为站点根的子目录）。
3. 仓库 **Settings → Pages**：
   - Source 选择 **Deploy from a branch**；
   - Branch 选择 `main`（或 `master`），目录选择 **/ (root)**，保存。
4. 等待 Pages 构建完成，访问 `https://<用户名>.github.io/<仓库名>/`。

页面内所有资源都使用相对路径（`css/…`、`img/…`、`txt/…`），因此部署在 `/<仓库名>/` 这样的子路径下也能正常加载；不需要修改任何配置，也不需要构建命令。

### 部署后功能是否一致？

- 展品、大图、试阅、下载、飘雪、导航：一致。
- freetalk 与留言墙：一致；新留言保存在访客自己的浏览器里（按域名隔离）。
- PostMail 私信：一致；成功/失败后会返回当前 Pages 地址的对应锚点。
- 首次打开需要联网加载字体/图片吗？不需要，字体使用系统字体，图片与头像都是本地文件；只有 PostMail 寄信时才需要网络。

## 浏览器支持

使用了原生 `<dialog>`、CSS `columns`、`backdrop-filter`、`IntersectionObserver` 和 Canvas。建议使用最新版 Chrome / Edge / Firefox / Safari（Safari 15.4+ 支持 `<dialog>`）。若系统开启「减少动态效果」，飘雪和大部分动画会自动关闭。

## 已验证

- 桌面（1920 / 1440 / 1280 / 1024 / 900 / 821）与手机（768 / 390 / 360 / 320）宽度：无横向滚动，留言板与弹窗不溢出。
- 320×568 小屏：留言弹窗自动变为近乎全屏，颜色选择与「贴到墙上」按钮均可见。
- 留言提交、刷新后持久化、清空 localStorage、空留言拦截：均正常。
- 子路径部署（`/repoPageYDSX-build/`）下 CSS、JS、头像、图片、下载文件全部正常加载。
- PostMail 表单参数沿用原配置，寄信逻辑未改动；正式寄送前建议先自行测试一次。
- 以上使用 Chrome 无头模式验证；未在真实 iPhone / Android 设备上实测。
