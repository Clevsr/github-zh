# 更新日志

版本号遵循 `MAJOR.MINOR.PATCH`，每次发布必须递增 `@version`，否则 Tampermonkey 不会更新。

## 1.8.2

- 修时间戳闪烁：「刚刚 / 16 分钟前」不再在中文与英文之间来回跳
- 时间组件改写文本时当场翻译，不再等 60ms 批次，英文来不及上屏
- 修正「自己改的」标记误判，页面紧跟着又改内容时会重新翻译
（AI虽然说不会了，但其实还是会的）

## 1.8.1

- 补齐文件页「更多」菜单：Raw file content、Ask about this file、View options、Wrap lines、Center content 等
- 快捷键识别支持带括号和空格的写法（`( alt shift r )`）
- 检测器能识别当前用户名 / 仓库所有者，`Clevsr` 这类文本不再上报
- 清理 90 条重复词条定义
- 词库 1413 → 1422 条，规则 117 条

## 1.8.0

- 项目迁移到 `Clevsr/github-zh`，更新地址同步修改
- 补齐账户设置页约 50 条词条：Change username、Delete account、Successor settings、Billing and licensing 等
- 补齐贡献图约 40 条词条：月份 / 星期全称与缩写、贡献强度说明、活动概览提示
- 新增规则：贡献数、贡献活动分页、创建仓库/提交、导出账户数据、注销计费提示
- 清理了 18 条重复的规则定义
- 词库 1293 → 1413 条，规则 106 → 117 条

## 1.7.3

- 补齐 Insights / Pulse 页词条：Active issues、Active pull requests、Merged pull requests、Top committers、Chart options 等
- 新增规则：`1 week` 时间跨度、日期范围、图表无障碍描述、`On main ,`
- 多词短语支持忽略大小写（修复 `Community standards` 无法匹配 `Community Standards`）
- 词库 1276 → 1293 条，规则 100 → 106 条

## 1.7.2

- 加入 `@updateURL` / `@downloadURL`，支持从 GitHub 在线安装与自动更新
- 补充 `@homepageURL` / `@supportURL`
- README 增加发布与更新流程

## 1.7.1

- 漏翻清单面板与报告首行显示当前版本号
- 目录 / 符号链接标签（`docs, (Directory)`）不再上报

## 1.7.0

- 补齐发行版编辑页、Markdown 工具栏、文件查看器约 90 条词条
- 新增 3 条规则：文件行数、附件大小限制、资产数量上限
- 新增「连接词」与「中文句尾标点」处理，拆散句子更通顺
- 检测器：文件大小（`10 KB` / `2GB`）不再作为缺口上报
- 词库 1173 → 1276 条，规则 97 → 100 条

## 1.6.2

- 补齐仓库代码页 / Releases 页 24 条词条
- 新增 4 条规则：面包屑、Commit 哈希、commits by、分支名
- 检测器：提交信息（`/commit/` 链接）、文件名标签、组合键不再上报
- 词库 1148 → 1173 条，规则 93 → 97 条

## 1.6.1

- 补齐搜索页排序下拉：Fewest stars、Fewest forks、Save your search、View search docs、Provide feedback 等
- `Most X` / `Fewest X` 合并为一条排序规则，覆盖 12 种名词
- 词库 1141 → 1148 条，规则 92 → 93 条

## 1.6.0

- 补齐搜索页 23 条词条（External links、Date created、Owner、Pagination 等）
- 新增 4 条规则：`3.2k results`、`X language`、`Page N`、搜索计时
- 补上搜索框快捷键提示的碎片，整句可翻
- 检测器：整句覆盖率检查（已通的句子不再上报）、用户名启发
- 词库 1118 → 1141 条，规则 88 → 92 条

## 1.5.0

- 补齐通知收件箱、Feed 动态、仓库页三块共 67 条词条
- 新增 6 条规则（反应、星标数、排序、不感兴趣）
- emoji 前缀不再阻碍词库匹配（`✋ Mentioned` → `✋ 提及`）
- 修复检测器 5 类误报，并跳过更新日志链接与 Feed 仓库描述
- 词库 1051 → 1118 条，规则 79 → 88 条

## 1.4.0

- 新增碎片保护（虚词、标点、量词残片、快捷键记号）
- 新增整句一致性策略，半通顺整句保持英文，可用 `setStrictSentences()` 切换
- 日期本地化：`Oct 4` → `10 月 4 日`，`Aug 7, 2025` → `2025 年 8 月 7 日`
- 绝对时间戳（带时刻/时区）不翻译
- 修复 `1 repository` 不翻译的正则笔误
- 修复 `：Aug 7, 2025` 残片
- 检测器：整句分组、噪声过滤、建议列
- 词库 975 → 1051 条，规则 74 → 79 条

## 1.3.1

- 修复 Android WebView（Via 等）长按按钮会选中「中」字、弹不出清单的问题
- 按钮与宿主元素显式 `user-select: none`，并拦截 `selectstart` / `dragstart` / `contextmenu`
- 新增「手势被抢」兜底：`pointercancel` 时若已按住够久，依然打开清单
- 长按阈值区分设备：手指 500ms、鼠标 650ms；滑动超过 8px 自动取消
- 无 Pointer Events 的旧 WebView 自动改用 `touch` 事件

## 1.3.0

- 新增漏翻检测：`findMissing()` / `missingReport()` / `copyMissing()` / `showMissingPanel()`
- 长按（手机）或右击（电脑）右下角「中」按钮可打开漏翻清单
- 复制优先 `navigator.clipboard`，失败回退 `textarea + execCommand`
- 只报「像界面英文」的文案，排除标识符、文件名、URL、日期、数字与用户内容

## 1.2.0

- 词库 844 → 975 条，动态规则 69 → 74 条
- 新增移动端侧栏、仪表盘 / Copilot、星标筛选、个人资料设置等界面
- 新增「字段：值」下拉规则、问候语规则、空列表规则、日期片段规则
- `contenteditable` 控件的 `placeholder` / `aria-label` 也会翻译
- 修复「更新时间 on Oct 4」这类只翻一半的日期文案

## 1.1.0

- 「中 / EN」开关改为即时切换，不再刷新页面；原文备份在内存中，关闭时逐字还原
- 支持开放 Shadow DOM，覆盖 `relative-time`、`clipboard-copy` 等组件
- 修复动态插入到代码 / 用户内容区域的文本被误翻的问题
- 属性翻译新增 `input` 按钮 `value`，并监听属性变化
- 文本与属性合并为一次遍历；增加翻译缓存与已翻译节点跳过
- 新增分支名、主题标签、用户名、评论正文、代码编辑器等跳过规则

## 1.0.0

- 首个版本：480 条离线词库、24 条动态规则
- 属性翻译（`title` / `aria-label` / `placeholder`）
- `MutationObserver` 跟踪动态内容
- 右下角「中 / EN」开关（切换会刷新页面）
