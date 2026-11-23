# GitHub 中文化（油猴脚本）

把 GitHub 网页界面汉化成简体中文的 Tampermonkey / Violentmonkey 用户脚本。纯离线词库，不联网、不读取账号数据，安装后打开 `github.com` 自动生效。

- 主文件：[github-zh.user.js](github-zh.user.js)（单文件，**1276 条词库 + 100 条动态规则**）
- 版本：**1.7.2**
- 在线安装：<https://raw.githubusercontent.com/jychen089/github-zh/main/github-zh.user.js>
- 适用站点：`https://github.com/*`（桌面端 + 移动端网页）
- 许可证：MIT

## 1.7.2 更新重点：支持在线安装与自动更新

脚本头部已写入更新地址：

```js
// @updateURL    https://raw.githubusercontent.com/jychen089/github-zh/main/github-zh.user.js
// @downloadURL  https://raw.githubusercontent.com/jychen089/github-zh/main/github-zh.user.js
```

从上面的 raw 链接安装一次后，Tampermonkey 会自动对比 `@version` 并升级。以后只需改脚本、递增版本号、提交即可。

> 从旧版粘贴安装的副本没有更新地址，需要重新从 URL 装一次。

## 1.7.1 更新重点：清单自带版本号 + 目录标签

你上一份 28 条清单里，**21 条在 1.7.0 已经能翻**，说明浏览器里跑的是旧版本。为了防止再出现这种“不知道是哪一版报的”问题：

- 清单面板标题现在显示版本：`待补翻译 12 条 · v1.7.1`
- 复制的文本首行也带版本：`待补翻译 12 条（v1.7.1，次数 来源 建议 原文）：`

另外补上了目录类型标签：`docs, (Directory)`、`link, (Symlink)` 这类不再上报（之前只过滤了 `(File)`）。

## 1.7.0 更新重点：发行版编辑页 + 文件查看器

补齐 89+25 条里去掉重复后的约 90 条词条：

| 区域 | 代表词条 |
| --- | --- |
| Markdown 工具栏 | Bold、Italic、Heading、Quote、Numbered list、Task list、Mention、Reference、Attach files |
| 发行版编辑 | New release、Tag、Existing tag、Semantic versioning、Save draft、Release description、Pick a branch or recent commit |
| 附件上传 | Attach binaries by dropping them here、We don't support that file type、Yowza, that's a big file、Uploading your file now… |
| 文件查看器 | Expand file tree、File metadata and controls、Outline、Edit and raw actions、Add to space、Ask Copilot about this file |

### 新增 3 条规则 + 3 项体验细节

| 项目 | 效果 |
| --- | --- |
| `223 lines (184 loc) · 10 KB` | 223 行（184 行代码）· 10 KB |
| `with a file smaller than 2GB.` | 并使用小于 2GB 的文件。 |
| `Too many assets... 1000 assets.` | 资产过多。每个发行版最多 1000 个资产。 |
| ` or ` / ` and ` 连接词 | 当它们夹在内联元素中间时改翻成「或」「和」 |
| 中文句尾标点 | 前一段是中文时，把半角 `?` `!` `.` 改成全角 |
| 文件大小 | `10 KB`、`2GB` 这类数据不翻，也不上报 |

### 碎片句子现在能整句成型

```
It’s common practice to prefix your version names with the letter [v].
Some good tag names might be [v1.0.0] or [v2.0.0].
→ 常见做法是在版本名前加上字母 v。一些好的标签名可能是 v1.0.0 或 v2.0.0.

This tag already has release notes. Would you like to [edit the existing notes]?
→ 此标签已有发行版说明。是否要 编辑现有说明？
```

## 1.6.2 更新重点：仓库代码页 / Releases

补齐仓库代码页与 Releases 页 24 条词条：`Open commit details`、`Folders and files`、`Last commit date`、`Last commit message`、`Repository files`、`Security and quality`、`Star lists`、`Switch repository`、`View all files`、`Releases and tags` 等。

### 新增 4 条规则

