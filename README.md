# GitHub 中文化

把 GitHub 网页界面汉化成简体中文的 Tampermonkey / Violentmonkey 用户脚本。纯离线词库，不联网、不读取账号数据，安装后打开 `github.com` 自动生效。

- **版本**：1.8.2
- **词库**：1422 条词条 + 117 条动态规则
- **适用站点**：`https://github.com/*`（桌面端 + 移动端网页）
- **许可证**：MIT

## 一键安装

装好 [Tampermonkey](https://www.tampermonkey.net/) 后，打开这个链接：

**<https://raw.githubusercontent.com/Clevsr/github-zh/main/github-zh.user.js>**

如果只显示一堆代码，就用 Tampermonkey 面板 → 实用工具 → Install from URL，粘贴同一链接。

装完刷新一次 GitHub 页面即可。之后脚本会自动检查更新。

## 它能做什么

| 能力 | 说明 |
| --- | --- |
| 离线词库 | 1422 条界面文案，覆盖导航、仓库、议题、拉取请求、通知、Feed、搜索、设置、Copilot 等 |
| 动态规则 | 117 条，处理数量、相对时间、日期、排序、分页、图表描述等带变量的文案 |
| 属性翻译 | `title`、`aria-label`、`placeholder`、`input` 按钮的 `value` |
| 即时切换 | 右下角「中 / EN」按钮一键切换，**不刷新页面**，状态自动保存 |
| 动态内容 | 跟踪 GitHub 的动态加载、下拉菜单、弹窗与 Turbo 单页导航 |
| 安全跳过 | 代码块、README 正文、议题标题、文件名、用户名等用户内容一律不动 |
| 零权限 | `@grant none`，不使用 GM API，不发起网络请求 |

## 快速上手

1. 安装 Tampermonkey（Edge / Chrome / Firefox，或 Kiwi、Lemur 等支持扩展的手机浏览器）
2. 从上面的链接安装脚本，然后刷新 GitHub
3. 右下角出现「中」按钮即生效；点一下切英文，再点切回中文

## 文档

| 文档 | 内容 |
| --- | --- |
| [使用教程](docs/USAGE.md) | 安装细节、开关、控制台接口、自定义词库、不翻译区域、开发与测试 |
| [漏翻反馈](docs/FEEDBACK.md) | 怎么打开漏翻清单、清单怎么读、哪些内容不该翻、怎么提交 |
| [更新日志](docs/CHANGELOG.md) | 从 1.0.0 到 1.8.2 的全部变更记录 |

## 目录结构

```
github-zh.user.js        # 油猴脚本主文件
README.md                # 本页（项目概览）
docs/
  USAGE.md               # 使用教程
  FEEDBACK.md            # 漏翻反馈指南
  CHANGELOG.md           # 更新日志
```

## 许可证

MIT
