# 使用教程

## 安装

### 方式一：从链接安装（推荐，支持自动更新）

1. 安装脚本管理器：
   - 桌面：[Tampermonkey](https://www.tampermonkey.net/)（Edge / Chrome / Firefox）或 [Violentmonkey](https://violentmonkey.github.io/)
   - 手机：Kiwi、Lemur 等支持扩展的浏览器
2. 打开安装链接：
   <https://raw.githubusercontent.com/Clevsr/github-zh/main/github-zh.user.js>
   - 正常会弹出 Tampermonkey 安装页，点「安装」
   - 如果只显示代码：Tampermonkey 面板 → **实用工具 / Utilities** → **Install from URL** → 粘贴链接 → 安装
3. 打开 https://github.com 并刷新页面

装好后脚本会自动对比 `@version` 并升级，默认每天检查一次。

### 方式二：手动粘贴（不会自动更新）

1. 打开 Tampermonkey 面板 → 新建脚本
2. 用 `github-zh.user.js` 的全部内容覆盖模板
3. `Ctrl + S` 保存，刷新 GitHub

> 手动粘贴的副本没有更新地址，不会自动升级。

### 第一次没反应？

| 现象 | 原因 | 解决 |
| --- | --- | --- |
| 没有「中」按钮 | Edge/Chrome 未允许用户脚本 | `edge://extensions` → Tampermonkey → 详细信息 → 打开「允许用户脚本」 |
| 有按钮但页面全英文 | 站点访问权限是「单击时」 | 改成「在所有站点上」 |
| 控制台 `__GH_ZH__` 未定义 | 脚本没注入 | 确认地址是 `github.com`，不是 gist 或企业版域名 |
| 旧标签页没变化 | 脚本只在加载时运行 | 刷新页面 |
| 更新后仍是旧版本 | 装了两份脚本 | 管理面板里删掉旧的那份，只留一条 |

## 日常使用

- **默认开启**：进入 GitHub 自动汉化
- **即时切换**：点右下角「中」按钮 → 立即还原英文；再点 → 立即汉化。不刷新页面，未提交的输入不会丢
- **状态保存**：`localStorage` 的 `gh-zh:enabled`（`1` 开启 / `0` 关闭），清除该项恢复默认开启
- **漏翻清单**：手机长按「中」按钮 0.5 秒；电脑右键按钮。详见 [漏翻反馈](FEEDBACK.md)

## 控制台接口

`F12` → Console：

```js
__GH_ZH__.version                        // '1.8.2'
__GH_ZH__.setEnabled(false)              // 立即还原英文
__GH_ZH__.setEnabled(true)               // 立即汉化
__GH_ZH__.translateAll()                 // 重新扫描整页
__GH_ZH__.restoreAll()                   // 还原所有已翻译内容
__GH_ZH__.setStrictSentences(false)      // 关闭整句一致性（允许半翻）
__GH_ZH__.translateText('Pull requests') // '拉取请求'
Object.keys(__GH_ZH__.dict).length       // 1422

// 漏翻检测
__GH_ZH__.findMissing()
__GH_ZH__.missingReport()
__GH_ZH__.missingReport({ asDict: true })
__GH_ZH__.copyMissing()
__GH_ZH__.showMissingPanel()
```

## 自定义词库

词条都在脚本顶部的 `DICT` 对象里，格式为 `'英文原文': '中文译文'`：

```js
const DICT = {
  'Pull requests': '拉取请求',
  'All issues': '所有议题',
  'My custom label': '我的自定义文案',
  ...
};
```

- 匹配是**整段精确匹配**；含空格的短语会忽略大小写（`Community standards` 能匹配 `Community Standards`），单个单词仍然区分大小写
- 带变量的文案在 `PATTERNS` 数组里，按顺序匹配正则
- 词库启动时 `Object.freeze`，运行时不能动态添加，需要改源码
- 翻译结果有 2000 条上限的内存缓存

## 不翻译的区域

以下区域被视为代码或用户内容，脚本会主动跳过：

- `<pre>`、`<code>`、`<textarea>`、`contenteditable`（控件的 `placeholder` / `aria-label` 仍翻）
- `.markdown-body`、`[data-testid="markdown-body"]`、`[data-testid="issue-body"]`、`[data-testid="comment-body"]`
- 议题 / PR 标题、提交信息、文件树（`role="tree"`）、`table.files`
- 分支名、主题标签、用户名 / 团队提及、仓库简介、个人简介
- 代码编辑器 `.cm-editor`、`.monaco-editor`、`.CodeMirror`
- 绝对时间戳、编程语言名、版权行、快捷键记号、量词残片、虚词、纯标点

想临时保护某个元素，给它加 `data-gh-zh-skip` 属性即可。

## 已知限制

- 词库不可能覆盖全部文案；未收录的保留英文
- 一句话被拆到多个标签时，必须靠碎片补全才能整句翻；缺一块就整句英文（刻意设计，避免中英混排）
- 日期会本地化，但**带时刻的绝对时间戳原样保留**
- 仅支持开放的 Shadow DOM；`closed` 模式无法访问
- 仅支持 `github.com`，不含 GitHub Enterprise、`gist.github.com` 与 GitHub 原生 App

## 开发与测试

脚本是独立 IIFE，无构建步骤。

```powershell
node --check github-zh.user.js
```

本版在无浏览器沙箱中完成的检查：

- 语法解析通过；词库 1422 条无重复键；动态规则 117 条
- 抽样覆盖词条、emoji 前缀、日期、反应、排序、分页、图表描述
- 模拟 DOM 验证：文本 / 属性翻译、Shadow DOM、跳过区、整句一致性、即时还原
- 检测器：噪声过滤、整句分组去重

尚未在真实浏览器上跑自动化测试，建议人工验收：

1. 贡献图悬浮提示显示「11 月 16 日没有贡献」
2. 搜索页 `Type: All`、`Sort by: Recently starred` 已汉化
3. 长按「中」按钮不选中文字，直接弹出清单
4. 个人资料页没有中英混排的残句