| 原文 | 译文 |
| --- | --- |
| `1 more breadcrumb items` | 还有 1 个面包屑项 |
| `Commit d521852` | 提交 d521852 |
| `commits by jychen089` | jychen089 的提交 |
| `main branch` | main 分支（分支名保留原样） |

### 不再上报的用户内容

| 内容 | 例子 | 修法 |
| --- | --- | --- |
| 提交信息 | `Revise README for project title and character info` | 链接指向 `/commit/` 的一律跳过 |
| 文件名标签 | `README.md, (File)` | 匹配 `文件名, (File)` 格式跳过 |
| 组合键 | `alt shift r` | 快捷键正则支持 alt/shift/ctrl 等修饰键组合 |

## 1.6.1 更新重点：搜索页排序下拉

截图里漏的几项补上了：

| 原文 | 译文 |
| --- | --- |
| Fewest stars | 星标最少 |
| Fewest forks | 复刻最少 |
| Save your search | 保存你的搜索 |
| View search docs | 查看搜索文档 |
| Provide feedback | 提供反馈 |
| Sort options | 排序选项 |
| Most recent | 最近 |
| Most recently updated | 最近更新 |
| Recently indexed | 最近收录 |

`Fewest X` / `Most X` 现在是**一条规则**而不是词条，覆盖 stars / forks / watchers / comments / reactions / downloads / contributors / issues / pull requests / releases / packages / followers 十二种名词，以后 GitHub 新加组合也能自动出结果。

## 1.6.0 更新重点：搜索页 + 检测器自愈

补齐搜索页 23 条词条，新增 4 条规则：

| 规则 | 效果 |
| --- | --- |
| `3.2k results` | → 3.2k 个结果 |
| `JavaScript language` | → JavaScript 语言（语言名自动保留原样） |
| `Page 3` | → 第 3 页 |
| `( 302 ms )` | 搜索计时，不翻也不上报 |

同时补了一对碎片，让搜索框那tip能整句翻出来：

```
Press the  +  <kbd>/</kbd>  +  key to activate the search input again and adjust your query.
→ 按 / 键可再次激活搜索框并调整查询。
```

### 检测器两个改进

| 改进 | 说明 |
| --- | --- |
| 整句覆盖率检查 | 如果一句里**每个碎片都能翻**，说明已经通了，不再上报（上版会把已翻好的句子再报一遍） |
| 用户名启发 | 全小写单 token（如 `terryhu`）基本是用户名 / 标识符，不上报；词库已有的不受影响 |

## 1.5.0 更新重点：补齐三大页面 + 检测器去噪

按你上一轮清单的处理结果：

| 页面 | 新增 |
| --- | --- |
| 通知收件箱 | 23 条（Clean up your inbox、Folders、Switch inbox、Search notifications 等） |
| Feed 动态 | 27 条（Recommendations、Trending repositories、activity 设置项等） |
| 仓库页 | 17 条（My contributions、Views、Relevance、ProTip! 等） |

另加 6 条规则：`2 reactions`、`2 people reacted with thumbs up`、`4759 stargazers`、`Sort by Relevance descending`、`react with thumbs up`、`I'm not interested in published releases from X`。

### emoji 前缀不再阻碍翻译

GitHub 把图标当文字前缀，`✋ Mentioned` 因为多了个 emoji 就匹配不到词库。现在会先剥掉首尾 emoji 再查，然后把 emoji 拼回去：`✋ Mentioned` → `✋ 提及`。一次修好 5 条。

### 按你的决定不翻

| 内容 | 处理 |
| --- | --- |
| 反应名（eyes / heart / hooray / laugh / rocket / thumbs up） | 不翻，检测器也不再上报 |
| `released` 单独成词 | 不翻 |
| 空收件箱口号（Take a break, write some code…） | 不翻，保留原文语感 |

### 检测器修掉 5 类误报

| 误报类型 | 例子 | 修法 |
| --- | --- | --- |
| 快捷键带括号 | `( g then d )` | 先剥外层括号再判定 |
| 数字缩写 | `4.8k`、`5.5k` | 匹配 `^\d+(\.\d+)?[kmb]?$` 跳过 |
| 辅助技术标签 | `Repo Details 2-0`、`repository body 3`、`Release interactions 1` | 按前缀名单跳过 |
| 过滤器 slug | `contributed-by` | 纯 kebab-case 小写 slug 跳过 |
| 发行版名带 ISO 日期 | `Nightly Build 2026-11-17` | 含 `\d{4}-\d{2}-\d{2}` 跳过 |

另外：指向 `github.blog` / `/changelog` 的链接文字（更新日志标题）与 `<article>` 里的仓库描述不再上报。

## 1.4.0 更新重点：碎片治理

这一版按你的三个决定重做了「什么该翻、什么不该翻」：

| 决定 | 落地做法 |
| --- | --- |
| **Q1 绝对时间戳不翻** | `Nov 17, 2026, 22:42 GMT+8` 这类带时刻/时区的文本原样保留，检测器也不再上报 |
| **Q2 句中日期翻成中文** | `No contributions on November 16th.` → `11 月 16 日没有贡献`；`on Oct 4` → `10 月 4 日`；`Aug 7, 2025` → `2025 年 8 月 7 日` |
| **Q3 一致性优先** | 一句话只翻一半会变成中英混排，此时**整句保持英文**，等词库补全后再整句翻 |

### 碎片保护：这些不再翻

GitHub 会把一句话拆成多个文本节点，逐个翻只会更难看。现在直接跳过：

| 类型 | 例子 | 原因 |
| --- | --- | --- |
| 虚词 / 冠词 / 介词 | `and`、`to`、`the`、`of` | 翻成「和」「到」「的」会破句 |
| 纯标点 | `.`、`·`、`,` | GitHub 把句号单独吐成一个节点 |
| 量词残片 | `followers`、`items`（数字在另一个节点时） | 只能拼出「12 关注者」，你选了**保留英文** |
| 快捷键记号 | `g then d`、`enter` | 是按键名不是句子 |

判定规则很窄：**只有全小写**才会被跳过，所以 `Lists`、`Repositories` 这类正常词条照常翻译。

### 整句一致性

同一个容器（如 `<p>`）里，如果既有能翻的片段、又有翻不了的英文片段，且拼起来像一句完整的话（≥5 个词、以句号/问号/叹号结尾），就**整段保持英文**。

只是标签行（`Labels` + 自定义标签名）不会被误伤——它不满足「像句子」的条件。

想临时关掉：

```js
__GH_ZH__.setStrictSentences(false)   // 允许半翻
__GH_ZH__.setStrictSentences(true)    // 恢复一致性优先（默认）
```

### 顺带修掉的 bug

- `1 repository` 翻不出来：正则把 `repositories?` 写错成「repositorie + s」，改成 `repositor(y|ies)`
- `：Aug 7, 2025` 这种残片：上版为了解决「更新时间 on Oct 4」加了 `on <date>` → `：<date>`，单独成节点时就成了残片，已换成日期本地化
- `Description .` / `Name .`：独立句号节点现在直接跳过

### 检测器升级

同一份清单从 300 条压到几十条：

| 改进 | 说明 |
| --- | --- |
| 模式折叠 | `No contributions on <日期>.` 这类 365 种变体，加了规则后一次性消失 |
| 整句分组 | 被拆散的句子按「整句」上报一次，不再逐碎片刷屏 |
| 噪声过滤 | 时间戳、语言名（Python / C++ / Kotlin…）、版权行、快捷键、纯大写短词一律不报 |
| 建议列 | 每条标 `规则` / `词条` / `碎片`，一眼看出该怎么补 |

清单格式：

```
次数	来源	建议	原文
3	整句	碎片	You can totally unknown trailing words here.
1	文本	词条	Some brand new label text
```

## 1.3.1 更新重点

修复 Android WebView（Via 等）长按按钮会选中「中」字、弹不出清单的问题：

- 按钮与宿主元素显式 `user-select: none`（`all: unset` 会把它重置成 `auto`，这是根因）
- `-webkit-touch-callout: none`、`-webkit-tap-highlight-color: transparent`、`touch-action: manipulation`
- 捕获阶段拦截 `selectstart` / `dragstart` / `contextmenu`
- 兜底：浏览器抢走手势时只发 `pointercancel`，此时若已按住够久，照样打开清单
- 阈值区分设备：手指 500ms、鼠标 650ms；滑动超过 8px 取消

## 1.3.0 更新重点

自带漏翻检测：长按「中」按钮（电脑右键）打开清单，点「复制」把清单发给作者即可补词库。

## 1.2.0 更新重点

补齐移动端侧栏、仪表盘 / Copilot、星标筛选、个人资料设置；新增「字段：值」下拉规则（`Type: All` → `类型：全部`）。

## 1.1.0 更新重点

「中 / EN」开关改为即时切换不再刷新；支持开放 Shadow DOM；修复跳过区误翻；属性翻译支持 `input` 按钮 `value`。

## 功能特性

| 能力 | 说明 |
| --- | --- |
| 离线词库 | 1276 条界面文案，覆盖导航、仓库页签、代码页、Releases、发行版编辑、文件查看器、议题、拉取请求、通知收件箱、Feed 动态、搜索页、设置、个人资料、Copilot 等 |
| 动态规则 | 100 条，覆盖数量、相对时间、日期、反应、星标数、语言筛选、Most/Fewest 排序、分页、面包屑、提交、文件行数、分支状态、时间线事件、空列表等 |
| 属性翻译 | `title`、`aria-label`、`placeholder`，以及 `input[type=submit/button/reset]` 的 `value` |
| 动态内容 | `MutationObserver` 跟踪动态加载、下拉菜单、弹窗与 Turbo / pjax 导航；同时观察开放 Shadow DOM |
| 安全跳过 | 代码块、Markdown 正文、议题 / PR 标题、文件树、提交信息、分支名、用户名、个人简介等用户内容 |
| 中 / EN 开关 | 右下角按钮即时切换，不刷新页面；状态存 `localStorage` |
| 零权限 | `@grant none`，不使用 GM API，不发起网络请求，不收集数据 |

## 安装

### 推荐：从链接安装（支持自动更新）

1. 安装脚本管理器：[Tampermonkey](https://www.tampermonkey.net/)（Chrome / Edge / Firefox / **Kiwi、Lemur 等支持扩展的移动浏览器**）或 [Violentmonkey](https://violentmonkey.github.io/)。
2. 打开 raw 链接：<https://raw.githubusercontent.com/jychen089/github-zh/main/github-zh.user.js>
   - 如果只显示一堆代码：Tampermonkey 面板 → **实用工具 / Utilities** → **Install from URL** → 粘贴链接 → 安装。
3. 打开 https://github.com 并刷新页面。

装好后 Tampermonkey 会按 `@updateURL` 自动检查新版本（默认每天一次），无需手动升级。

### 备选：手动粘贴

1. 打开脚本管理器，新建脚本，把 `github-zh.user.js` 全部内容粘贴进去，保存。
2. 打开 https://github.com 并刷新页面。

> 手动粘贴的副本没有更新地址，不会自动升级。

安装或更新后都需要刷新一次 GitHub 页面才会生效。

### 发布与更新流程

1. 修改 `github-zh.user.js`
2. 递增头部的 `@version`（必须比线上大）
3. 提交到仓库 `main` 分支
4. 用户端 Tampermonkey 会在下次检查时自动更新

> 不要修改 `@name` 与 `@namespace`，否则会被当成新脚本，而不是升级。

## 使用

- **默认开启**：进入 GitHub 自动汉化。
- **即时切换**：点右下角「中」按钮立即还原英文，再点立即汉化，不刷新页面。
- **漏翻清单**：手机长按「中」按钮 0.5 秒；电脑右键按钮。
- **状态保存**：`localStorage` 的 `gh-zh:enabled`（`1` 开启 / `0` 关闭）。

### 控制台接口

```js
__GH_ZH__.version                        // '1.7.2'
__GH_ZH__.setEnabled(false)              // 立即还原英文
__GH_ZH__.translateAll()                 // 重新扫描整页
__GH_ZH__.restoreAll()                   // 还原所有已翻译内容
__GH_ZH__.setStrictSentences(false)      // 关闭整句一致性（允许半翻）
__GH_ZH__.translateText('Pull requests') // '拉取请求'
Object.keys(__GH_ZH__.dict).length       // 1276

// 漏翻检测
__GH_ZH__.findMissing()
__GH_ZH__.missingReport()
__GH_ZH__.missingReport({ asDict: true })
__GH_ZH__.copyMissing()
__GH_ZH__.showMissingPanel()
```

## 词库维护流程（重要）

脚本采用「**要么整句翻，要么整句留英文**」的策略，所以看到一整句英文时，通常不是没收录，而是**还差一两块碎片**。

补词库的正确顺序：

1. 长按「中」按钮 → 复制清单
2. 看「来源」列：
   - `文本` → 完整标签，直接加 `'原文': '译文'`
   - `整句` → 句子被拆散了，**只补缺的那几个碎片**，不要试图整句塞进词库
   - `属性:xxx` → 加到 `DICT` 即可，属性翻译会命中
3. 保存后刷新页面；整句一旦所有碎片都齐了，会自动整句翻出来

例子：

```
1	整句	碎片	You can mention other users and organizations to link to them.
```

说明缺的是 `You can` 或后半句，在 `DICT` 里补上对应碎片，句子就通了。

## 不翻译的区域

- `<pre>`、`<code>`、`<textarea>`、`contenteditable`（控件的 `placeholder` / `aria-label` 仍翻）
- `.markdown-body`、`[data-testid="markdown-body"]`、`[data-testid="issue-body"]`、`[data-testid="comment-body"]`
- 议题 / PR 标题、提交信息、文件树（`role="tree"`）、`table.files`
- 分支名、主题标签、用户名 / 团队提及、仓库简介、个人简介
- 代码编辑器 `.cm-editor`、`.monaco-editor`、`.CodeMirror`
- 绝对时间戳、编程语言名、版权行、快捷键记号、量词残片、虚词、纯标点

想临时保护某个元素，加 `data-gh-zh-skip` 属性即可。

## 已知限制

- 词库不可能覆盖全部文案；未收录的保留英文。
- 一句话被拆到多个标签时，必须靠碎片补全才能整句翻；缺一块就整句英文（这是刻意设计，避免中英混排）。
- 日期里的月份会本地化，但**带时刻的时间戳原样保留**。
- 仅支持开放的 Shadow DOM；`closed` 模式无法访问。
- 仅支持 `github.com`，不含 GitHub Enterprise、`gist.github.com` 与 GitHub 原生 App。

## 开发与测试

检查语法与词库重复键：

```powershell
node --check github-zh.user.js
```

### 本版验证情况

在无浏览器的沙箱中完成：

- 语法解析通过；词库 1148 条无重复键；动态规则 93 条
- 1.6.1 按截图逐项核对：Filter: / Fewest stars / Fewest forks / Save your search / View search docs / Provide feedback 全部命中
- 1.6.2 抽样 29 项：24 条词条命中，3 条用户内容/快捷键正确不翻；检测器只报真实缺口
- 1.7.0 抽样 92 项全部命中；文件大小 / 快捷键 / Markdown 等噪声不上报
- 1.7.1 复核上一份 28 条清单：21 条已能翻，5 条属用户内容/快捷键正确不翻，仅 `docs, (Directory)` 需新增过滤
- 1.7.0 整句回归：拆散的发行版说明两句都能整句成型，还原正常
- 1.6.0 抽样 27 项全部命中（搜索页词条、语言筛选、分页、k 缩略结果数）
- 1.6.0 回归 8 项通过（含 emoji 前缀、日期、反应、分页）
- 检测器：已通句子不再上报，用户名 / 计时类噪声全部过滤
- 碎片保护仍生效：`and` / `to` / `.` / `followers` / `enter` / `( g then d )` / `terryhu` / `4.8k` 均不翻译
- 翻译抽样 15 项：`1 repository`、`No contributions on November 16th.`、`on Oct 4`、`Aug 7, 2025`、`updated on Oct 4`、`0 open and 0 closed projects found.`、`160 remaining`、`Link to social profile 2` 等
- 碎片保护：`and` / `to` / `.` / `followers` / `items` / `enter` / `g then d` 均不翻译
- 整句一致性：半通顺句子保持英文；词库齐备后自动整句翻译；`setStrictSentences(false/true)` 可来回切换并正确回退
- 标签行（`Labels` + `bug`）不被整句规则误伤
- 检测器：整句分组去重（同句 3 处 → 1 条 count=3）、噪声全部过滤

**尚未在真实浏览器上跑自动化测试**，建议人工验收：

1. 贡献图悬浮提示是否显示「11 月 16 日没有贡献」
2. 星标页筛选 `Type: All` / `Sort by: Recently starred` 是否汉化
3. 长按「中」按钮不选中文字，直接弹出清单
4. 打开个人资料页，确认没有出现中英混排的残句

## 更新日志

### 1.7.2

- 加入 `@updateURL` / `@downloadURL`，支持从 GitHub 在线安装与自动更新
- 补充 `@homepageURL` / `@supportURL`

### 1.7.1

- 漏翻清单面板与报告首行显示当前版本号
- 目录 / 符号链接标签（`docs, (Directory)`）不再上报

### 1.7.0

- 补齐发行版编辑页、Markdown 工具栏、文件查看器约 90 条词条
- 新增 3 条规则：文件行数、附件大小限制、资产数量上限
- 新增“连接词”与“中文句尾标点”处理，拆散句子更通顺
- 检测器：文件大小（10 KB / 2GB）不再作为缺口上报
- 词库 1173 → 1276 条，规则 97 → 100 条

### 1.6.2

- 补齐仓库代码页 / Releases 页 24 条词条
- 新增 4 条规则：面包屑、Commit 哈希、commits by、分支名
- 检测器：提交信息（`/commit/` 链接）、文件名标签、组合键不再上报
- 词库 1148 → 1173 条，规则 93 → 97 条

### 1.6.1

- 补齐搜索页排序下拉：Fewest stars、Fewest forks、Save your search、View search docs、Provide feedback 等
- `Most X` / `Fewest X` 合并为一条排序规则，覆盖 12 种名词
- 词库 1141 → 1148 条，规则 92 → 93 条

### 1.6.0

- 补齐搜索页 23 条词条（External links、Date created、Owner、Pagination 等）
- 新增 4 条规则：`3.2k results`、`X language`、`Page N`、搜索计时
- 补上搜索框快捷键提示的碎片，整句可翻
- 检测器：整句覆盖率检查（已通的句子不再上报）、用户名启发
- 词库 1118 → 1141 条，规则 88 → 92 条

### 1.5.0

- 补齐通知收件箱、Feed 动态、仓库页三块共 67 条词条
- 新增 6 条规则（反应、星标数、排序、不感兴趣）
- emoji 前缀不再阻碍词库匹配（`✋ Mentioned` → `✋ 提及`）
- 修复检测器 5 类误报，并跳过更新日志链接与 Feed 仓库描述
- 按用户决定：反应名、`released`、空收件箱口号不翻
- 词库 1051 → 1118 条，规则 79 → 88 条

### 1.4.0

- 新增碎片保护（虚词、标点、量词残片、快捷键记号）
- 新增整句一致性策略，半通顺整句保持英文，可用 `setStrictSentences()` 切换
- 日期本地化：`Oct 4` → `10 月 4 日`，`Aug 7, 2025` → `2025 年 8 月 7 日`
- 绝对时间戳（带时刻/时区）不翻译
- 修复 `1 repository` 不翻译的正则笔误
- 修复 `：Aug 7, 2025` 残片
- 检测器：整句分组、噪声过滤、建议列
- 词库 975 → 1051 条，规则 74 → 79 条

### 1.3.1

- 修复手机长按选中「中」字

### 1.3.0

- 新增漏翻检测与清单面板

### 1.2.0

- 补齐移动端、Copilot、星标、个人资料设置

### 1.1.0

- 即时切换、Shadow DOM、性能优化

### 1.0.0

- 首个版本

## 许可证

MIT
