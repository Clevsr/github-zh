// ==UserScript==
// @name         GitHub 中文化
// @namespace    https://github.com/dsh-local/github-zh
// @version      1.8.1
// @description  将 GitHub 网页界面汉化为简体中文：内置离线词库，覆盖仓库、议题、拉取请求、通知、设置等常用界面，支持动态加载、Shadow DOM 与单页导航，右下角「中/EN」按钮可即时切换、无需刷新。
// @author       Clevsr
// @homepageURL  https://github.com/Clevsr/github-zh
// @supportURL   https://github.com/Clevsr/github-zh/issues
// @updateURL    https://raw.githubusercontent.com/Clevsr/github-zh/main/github-zh.user.js
// @downloadURL  https://raw.githubusercontent.com/Clevsr/github-zh/main/github-zh.user.js
// @match        https://github.com/*
// @run-at       document-start
// @grant        none
// @noframes
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  if (window.__GH_ZH__) return; // 防止同一页面被重复注入

  const VERSION = '1.8.1';
  const STORAGE_KEY = 'gh-zh:enabled';
  const IS_GITHUB = /(^|\.)github\.com$/.test(location.hostname) || window.__GH_ZH_FORCE__ === true;
  if (!IS_GITHUB) return;

  /* ================================================================== *
   * 1. 离线词库：英文界面文案 → 简体中文
   *    只做「整段精确匹配」（区分大小写），避免误伤仓库名、代码和用户内容
   * ================================================================== */

  const DICT = {
    // ---- 全局导航 ----
    'Dashboard': '仪表盘',
    'Pull requests': '拉取请求',
    'Issues': '议题',
    'Codespaces': '代码空间',
    'Marketplace': '市场',
    'Explore': '探索',
    'Notifications': '通知',
    'Settings': '设置',
    'Sign in': '登录',
    'Sign up': '注册',
    'Sign out': '退出登录',
    'Search or jump to...': '搜索或跳转到…',
    'Search or jump to…': '搜索或跳转到…',
    'Search GitHub': '搜索 GitHub',
    'Search': '搜索',
    'Search repositories': '搜索仓库',
    'New repository': '新建仓库',
    'New gist': '新建 Gist',
    'New organization': '新建组织',
    'New project': '新建项目',
    'New codespace': '新建代码空间',
    'Your repositories': '你的仓库',
    'Your organizations': '你的组织',
    'Your projects': '你的项目',
    'Your stars': '你的星标',
    'Your gists': '你的 Gist',
    'Your profile': '你的个人资料',
    'Your work': '你的工作',
    'Upgrade': '升级',
    'Help': '帮助',
    'Community': '社区',
    'Support': '支持',
    'Documentation': '文档',
    'Docs': '文档',
    'Blog': '博客',
    'Contact': '联系我们',
    'Pricing': '定价',
    'Status': '状态',
    'About': '关于',
    'Terms': '条款',
    'Privacy': '隐私',
    'Training': '培训',
    'Shop': '商店',
    'Manage cookies': '管理 Cookie',
    'Do not share my personal information': '不要共享我的个人信息',
    'Skip to content': '跳转到内容',
    'Product': '产品',
    'Solutions': '解决方案',
    'Open Source': '开源',
    'Enterprise': '企业',
    'Team': '团队',
    'Trending': '趋势',
    'Collections': '集合',
    'Topics': '主题',
    'Events': '事件',
    'GitHub Sponsors': 'GitHub 赞助',
    'Mobile': '移动端',
    'Feature preview': '功能预览',

    // ---- 仓库页签 ----
    'Code': '代码',
    'Actions': '操作',
    'Projects': '项目',
    'Wiki': '维基',
    'Security': '安全',
    'Insights': '洞察',
    'Discussions': '讨论',
    'Packages': '软件包',
    'Environments': '环境',
    'Deployments': '部署',
    'Pulse': '动态',
    'Contributors': '贡献者',
    'Community Standards': '社区标准',
    'Traffic': '流量',
    'Commits': '提交',
    'Code frequency': '代码频率',
    'Dependency graph': '依赖关系图',
    'Network': '网络',
    'Forks': '复刻',
    'Releases': '发行版',
    'Tags': '标签',
    'Branches': '分支',
    'Milestones': '里程碑',
    'Labels': '标签',
    'Watchers': '关注者',
    'Stars': '星标',

    // ---- 仓库操作 ----
    'Watch': '关注',
    'Unwatch': '取消关注',
    'Watching': '关注中',
    'Star': '星标',
    'Unstar': '取消星标',
    'Starred': '已星标',
    'Fork': '复刻',
    'Unfork': '取消复刻',
    'Clone': '克隆',
    'Download ZIP': '下载 ZIP',
    'Open with GitHub Desktop': '使用 GitHub Desktop 打开',
    'Go to file': '转到文件',
    'Add file': '添加文件',
    'Create new file': '新建文件',
    'Upload files': '上传文件',
    'Find file': '查找文件',
    'Edit': '编辑',
    'Edit file': '编辑文件',
    'Edit this file': '编辑此文件',
    'Delete file': '删除文件',
    'Commit changes': '提交更改',
    'Create branch': '创建分支',
    'Switch branches/tags': '切换分支/标签',
    'Compare': '比较',
    'Compare & pull request': '比较并创建拉取请求',
    'Contribute': '贡献',
    'Back to repository': '返回仓库',
    'Use this template': '使用此模板',
    'Browse files': '浏览文件',
    'More options': '更多选项',
    'More file actions': '更多文件操作',
    'View raw': '查看原始文件',
    'Raw': '原始',
    'Blame': '追溯',
    'History': '历史',
    'Copy': '复制',
    'Copy path': '复制路径',
    'Copy raw file': '复制原始文件',
    'Download raw file': '下载原始文件',
    'Copied!': '已复制！',
    'Copy link': '复制链接',
    'Copy permalink': '复制永久链接',
    'Expand all': '全部展开',
    'Collapse all': '全部折叠',
    'Show all': '显示全部',
    'Show more': '显示更多',
    'Show less': '显示更少',
    'Load more': '加载更多',
    'Learn more': '了解更多',
    'Read more': '阅读更多',
    'Get started': '开始使用',
    'Join': '加入',
    'Continue': '继续',
    'Next': '下一步',
    'Previous': '上一步',
    'Back': '返回',
    'Confirm': '确认',
    'Save': '保存',
    'Save changes': '保存更改',
    'Cancel': '取消',
    'Update': '更新',
    'Delete': '删除',
    'Rename': '重命名',
    'Transfer': '转移',
    'Archive': '归档',
    'Unarchive': '取消归档',
    'Disable': '禁用',
    'Enable': '启用',
    'Manage': '管理',
    'Configure': '配置',
    'Invite': '邀请',
    'Add': '添加',
    'Add people': '添加人员',
    'Members': '成员',
    'Teams': '团队',
    'Remove': '移除',
    'Apply': '应用',
    'Clear': '清除',
    'Clear filter': '清除筛选',
    'Filter': '筛选',
    'Sort': '排序',
    'All': '全部',

    // ---- 议题 ----
    'Open': '打开',
    'Closed': '已关闭',
    'Author': '作者',
    'Assignee': '负责人',
    'Assignees': '负责人',
    'Label': '标签',
    'No one assigned': '未指派',
    'No labels': '无标签',
    'No projects': '无项目',
    'No milestone': '无里程碑',
    'Development': '开发',
    'Participants': '参与者',
    'Subscribe': '订阅',
    'Unsubscribe': '取消订阅',
    'Mute': '静音',
    'Unmute': '取消静音',
    'Pin': '置顶',
    'Unpin': '取消置顶',
    'Lock conversation': '锁定对话',
    'Unlock conversation': '解锁对话',
    'Close issue': '关闭议题',
    'Close with comment': '关闭并评论',
    'Close as completed': '作为已完成关闭',
    'Close as not planned': '作为未计划关闭',
    'Reopen issue': '重新打开议题',
    'Delete issue': '删除议题',
    'Transfer issue': '转移议题',
    'New issue': '新建议题',
    'Search all issues': '搜索所有议题',
    'No results': '无结果',
    'Created by me': '由我创建',
    'Assigned to me': '指派给我',
    'Mentioned': '提及',
    'Review requested': '请求审查',
    'Recently updated': '最近更新',
    'Most commented': '评论最多',
    'Most reactions': '反应最多',
    'Newest': '最新',
    'Oldest': '最早',
    'Best match': '最佳匹配',
    'Most stars': '星标最多',
    'Most forks': '复刻最多',
    'Comment': '评论',
    'Comments': '评论',
    'Add a comment': '添加评论',
    'Write': '撰写',
    'Preview': '预览',
    'Reply': '回复',
    'Quote reply': '引用回复',
    'Edit comment': '编辑评论',
    'Delete comment': '删除评论',
    'Pin comment': '置顶评论',
    'Unpin comment': '取消置顶评论',
    'Hide comment': '隐藏评论',
    'Unhide comment': '取消隐藏评论',
    'Resolve conversation': '解决对话',
    'Unresolve conversation': '取消解决',
    'Report content': '举报内容',
    'Mark as spam': '标记为垃圾信息',

    // ---- 拉取请求 ----
    'Approve': '批准',
    'Request changes': '请求更改',
    'Review changes': '审查更改',
    'Reviewers': '审查者',
    'Add reviewers': '添加审查者',
    'Files changed': '文件变更',
    'Conversation': '对话',
    'Checks': '检查',
    'Draft': '草稿',
    'Ready for review': '准备就绪，等待审查',
    'Convert to draft': '转换为草稿',
    'Merge': '合并',
    'Merged': '已合并',
    'Merge pull request': '合并拉取请求',
    'Create pull request': '创建拉取请求',
    'New pull request': '新建拉取请求',
    'Squash and merge': '压缩并合并',
    'Rebase and merge': '变基并合并',
    'Confirm merge': '确认合并',
    'Confirm squash and merge': '确认压缩并合并',
    'Confirm rebase and merge': '确认变基并合并',
    'Add a title': '添加标题',
    'Add a description': '添加描述',
    'Commit message': '提交信息',
    'Extended description': '详细说明',
    'Propose changes': '提议更改',
    'Open a pull request': '发起拉取请求',
    'Close pull request': '关闭拉取请求',
    'Reopen pull request': '重新打开拉取请求',
    'Linked issues': '链接的议题',
    'Associate an issue': '关联议题',
    'Clear current search query, filters, and sorts': '清除当前搜索、筛选和排序',

    // ---- 仓库设置 / 账户设置 ----
    'General': '常规',
    'Rules': '规则',
    'Rulesets': '规则集',
    'Branch protection rules': '分支保护规则',
    'Default branch': '默认分支',
    'Merge button': '合并按钮',
    'Automatically delete head branches': '自动删除头分支',
    'Allow merge commits': '允许合并提交',
    'Allow squash merging': '允许压缩合并',
    'Allow rebase merging': '允许变基合并',
    'Access': '访问',
    'Manage access': '管理访问权限',
    'Invite a collaborator': '邀请协作者',
    'Billing': '账单',
    'Billing and plans': '账单和套餐',
    'Emails': '电子邮件',
    'Password and authentication': '密码和身份验证',
    'Sessions': '会话',
    'SSH and GPG keys': 'SSH 和 GPG 密钥',
    'Account': '账户',
    'Public profile': '公开资料',
    'Appearance': '外观',
    'Accessibility': '无障碍',
    'Developer settings': '开发者设置',
    'Applications': '应用',
    'Integrations': '集成',
    'GitHub Apps': 'GitHub 应用',
    'OAuth Apps': 'OAuth 应用',
    'Personal access tokens': '个人访问令牌',
    'Tokens (classic)': '令牌（经典）',
    'Fine-grained tokens': '细粒度令牌',
    'Generate new token': '生成新令牌',
    'Generate new token (classic)': '生成新令牌（经典）',
    'Organizations': '组织',
    'Repositories': '仓库',
    'People': '人员',
    'Audit log': '审计日志',
    'Member privileges': '成员权限',
    'Repository defaults': '仓库默认设置',
    'SAML single sign-on': 'SAML 单点登录',
    'Verified domains': '已验证的域名',
    'Code security': '代码安全',
    'Dependabot alerts': 'Dependabot 警报',
    'Code scanning': '代码扫描',
    'Secret scanning': '机密扫描',
    'Advisories': '安全公告',
    'Webhooks': 'Webhook',
    'Pages': '页面',
    'Secrets and variables': '机密和变量',
    'Actions secrets and variables': '操作机密和变量',
    'Custom properties': '自定义属性',
    'Danger zone': '危险区域',
    'Change repository visibility': '更改仓库可见性',
    'Transfer ownership': '转移所有权',
    'Archive this repository': '归档此仓库',
    'Unarchive this repository': '取消归档此仓库',
    'Delete this repository': '删除此仓库',
    'Repository visibility': '仓库可见性',
    'Template repository': '模板仓库',
    'Public': '公开',
    'Private': '私有',
    'Internal': '内部',
    'Public archive': '公开归档',
    'Private archive': '私有归档',
    'Forked from': '复刻自',
    'forked from': '复刻自',
    'No description, website, or topics provided.': '未提供描述、网站或主题。',
    'Use Git or checkout with SVN using the web URL.': '使用 Git，或通过网页 URL 使用 SVN 检出。',
    'Clone using the web URL.': '使用网页 URL 克隆。',
    'No releases published': '尚未发布任何发行版',
    'No packages published': '尚未发布任何软件包',
    'Latest': '最新',
    'Latest release': '最新发行版',
    'No releases': '暂无发行版',
    'Readme': '自述文件',
    'License': '许可证',
    'Security policy': '安全策略',
    'Code of conduct': '行为准则',
    'Contributing': '贡献指南',
    'Citation': '引用',
    'Activity': '活动',
    'Languages': '语言',
    'Report abuse': '举报滥用',
    'Verified': '已验证',
    'Unverified': '未验证',
    'Archived': '已归档',

    // ---- 个人资料 ----
    'Overview': '概览',
    'Home': '首页',
    'Feed': '动态',
    'For you': '为你推荐',
    'Discover': '发现',
    'Followers': '关注者',
    'Following': '正在关注',
    'Follow': '关注',
    'Unfollow': '取消关注',
    'Follows you': '关注了你',
    'Edit profile': '编辑个人资料',
    'Achievements': '成就',
    'Pinned': '置顶',
    'Contribution activity': '贡献活动',
    'Activity overview': '活动概览',
    'Contributions': '贡献',
    'Joined': '加入于',
    'Works for': '就职于',
    'Location': '位置',
    'Website': '网站',
    'Sponsor': '赞助',
    'Sponsors': '赞助者',
    'Popular repositories': '热门仓库',
    'Block or Report': '屏蔽或举报',
    'Block user': '屏蔽用户',
    'Report user': '举报用户',

    // ---- 通知 ----
    'Inbox': '收件箱',
    'Mark as read': '标记为已读',
    'Mark as done': '标记为完成',
    'Unread': '未读',
    'Saved': '已保存',
    'Participating': '参与中',
    'Mentions': '提及',
    'Subscribed': '已订阅',
    'Select all': '全选',
    'Filter notifications': '筛选通知',
    'Group by': '分组方式',
    'Reason': '原因',
    'Subject': '主题',
    'All notifications': '所有通知',
    'Email notifications': '电子邮件通知',
    'Notification settings': '通知设置',

    // ---- 搜索 ----
    'Search results': '搜索结果',
    'Advanced search': '高级搜索',
    'Users': '用户',
    'Look in': '查找范围',
    'In this repository': '在此仓库中',
    'In this organization': '在此组织中',
    'Filter by': '筛选条件',
    'Number of followers': '关注者数量',
    'Number of forks': '复刻数量',
    'Number of stars': '星标数量',
    'Size': '大小',
    'Updated': '更新时间',
    'Created': '创建时间',
    'Sort by': '排序方式',
    'Search syntax tips': '搜索语法提示',

    // ---- 通用状态 ----
    'Loading': '加载中',
    'Loading…': '加载中…',
    'Loading...': '加载中…',
    'Error': '错误',
    'Warning': '警告',
    'Success': '成功',
    'Failed': '失败',
    'Passed': '通过',
    'Pending': '待处理',
    'Skipped': '已跳过',
    'Queued': '排队中',
    'Neutral': '中立',
    'Try again': '重试',
    'Reload': '重新加载',
    'Something went wrong.': '出了点问题。',
    'Uh oh!': '哎呀！',
    'Dismiss': '忽略',
    'OK': '确定',
    'Yes': '是',
    'No': '否',
    'View': '查看',
    'View all': '查看全部',
    'See all': '查看全部',
    'Open in new tab': '在新标签页中打开',
    'Share': '分享',
    'Report': '举报',
    'Submit': '提交',
    'Done': '完成',
    'Welcome to GitHub': '欢迎来到 GitHub',

    // ---- 登录 / 发行版 / 其他常见界面 ----
    'Sign in to GitHub': '登录 GitHub',
    'Username or email address': '用户名或电子邮件地址',
    'Password': '密码',
    'Forgot password?': '忘记密码？',
    'Create an account': '创建账户',
    'Two-factor authentication': '双重身份验证',
    'Authentication code': '验证码',
    'Create a new release': '创建新发行版',
    'Draft a release': '起草发行版',
    'Publish release': '发布发行版',
    'Pre-release': '预发行版',
    'Generate release notes': '生成发行说明',
    'Choose a tag': '选择标签',
    'Create new tag': '新建标签',
    'Target': '目标',
    'Release title': '发行版标题',
    'Describe this release': '描述此发行版',
    'Assets': '资源',
    'All workflows': '所有工作流',
    'Workflows': '工作流',
    'Run workflow': '运行工作流',
    'Re-run all jobs': '重新运行所有作业',
    'Re-run failed jobs': '重新运行失败的作业',
    'Cancel workflow': '取消工作流',
    'Jobs': '作业',
    'Summary': '摘要',
    'Deploy from a branch': '从分支部署',
    'Custom domain': '自定义域名',
    'Enforce HTTPS': '强制 HTTPS',
    'Visit site': '访问站点',
    'Create the first page': '创建第一个页面',
    'New page': '新页面',
    'Choose a repository': '选择仓库',
    'Add a README': '添加 README',
    'Add a license': '添加许可证',
    'Add topics': '添加主题',
    'Choose a license': '选择许可证',
    'Copy to clipboard': '复制到剪贴板',
    'Toggle navigation': '切换导航',
    'Open menu': '打开菜单',
    'Close menu': '关闭菜单',
    'Toggle sidebar': '切换侧边栏',
    'Dismiss alert': '关闭提示',
    'Show password': '显示密码',
    'Hide password': '隐藏密码',
    'committed': '已提交',
    'authored': '编写',
    'updated': '更新于',
    'opened': '开启',
    'closed': '已关闭',
    'merged': '已合并',

    // ---- 1.1.0 新增：通用控件 / 状态 ----
    'More': '更多',
    'Less': '更少',
    'Download': '下载',
    'Upload': '上传',
    'Refresh': '刷新',
    'Close': '关闭',
    'Reopen': '重新打开',
    'Enabled': '已启用',
    'Disabled': '已禁用',
    'Unknown': '未知',
    'Required': '必需',
    'Optional': '可选',
    'Recommended': '推荐',
    'Coming soon': '即将推出',
    'Default': '默认',
    'Custom': '自定义',
    'None': '无',
    'Show': '显示',
    'Hide': '隐藏',
    'Expand': '展开',
    'Collapse': '折叠',
    'Select': '选择',
    'Deselect': '取消选择',
    'Create': '创建',
    'Discard': '丢弃',
    'Discard changes': '丢弃更改',
    'Unsaved changes': '未保存的更改',
    'Are you sure?': '确定吗？',
    'This action cannot be undone.': '此操作无法撤销。',
    'Added': '已添加',
    'Removed': '已移除',
    'Changed': '已更改',
    'Deleted': '已删除',
    'Beta': '测试版',
    'Public preview': '公开预览',
    'Generally available': '正式发布',

    // ---- 1.1.0 新增：导航 / 账户菜单 ----
    'Skip to main content': '跳到主要内容',
    'Open sidebar': '打开侧边栏',
    'Close sidebar': '关闭侧边栏',
    'Toggle theme': '切换主题',
    'Switch theme': '切换主题',
    'Light': '浅色',
    'Dark': '深色',
    'System': '跟随系统',
    'Light default': '浅色（默认）',
    'Dark default': '深色（默认）',
    'Light high contrast': '浅色（高对比度）',
    'Dark high contrast': '深色（高对比度）',
    'Keyboard shortcuts': '键盘快捷键',
    'Command palette': '命令面板',
    'Send feedback': '发送反馈',
    'Give feedback': '提供反馈',
    'Signed in as': '登录身份',
    'Switch account': '切换账户',
    'Set status': '设置状态',
    'Edit status': '编辑状态',
    'Clear status': '清除状态',
    'Busy': '忙碌',
    'Available': '有空',
    'Away': '离开',
    'Do not disturb': '请勿打扰',
    'On vacation': '休假中',
    'Working remotely': '远程办公',

    // ---- 1.1.0 新增：仓库首页 / 代码浏览 ----
    'No description provided.': '未提供描述。',
    'Resources': '资源',
    'Report repository': '举报仓库',
    'Edit repository metadata': '编辑仓库元数据',
    'Edit pinned repositories': '编辑置顶仓库',
    'Customize pins': '自定义置顶',
    'Public template': '公开模板',
    'Private template': '私有模板',
    'Used by': '使用者',
    'Sponsor this project': '赞助此项目',
    'Latest commit': '最新提交',
    'Commit history': '提交历史',
    'Open in github.dev': '在 github.dev 中打开',
    'Open in Codespaces': '在代码空间中打开',
    'Copy file contents': '复制文件内容',
    'Download file': '下载文件',
    'View file': '查看文件',
    'Delete directory': '删除目录',
    'Search in this repository': '在此仓库中搜索',
    'Go to line': '转到行',
    'No files found': '未找到文件',
    'No commits found': '未找到提交',
    'No branches found': '未找到分支',
    'No tags found': '未找到标签',
    'No results found': '未找到结果',
    'Nothing to show': '暂无内容',
    'There was an error while loading.': '加载时出错。',
    'Please reload this page.': '请重新加载此页面。',
    'An error occurred while loading.': '加载时发生错误。',
    'Try refreshing the page.': '请尝试刷新页面。',
    'Loading more…': '正在加载更多…',
    'Loading more...': '正在加载更多…',
    'Leave a comment': '发表评论',
    'Find a repository…': '查找仓库…',
    'Find a repository...': '查找仓库…',
    'Filter branches/tags': '筛选分支/标签',
    'Search branches and tags': '搜索分支和标签',

    // ---- 1.1.0 新增：议题 / 筛选 ----
    'Filters': '筛选条件',
    'Apply filters': '应用筛选',
    'Clear filters': '清除筛选',
    'Reset filters': '重置筛选',
    'Open issues': '打开的议题',
    'Closed issues': '已关闭的议题',
    'Your issues': '你的议题',
    'Everything assigned to me': '所有指派给我的',
    'Everything mentioned': '所有提及我的',
    "Everything I'm involved in": '所有我参与的',
    'Least recently updated': '最近最少更新',
    'Least commented': '评论最少',
    'Least reactions': '反应最少',
    'Type': '类型',
    'Types': '类型',
    'Add types': '添加类型',
    'Issue type': '议题类型',
    'Sub-issues': '子议题',
    'Add sub-issue': '添加子议题',
    'Parent issue': '父议题',
    'Relationships': '关系',
    'Tracked by': '被跟踪于',
    'Tracked in': '跟踪于',
    'Blocked by': '被阻塞于',
    'Blocking': '阻塞',
    'Duplicate': '重复',
    'Not planned': '未计划',
    'Completed': '已完成',
    'In progress': '进行中',
    'Needs triage': '需分类',
    'Todo': '待办',
    'Fields': '字段',
    'Add field': '添加字段',
    'No fields': '无字段',
    'Search or filter': '搜索或筛选',
    'Filter by assignee': '按负责人筛选',
    'Filter by label': '按标签筛选',
    'Filter by milestone': '按里程碑筛选',
    'Filter by project': '按项目筛选',
    'Filter by type': '按类型筛选',
    'Filter by status': '按状态筛选',
    'Filter by author': '按作者筛选',
    'Filter by review': '按审查状态筛选',
    'Filter by team': '按团队筛选',
    'Filter by repository': '按仓库筛选',
    'Filter by language': '按语言筛选',
    'Filter by topic': '按主题筛选',
    'Filter by owner': '按所有者筛选',
    'Filter by state': '按状态筛选',
    'Filter by date': '按日期筛选',

    // ---- 1.1.0 新增：拉取请求 / 审查 / 检查 ----
    'Review required': '需要审查',
    'Approved': '已批准',
    'Changes requested': '已请求更改',
    'Reviewed': '已审查',
    'Dismissed': '已驳回',
    'Pending review': '待审查',
    'Submit review': '提交审查',
    'Finish your review': '完成你的审查',
    'Add review comment': '添加审查评论',
    'Start a review': '开始审查',
    'Viewed': '已查看',
    'Unviewed': '未查看',
    'Mark as viewed': '标记为已查看',
    'Mark as unviewed': '标记为未查看',
    'Show resolved': '显示已解决',
    'Hide resolved': '隐藏已解决',
    'Show outdated': '显示已过时',
    'Hide outdated': '隐藏已过时',
    'Resolved': '已解决',
    'Unresolved': '未解决',
    'Outdated': '已过时',
    'Jump to file': '跳转到文件',
    'Previous file': '上一个文件',
    'Next file': '下一个文件',
    'Show file tree': '显示文件树',
    'Hide file tree': '隐藏文件树',
    'Split': '拆分',
    'Unified': '统一',
    'Diff view': '差异视图',
    'Hide whitespace': '隐藏空白变更',
    'Show whitespace': '显示空白变更',
    'Add single comment': '添加单条评论',
    'Add comment': '添加评论',
    'Comment on this line': '评论此行',
    'Copy line': '复制行',
    'Copy link to line': '复制行链接',
    'Reference in new issue': '在新议题中引用',
    'Enable auto-merge': '启用自动合并',
    'Disable auto-merge': '禁用自动合并',
    'Auto-merge': '自动合并',
    'Merge when ready': '就绪后合并',
    'Update branch': '更新分支',
    'Delete branch': '删除分支',
    'Restore branch': '恢复分支',
    'This branch has no conflicts with the base branch': '此分支与基础分支没有冲突',
    'This branch has conflicts that must be resolved': '此分支存在必须解决的冲突',
    'Merging can be performed automatically.': '可以自动执行合并。',
    'Merging is blocked': '合并被阻止',
    'Required status check': '必需的状态检查',
    'Required status checks': '必需的状态检查',
    'All checks have passed': '所有检查均已通过',
    'Some checks were not successful': '部分检查未成功',
    "Some checks haven't completed yet": '部分检查尚未完成',
    'All checks have failed': '所有检查均已失败',
    'Checks pending': '检查待处理',
    'Successful checks': '成功的检查',
    'Failing checks': '失败的检查',
    'Skipped checks': '跳过的检查',
    'Details': '详情',
    'Annotations': '注解',
    'Failure': '失败',
    'Cancelled': '已取消',
    'Timed out': '已超时',
    'Action required': '需要操作',
    'Waiting': '等待中',
    'Approval required': '需要批准',
    'Waiting for approval': '等待批准',

    // ---- 1.1.0 新增：通知 ----
    'Read': '已读',
    'Subscriptions': '订阅',
    'Ignored': '已忽略',
    'All caught up!': '全部处理完毕！',
    "You're all caught up!": '你已处理完所有通知！',
    'No unread notifications': '没有未读通知',
    'Mark as unread': '标记为未读',
    'Unsaved': '未保存',
    'Group by date': '按日期分组',
    'Group by repository': '按仓库分组',
    'Notification inbox': '通知收件箱',
    'Manage notifications': '管理通知',
    'Customize notifications': '自定义通知',
    'Notification preferences': '通知偏好设置',
    'Participating and @mentions': '参与和 @提及',
    'All activity': '所有活动',
    'Ignore': '忽略',

    // ---- 1.1.0 新增：搜索 ----
    'Type / to search': '输入 / 开始搜索',
    'Search code': '搜索代码',
    'Search issues': '搜索议题',
    'Search discussions': '搜索讨论',
    'Search users': '搜索用户',
    'Search commits': '搜索提交',
    'Search packages': '搜索软件包',
    'Search topics': '搜索主题',
    'Search wikis': '搜索 Wiki',
    'Wikis': 'Wiki',
    'Written by': '作者为',
    'Language': '语言',
    'Created on': '创建于',
    'Last updated': '最后更新',
    'In file': '在文件中',
    'Path': '路径',
    'Filename': '文件名',
    'Extension': '扩展名',
    'Symbol': '符号',
    'Match': '匹配',
    'Matches': '匹配',
    'Case sensitive': '区分大小写',
    'Regex': '正则表达式',
    'Search everywhere': '搜索全部',

    // ---- 1.1.0 新增：个人资料 ----
    'Contribution settings': '贡献设置',
    'Contribution graph': '贡献图',
    'Contributions in the last year': '过去一年的贡献',
    'Learn how we count contributions': '了解我们如何统计贡献',
    'Show more activity': '显示更多活动',
    'Joined GitHub': '加入 GitHub',
    'Highlights': '亮点',
    'Starred repositories': '已星标的仓库',
    'Customize your pins': '自定义你的置顶',
    'Edit pinned items': '编辑置顶项',
    'Block': '屏蔽',
    'Unblock': '取消屏蔽',

    // ---- 1.1.0 新增：设置 / 分支规则 ----
    'Profile': '个人资料',
    'Account settings': '账户设置',
    'Preferences': '偏好设置',
    'Security and analysis': '安全与分析',
    'Code security and analysis': '代码安全与分析',
    'Actions permissions': '操作权限',
    'Workflow permissions': '工作流权限',
    'Read and write permissions': '读写权限',
    'Secrets': '机密',
    'Variables': '变量',
    'New secret': '新建机密',
    'New variable': '新建变量',
    'Repository secrets': '仓库机密',
    'Organization secrets': '组织机密',
    'Environment secrets': '环境机密',
    'New ruleset': '新建规则集',
    'New branch ruleset': '新建分支规则集',
    'New tag ruleset': '新建标签规则集',
    'Branch name pattern': '分支名称模式',
    'Tag name pattern': '标签名称模式',
    'Protect matching branches': '保护匹配的分支',
    'Require a pull request before merging': '合并前要求拉取请求',
    'Require status checks to pass': '要求状态检查通过',
    'Require conversation resolution before merging': '合并前要求解决对话',
    'Require signed commits': '要求签名提交',
    'Require linear history': '要求线性历史',
    'Lock branch': '锁定分支',
    'Do not allow bypassing the above settings': '不允许绕过上述设置',
    'Allow force pushes': '允许强制推送',
    'Allow deletions': '允许删除',
    'Add rule': '添加规则',
    'Add target': '添加目标',
    'Create ruleset': '创建规则集',

    // ---- 1.1.0 新增：登录 / 账户 ----
    'Email': '电子邮件',
    'Email address': '电子邮件地址',
    'Username': '用户名',
    'New to GitHub?': '初次使用 GitHub？',
    'Sign up for GitHub': '注册 GitHub',
    'Sign in with a passkey': '使用通行密钥登录',
    'Use a passkey': '使用通行密钥',
    'Trouble signing in?': '登录遇到问题？',
    'Reset your password': '重置密码',
    'Send password reset email': '发送密码重置邮件',
    'Check your email': '检查你的电子邮件',
    'Device verification': '设备验证',
    'Verify': '验证',
    'Resend code': '重新发送验证码',
    'Use a different account': '使用其他账户',
    'Single sign-on': '单点登录',
    'Terms of Service': '服务条款',
    'Privacy Statement': '隐私声明',
    'Cookie preferences': 'Cookie 偏好设置',
    'Manage preferences': '管理偏好设置',
    'Accept': '接受',
    'Reject': '拒绝',
    'Accept all': '全部接受',
    'Reject all': '全部拒绝',
    'Save preferences': '保存偏好设置',

    // ---- 1.1.0 新增：发行版 / Actions / 安全 ----
    'Source code (zip)': '源代码（zip）',
    'Source code (tar.gz)': '源代码（tar.gz）',
    'Release notes': '发行说明',
    'Edit release': '编辑发行版',
    'Delete release': '删除发行版',
    'Set as latest release': '设为最新发行版',
    'Full Changelog': '完整变更日志',
    'New contributor': '新贡献者',
    'First contribution': '首次贡献',
    "What's Changed": '变更内容',
    'Breaking changes': '破坏性变更',
    'Bug fixes': '错误修复',
    'New features': '新功能',
    'Maintenance': '维护',
    'Other changes': '其他变更',
    'Steps': '步骤',
    'Set up job': '设置作业',
    'Complete job': '完成作业',
    'Workflow runs': '工作流运行',
    'All runs': '所有运行',
    'Event': '事件',
    'Branch': '分支',
    'Actor': '触发者',
    'Duration': '时长',
    'Started': '开始时间',
    'Filter workflow runs': '筛选工作流运行',
    'Search workflow runs': '搜索工作流运行',
    'No workflow runs found': '未找到工作流运行',
    'Approve and run': '批准并运行',
    'Security overview': '安全概览',
    'Security advisories': '安全公告',
    'Code scanning alerts': '代码扫描警报',
    'Secret scanning alerts': '机密扫描警报',
    'Create a security advisory': '创建安全公告',
    'Report a vulnerability': '报告漏洞',
    'View security policy': '查看安全策略',

    // ---- 1.4.0 新增：列表 / 星标页 ----
    'Lists': '列表',
    'Create list': '新建列表',
    'Add this repository to a list': '将此仓库添加到列表',
    'Create a list to organize your starred repositories.': '新建列表来整理你的星标仓库。',
    'Enabling this makes the list visible only to you.': '启用后此列表仅你可见。',
    '⭐️ Name this list': '⭐️ 为此列表命名',
    'Write a description': '写一段描述',
    'Description': '描述',
    'Star this repository': '为此仓库加星标',
    'Starred, click to unstar this repository': '已星标，点击取消星标',
    "You don't have any lists yet.": '你还没有任何列表。',
    "You don't have any public repositories yet.": '你还没有任何公开仓库。',
    'All languages': '所有语言',
    'Recently viewed': '最近查看',
    'Save pins': '保存置顶',

    // ---- 1.4.0 新增：页脚 / 导航 ----
    'Footer': '页脚',
    'Footer navigation': '页脚导航',
    'Homepage': '首页',
    'GitHub Homepage': 'GitHub 首页',
    'Global navigation menu': '全局导航菜单',
    'User navigation': '用户导航',
    'Dashboard menu': '仪表盘菜单',
    'Dashboard preview options': '仪表盘预览选项',
    'Site navigation': '站点导航',
    'Breadcrumbs': '面包屑导航',
    'User': '用户',
    'Time zone': '时区',
    'Skip to contributions year list': '跳到贡献年份列表',

    // ---- 1.4.0 新增：Copilot / 仪表盘 ----
    'Chat with Copilot': '与 Copilot 对话',
    'Open Copilot…': '打开 Copilot…',
    'Open Copilot...': '打开 Copilot…',
    'Create new...': '新建…',
    'Create new…': '新建…',
    'Chat commands': '聊天命令',
    'Select repositories to attach to conversation': '选择要附加到对话的仓库',
    'Add files, and spaces': '添加文件和空间',
    'Ask': '提问',
    'Auto': '自动',
    'Got it': '知道了',
    'Send now': '立即发送',
    'Model:': '模型：',
    'Optimized for': '优化目标',
    'Issue options': '议题选项',
    'Pull request options': '拉取请求选项',
    'Make Feed your homepage': '将动态设为首页',
    'Make Home your homepage': '将首页设为主页',
    'Pin your homepage': '置顶你的首页',
    'View token usage': '查看令牌用量',
    'Latest from our changelog': '最新更新日志',
    'View changelog →': '查看更新日志 →',
    'Showing results': '显示结果',
    'Dismiss banner': '关闭横幅',
    'Dismiss error': '关闭错误提示',
    'Retry.': '重试。',
    'No repositories found': '未找到仓库',

    // ---- 1.4.0 新增：项目页 ----
    'Projects views': '项目视图',
    'Create your first GitHub project': '创建你的第一个 GitHub 项目',
    'Projects are a customizable, flexible tool for planning and tracking your work.': '项目是可自定义的灵活工具，用于规划和跟踪你的工作。',

    // ---- 1.4.0 新增：通用提示句 ----
    'Sorry, something went wrong.': '抱歉，出错了。',
    'You can’t perform that action at this time.': '此时无法执行该操作。',
    "You can't perform that action at this time.": '此时无法执行该操作。',
    'You have no unread notifications': '你没有未读通知',
    'You signed in with another tab or window.': '你在另一个标签页或窗口中登录了。',
    'You signed out in another tab or window.': '你在另一个标签页或窗口中退出了登录。',
    'You switched accounts on another tab or window.': '你在另一个标签页或窗口中切换了账户。',
    'Please reload this page': '请重新加载此页面',
    'to refresh your session.': '以刷新你的会话。',
    'to search': '以搜索',
    'You can': '你可以',
    'You can’t': '你无法',
    "You can't": '你无法',
    'other users and organizations to link to them.': '其他用户和组织，以便链接到他们。',
    'to add emoji to the name or description.': '以在名称或描述中添加表情。',
    'Add a bio': '添加简介',
    'Change your avatar': '更换头像',
    // ---- 1.5.0 新增：通知收件箱 ----
    'Not available': '不可用',
    'Close dialog': '关闭对话框',
    'Date': '日期',
    'Newest to oldest': '最新到最早',
    'Oldest to newest': '最早到最新',
    'Watched repositories': '已关注的仓库',
    'Add new filter': '添加新筛选',
    'Assigned': '已指派',
    'Team mentioned': '团队提及',
    'Clean up your inbox': '清理收件箱',
    'Clear out the clutter.': '清理杂乱内容。',
    'Customize filters': '自定义筛选',
    'Folders': '文件夹',
    'Get started clearing your notifications': '开始清理你的通知',
    'Group by:': '分组依据：',
    'Sort by:': '排序依据：',
    'Mark all read notifications as done': '将所有已读通知标记为已完成',
    'Notification filters': '通知筛选',
    'Notifications by date': '按日期分组的通知',
    'Repository': '仓库',
    'Search notifications': '搜索通知',
    'Switch inbox': '切换收件箱',
    'This process could take a few moments depending on the quantity.': '此过程可能需要一些时间，具体取决于数量。',
    'Get the most out of your new inbox by quickly and easily marking all of your previously read notifications as done.': '只需快速将之前已读的通知标记为完成，就能充分利用新的收件箱。',

    // ---- 1.5.0 新增：Feed ----
    'Activity you want to see on your feed': '你想在动态中看到的活动',
    'Add or remove reactions': '添加或移除回应',
    'All reactions': '所有回应',
    'Announcements': '公告',
    'By default, the feed shows events from repositories you sponsor or watch, and people you follow.': '默认情况下，动态会显示你赞助或关注的仓库以及你关注的人的事件。',
    'Choose whether github.com opens to Home or Feed. Select the pin next to either one.': '选择 github.com 打开时进入首页还是动态。点击任一选项旁的图钉。',
    'Feed item options': '动态项选项',
    'Follows': '关注',
    'I want to see fewer published releases': '我希望少看到已发布的发行版',
    'Include events from starred repositories': '包含来自已星标仓库的动态',
    'Issues and pull requests from repositories': '来自仓库的议题和拉取请求',
    'Recommendations': '推荐',
    'Recommended for you': '为你推荐',
    'Relevant projects or people that are being sponsored': '正在被赞助的相关项目或人物',
    'Repositories and people you may like': '你可能喜欢的仓库和人物',
    'Repositories being starred by people': '被他人加星标的仓库',
    'Repositories that are created or forked by people': '被他人创建或复刻的仓库',
    'Repository activity': '仓库动态',
    'Reset to default': '重置为默认',
    'See more': '查看更多',
    'Show less activity like this': '少显示此类动态',
    'Special discussion posts from repositories': '来自仓库的特别讨论帖',
    'Tell us more about your preferences': '告诉我们更多你的偏好',
    'Trending repositories': '趋势仓库',
    'Update posts from repositories': '来自仓库的更新帖',
    'Who people are following': '人们正在关注谁',

    // ---- 1.5.0 新增：仓库页 ----
    'My contributions': '我的贡献',
    'My forks': '我的复刻',
    'My repositories': '我的仓库',
    'Admin access': '管理员权限',
    'Comfortable display density': '舒适显示密度',
    'Compact display density': '紧凑显示密度',
    'Create view': '新建视图',
    'Filter repositories': '筛选仓库',
    'No repositories matched your search.': '没有仓库匹配你的搜索。',
    'No saved views': '没有已保存的视图',
    'ProTip!': '小技巧！',
    'Relevance': '相关度',
    'Repositories list': '仓库列表',
    'Repositories list display density': '仓库列表显示密度',
    'Repository filters': '仓库筛选',
    'Try a different search query.': '换个搜索词试试。',
    'Views': '视图',
    // ---- 1.6.0 新增：搜索页 ----
    'External links': '外部链接',
    'Learn more about funding links in repositories': '了解仓库中的赞助链接',
    'Explore sponsorable projects': '探索可赞助的项目',
    'How can we improve search?': '如何改进搜索？',
    'Sponsor open source projects you depend on': '赞助你依赖的开源项目',
    'Open column options': '打开列选项',
    'Draggable pane splitter': '可拖动的窗格分隔条',
    'Advanced': '高级',
    'AI resources': 'AI 资源',
    'Date created': '创建日期',
    'Date pushed': '推送日期',
    'Filter:': '筛选：',
    'More languages...': '更多语言…',
    'More languages…': '更多语言…',
    // ---- 1.8.1 新增：文件页更多菜单 ----
    'Raw file content': '原始文件内容',
    'Ask about this file': '询问关于此文件',
    'View options': '查看选项',
    'Show code folding buttons': '显示代码折叠按钮',
    'Hide code folding buttons': '隐藏代码折叠按钮',
    'Wrap lines': '自动换行',
    'Unwrap lines': '取消自动换行',
    'Center content': '内容居中',
    'Open symbols on click': '单击打开符号',
    'Copy file path': '复制文件路径',

    // ---- 1.7.4 新增：账户设置 ----
    'Change username': '更改用户名',
    'Change my username': '更改我的用户名',
    'Additional billing details': '其他账单信息',
    'AI usage': 'AI 用量',
    'Archives': '归档',
    'Billing and licensing': '账单与许可',
    'Blocked users': '已屏蔽用户',
    'Budgets and alerts': '预算与提醒',
    'Cloud': '云端',
    'Code review limits': '代码审查限制',
    'Code, planning, and automation': '代码、规划与自动化',
    'Credentials': '凭据',
    'Education benefits': '教育权益',
    'Features': '功能',
    'Interaction limits': '互动限制',
    'Issue fields': '议题字段',
    'Issue types': '议题类型',
    'Licensing': '许可',
    'Moderation': '内容审核',
    'Payment history': '付款历史',
    'Payment information': '付款信息',
    'Planning': '规划',
    'Scheduled reminders': '定时提醒',
    'Security log': '安全日志',
    'Sponsorship log': '赞助日志',
    'Usage': '用量',
    'User settings': '用户设置',
    'Settings menu': '设置菜单',
    'Your personal account': '你的个人账户',
    'Your username or email:': '你的用户名或电子邮件：',
    'Enter a new username': '输入新用户名',
    'Really change your username?': '确定要更改用户名吗？',
    'I understand, let’s change my username': '我明白，更改我的用户名',
    "I understand, let's change my username": '我明白，更改我的用户名',
    'Renaming may take a few minutes to complete.': '重命名可能需要几分钟才能完成。',
    'Changing your username can have': '更改用户名可能会产生',
    'unintended side effects': '意外副作用',
    'Search by username, full name, or email address': '按用户名、全名或电子邮件地址搜索',
    'This is extremely important.': '这一点极其重要。',
    'Unexpected bad things will happen if you don’t read this!': '如果不读这段内容，可能会发生意外！',
    "Unexpected bad things will happen if you don't read this!": '如果不读这段内容，可能会发生意外！',
    'Once you delete your account, there is no going back. Please be certain.': '账户一旦删除将无法恢复，请务必确认。',
    'Deleting your user account': '删除你的用户账户',
    'Delete your account': '删除你的账户',
    'Delete account': '删除账户',
    'delete my account': '删除我的账户',
    'Cancel plan and delete this account': '取消套餐并删除此账户',
    'Are you sure you want to do this?': '确定要这样做吗？',
    "You'll be prompted to verify your identity before account deletion.": '删除账户前会要求你验证身份。',
    'You’ll be prompted to verify your identity before account deletion.': '删除账户前会要求你验证身份。',
    'Export account data': '导出账户数据',
    'Start export': '开始导出',
    'Successor settings': '继任者设置',
    'Add Successor': '添加继任者',
    'Designate Successor': '指定继任者',
    'Learn more about account successors.': '了解有关账户继任者的更多信息。',
    'You have not designated a successor.': '你尚未指定继任者。',
    'designated below': '下方指定的',
    'We set up redirects for Pages sites.': '我们会为 Pages 站点设置重定向。',
    'We set up redirects for your old profile page.': '我们会为你的旧个人资料页设置重定向。',
    'We create redirects for your repositories (web and git access).': '我们会为你的仓库创建重定向（网页和 git 访问）。',
    'We will': '我们将',
    'will not': '将不会',
    'For more help, read our article': '如需更多帮助，请阅读我们的文章',
    'Looking to manage account security settings? You can find them in the': '想管理账户安全设置？可以在以下页面找到：',
    'To verify, type exactly as it appears:': '要验证，请完全按原样输入：',
    'Connect with Patreon': '使用 Patreon 连接',
    'Link Patreon account': '关联 Patreon 账户',
    'Connect a Patreon account for': '连接 Patreon 账户以',

    // ---- 1.7.4 新增：贡献日历 / 日期名称 ----
    'January': '一月', 'February': '二月', 'March': '三月', 'April': '四月',
    'May': '五月', 'June': '六月', 'July': '七月', 'August': '八月',
    'September': '九月', 'October': '十月', 'November': '十一月', 'December': '十二月',
    'Jan': '1 月', 'Feb': '2 月', 'Mar': '3 月', 'Apr': '4 月',
    'Jun': '6 月', 'Jul': '7 月', 'Aug': '8 月', 'Sep': '9 月', 'Oct': '10 月', 'Nov': '11 月', 'Dec': '12 月',
    'Monday': '星期一', 'Tuesday': '星期二', 'Wednesday': '星期三', 'Thursday': '星期四',
    'Friday': '星期五', 'Saturday': '星期六', 'Sunday': '星期日',
    'Mon': '周一', 'Tue': '周二', 'Wed': '周三', 'Thu': '周四', 'Fri': '周五', 'Sat': '周六', 'Sun': '周日',
    'Day of Week': '星期',
    'Year:': '年份：',
    'GitHub profile guide': 'GitHub 个人资料指南',
    'First repository': '第一个仓库',
    'Created their first repository': '创建了第一个仓库',
    'High contributions.': '贡献量高。',
    'Low contributions.': '贡献量低。',
    'Medium-high contributions.': '贡献量中高。',
    'Medium-low contributions.': '贡献量中低。',
    'No contributions.': '无贡献。',
    'Turning on private contributions will show anonymized private activity on your profile.': '开启私有贡献后，你的个人资料中会显示匿名化的私有活动。',
    'Turning on the activity overview will show an overview of your activity across organizations and repositories.': '开启活动概览后，会显示你跨组织和仓库的活动概览。',
    'Seeing something unexpected? Take a look at the': '看到意外内容？请查看',


    // ---- 1.7.3 新增：Insights / Pulse ----
    'Actions performance metrics': 'Actions 性能指标',
    'Actions usage metrics': 'Actions 用量指标',
    'Active issues': '活跃议题',
    'Active pull requests': '活跃拉取请求',
    'New issues': '新建议题',
    'Open pull requests': '打开的拉取请求',
    'Merged pull requests': '已合并的拉取请求',
    'Chart options': '图表选项',
    'Customization settings': '自定义设置',
    'End of interactive chart.': '交互式图表结束。',
    'More items, including current item': '更多项目，包括当前项目',
    'Period:': '周期：',
    'Top committers': '提交最多者',
    'Top committers. Interactive chart.': '提交最多者。交互式图表。',
    'View as data table, Chart': '以数据表查看，图表',
    'Community standards': '社区标准',
    'categories': '分类',

    // ---- 1.7.0 新增：Markdown 工具栏 ----
    'Bold': '粗体',
    'Italic': '斜体',
    'Heading': '标题',
    'Quote': '引用',
    'Numbered list': '有序列表',
    'Unordered list': '无序列表',
    'Task list': '任务列表',
    'Mention': '提及',
    'Reference': '引用',
    'Attach files': '附加文件',
    'Add files': '添加文件',
    'Saved replies': '已保存的回复',
    'Create a new saved reply': '新建已保存的回复',
    'Select a reply': '选择回复',
    'No results found.': '未找到结果。',

    // ---- 1.7.0 新增：发行版编辑页 ----
    'A draft of this release has been saved!': '此发行版的草稿已保存！',
    'A newly published release will automatically be labeled as the latest release for this repository.': '新发布的发行版会自动标记为此仓库的最新发行版。',
    'An attachment with that filename already exists.': '该文件名的附件已存在。',
    'Attach binaries by dropping them here or selecting them.': '将二进制文件拖放到此处或选择文件来附加。',
    'Attach binaries by dropping them here or selecting them': '将二进制文件拖放到此处或选择文件来附加',
    'Attaching documents requires write permission to this repository.': '附加文档需要此仓库的写入权限。',
    'Branch with this tag name already exists': '已存在同名分支',
    'Change this file’s name': '更改此文件名',
    "Change this file's name": '更改此文件名',
    'Choose an existing tag, or create a new tag when you publish this release.': '选择现有标签，或在发布此发行版时创建新标签。',
    'Duplicate tag name': '标签名重复',
    'edit the existing notes': '编辑现有说明',
    'Enter release title': '输入发行版标题',
    'Excellent! This tag will be created from the target when you publish this release.': '很好！发布此发行版时将从目标创建此标签。',
    'Existing tag': '现有标签',
    'Filter branches': '筛选分支',
    'Filter branches…': '筛选分支…',
    'If you’re new to releasing software, we highly recommend to': '如果你是初次发布软件，我们强烈建议',
    "If you're new to releasing software, we highly recommend to": '如果你是初次发布软件，我们强烈建议',
    'Invalid tag name': '无效的标签名',
    'is supported': '受支持',
    'It’s common practice to prefix your version names with the letter': '常见做法是在版本名前加上字母',
    "It's common practice to prefix your version names with the letter": '常见做法是在版本名前加上字母',
    '. Some good tag names might be': '。一些好的标签名可能是',
    'Label release as non-production ready': '将发行版标记为非生产就绪',
    'Learn more about release settings.': '了解有关发行版设置的更多信息。',
    'learn more about semantic versioning.': '了解语义化版本控制。',
    'Loading tag information…': '正在加载标签信息…',
    'Menu': '菜单',
    'New release': '新发行版',
    'Paste, drop, or click to add files': '粘贴、拖放或点击以添加文件',
    'Pick a branch or recent commit': '选择分支或最近的提交',
    'Previous tag :': '上一个标签：',
    'Previous tag:': '上一个标签：',
    'Recent commits': '最近的提交',
    'Recent Commits': '最近的提交',
    'Release description': '发行版描述',
    'Release label': '发行版标签',
    'Remove attached binary': '移除附加的二进制文件',
    'Save draft': '保存草稿',
    'Saving draft failed. Try again?': '保存草稿失败。重试？',
    'Saving release…': '正在保存发行版…',
    'Select a previous tag to create generated release notes': '选择之前的标签以生成发行版说明',
    'Select tag': '选择标签',
    'Semantic versioning': '语义化版本控制',
    'Something went really wrong, and we can’t process that file.': '出了点严重错误，我们无法处理该文件。',
    "Something went really wrong, and we can't process that file.": '出了点严重错误，我们无法处理该文件。',
    'Tag': '标签',
    'Tag name unavailable': '标签名不可用',
    'Tagging suggestions': '标签建议',
    'Tags previously bound to immutable releases can never be reused.': '之前绑定到不可变发行版的标签永远无法重复使用。',
    'Target:': '目标：',
    'There was an error creating your Release.': '创建发行版时出错。',
    'This file is empty.': '此文件为空。',
    'This file is hidden.': '此文件已隐藏。',
    'This tag already has release notes. Would you like to': '此标签已有发行版说明。是否要',
    'Title': '标题',
    'Too many assets. Releases are limited to 1000 assets.': '资产过多。每个发行版最多 1000 个资产。',
    'Try a different file.': '试试其他文件。',
    'Try again with a file that’s not empty.': '换个非空文件重试。',
    "Try again with a file that's not empty.": '换个非空文件重试。',
    'Try again with another file.': '换个文件重试。',
    'Try again.': '重试。',
    'Try another file.': '试试其他文件。',
    'Uploading your file now…': '正在上传你的文件…',
    'We can’t create a tag with this name. Take a look at the suggestions in the sidebar for example tag names.': '无法使用此名称创建标签。请查看侧边栏中的示例标签名建议。',
    "We can't create a tag with this name. Take a look at the suggestions in the sidebar for example tag names.": '无法使用此名称创建标签。请查看侧边栏中的示例标签名建议。',
    'We don’t support that file type.': '不支持该文件类型。',
    "We don't support that file type.": '不支持该文件类型。',
    'We don’t support that file type. Try zipping it.': '不支持该文件类型。试试压缩后再上传。',
    "We don't support that file type. Try zipping it.": '不支持该文件类型。试试压缩后再上传。',
    'will be deleted': '将被删除',
    'with a file that’s not empty.': '并使用非空文件。',
    "with a file that's not empty.": '并使用非空文件。',
    'Yowza, that’s a big file.': '好家伙，这个文件真大。',
    "Yowza, that's a big file.": '好家伙，这个文件真大。',

    // ---- 1.7.0 新增：文件查看器 ----
    'Add to space': '添加到空间',
    'Ask Copilot about this file': '询问 Copilot 关于此文件',
    'Edit and raw actions': '编辑与原始文件操作',
    'Expand file tree': '展开文件树',
    'File metadata and controls': '文件元数据与控件',
    'File view': '文件视图',
    'Files': '文件',
    'More edit options': '更多编辑选项',
    'No spaces found. You can create a new space to get started.': '未找到空间。你可以创建一个新空间来开始使用。',
    'Outline': '大纲',
    'Top': '顶部',
    'While the code is focused, press Alt+F1 for a menu of operations.': '代码获得焦点时，按 Alt+F1 打开操作菜单。',

    // ---- 1.6.2 新增：仓库代码页 ----
    'Open commit details': '打开提交详情',
    'Drop to upload your files': '拖放到此处上传文件',
    'Folders and files': '文件夹和文件',
    'Go to Branches page': '转到分支页面',
    'Go to Tags page': '转到标签页面',
    'Last commit date': '最后提交日期',
    'Last commit message': '最后提交信息',
    'Open more actions menu': '打开更多操作菜单',
    'Publish your first package': '发布你的第一个软件包',
    'Repository files': '仓库文件',
    'Repository files navigation': '仓库文件导航',
    'Repository navigation': '仓库导航',
    'Security and quality': '安全与质量',
    'Star lists': '星标列表',
    'Switch repository': '切换仓库',
    'View all files': '查看所有文件',
    'View commit history for this file.': '查看此文件的提交历史。',
    'View commit history for this file': '查看此文件的提交历史',
    'Open Releases and tags navigation': '打开发行版和标签导航',
    'Releases and tags': '发行版和标签',
    'Releases and tags navigation': '发行版和标签导航',
    'Tags results': '标签结果',
    'There aren’t any releases here': '这里还没有任何发行版',
    "There aren't any releases here": '这里还没有任何发行版',
    'our docs': '我们的文档',

    'Save your search': '保存你的搜索',
    'View search docs': '查看搜索文档',
    'Provide feedback': '提供反馈',
    'Sort options': '排序选项',
    'Most recent': '最近',
    'Most recently updated': '最近更新',
    'Recently indexed': '最近收录',
    'Next Page': '下一页',
    'Previous Page': '上一页',
    'Next page': '下一页',
    'Previous page': '上一页',
    'Owner': '所有者',
    'Pagination': '分页',
    'Topic': '主题',
    'Press the': '按',
    'key to activate the search input again and adjust your query.': '键可再次激活搜索框并调整查询。',
    'Name ascending (A-Z)': '名称升序（A-Z）',
    'Name descending (Z-A)': '名称降序（Z-A）',

    // ---- 1.2.0 新增：移动端导航侧栏 ----
    'All issues': '所有议题',
    'All pull requests': '所有拉取请求',
    'All repositories': '所有仓库',
    'All discussions': '所有讨论',
    'All projects': '所有项目',
    'Copilot': 'Copilot',
    'Copilot settings': 'Copilot 设置',
    'MCP registry': 'MCP 注册表',
    'Gists': 'Gist',
    'Enterprises': '企业版',
    'Try Enterprise': '试用企业版',
    'Free': '免费',
    'Pro': '专业版',
    'Create new repository': '新建仓库',
    'Create new organization': '新建组织',
    'Create new gist': '新建 Gist',
    'Sign out of GitHub': '退出 GitHub',
    'Add another account': '添加其他账户',
    'Your Copilot': '你的 Copilot',
    'Settings and privacy': '设置与隐私',

    // ---- 1.2.0 新增：仪表盘 / Copilot 首页 ----
    'Ask anything': '随便问点什么',
    'Ask anything or type @ to add context': '输入问题，或输入 @ 添加上下文',
    'Optimized for: Balance': '优化目标：平衡',
    'Balance': '平衡',
    'Quality': '质量',
    'Speed': '速度',
    'Debug': '调试',
    'Agent': '智能体',
    'Agents': '智能体',
    'Create issue': '创建议题',
    'Write code': '编写代码',
    'Basic Git commands': 'Git 基础命令',
    'Git branching': 'Git 分支',
    'Advanced Git commands': 'Git 高级命令',
    'Create a profile README': '创建个人资料 README',
    'Generate a simple calculator': '生成一个简单计算器',
    'Make a Pong game': '做一个 Pong 游戏',
    'Design a Mermaid architecture overview': '设计 Mermaid 架构概览',
    'Send me a download link': '给我发送下载链接',
    'The GitHub Copilot app': 'GitHub Copilot 应用',
    'The GitHub Copilot app is here': 'GitHub Copilot 应用已上线',
    'An agent-driven desktop experience built natively on GitHub.': '原生构建于 GitHub 的智能体桌面体验。',
    'Try it now': '立即试用',
    'New': '新',
    'No pull requests found': '未找到拉取请求',
    'No issues found': '未找到议题',
    'No discussions found': '未找到讨论',
    'try a different filter.': '请尝试其他筛选条件。',
    ', try a different filter.': '，请尝试其他筛选条件。',
    'try a different filter': '请尝试其他筛选条件',
    'Clear search': '清除搜索',
    'Recent': '最近',
    'Recently starred': '最近星标',
    'Recently active': '最近活跃',
    'Recently created': '最近创建',
    'Recently pushed': '最近推送',
    'Most recently starred': '最近星标',
    'Name, A to Z': '名称 A-Z',
    'Name, Z to A': '名称 Z-A',
    'Sources': '源仓库',
    'Mirrors': '镜像',
    'Templates': '模板',
    'Can be sponsored': '可被赞助',
    'Archived repositories': '已归档仓库',
    'Search stars': '搜索星标',
    'Search projects': '搜索项目',
    'Search teams': '搜索团队',
    'Search branches': '搜索分支',
    'Search tags': '搜索标签',
    'Search files': '搜索文件',
    'Search anything': '搜索任何内容',
    'Search or jump to': '搜索或跳转',
    'Your Stars': '你的星标',

    // ---- 1.2.0 新增：个人资料设置页 ----
    'Name': '姓名',
    'Public email': '公开邮箱',
    'Bio': '简介',
    'Pronouns': '代词',
    'URL': '网址',
    'Social accounts': '社交账号',
    'Company': '公司',
    'Industry': '行业',
    'Display current local time': '显示当前本地时间',
    'ORCID iD': 'ORCID iD',
    'Connect your ORCID iD': '连接你的 ORCID iD',
    'Contributions & activity': '贡献与活动',
    'Profile settings': '个人资料设置',
    'Profile picture': '头像',
    'Change picture': '更换头像',
    'Remove picture': '移除头像',
    'GitHub Developer Program': 'GitHub 开发者计划',
    'Jobs profile': '求职资料',
    'Trending settings': '趋势设置',
    'Preferred spoken language': '首选口语',
    'Available for hire': '接受雇佣',
    'Save jobs profile': '保存求职资料',
    'Update preferences': '更新偏好设置',
    'Show Achievements on my profile': '在我的个人资料中显示成就',
    'Maintain my private profile and activity': '维护我的私有个人资料和活动',
    'Include private contributions on my profile': '在我的个人资料中包含私有贡献',
    'Save profile': '保存资料',
    'Add link': '添加链接',
    'Link': '链接',
    'Show current local time': '显示当前本地时间',
    'Private contributions': '私有贡献',

    // ---- 1.2.0 新增：常见字段 / 按钮补充 ----
    'Learn more.': '了解更多。',
    'Learn more about': '了解更多关于',
    'Copy URL': '复制网址',
    'Open link in new tab': '在新标签页中打开链接',
    'Send': '发送',
    'Stop': '停止',
    'Regenerate': '重新生成',
    'Copy code': '复制代码',
    'Insert': '插入',
    'Undo': '撤销',
    'Redo': '重做',
    'Scroll to top': '滚动到顶部',
    'Back to top': '返回顶部',
    'Show more options': '显示更多选项',
    'Show fewer': '显示更少',
    'Expand sidebar': '展开侧边栏',
    'Collapse sidebar': '折叠侧边栏',
    'Open user navigation menu': '打开用户导航菜单',
    'Open global navigation menu': '打开全局导航菜单',
    'Search or filter suggestions': '搜索或筛选建议',
    'Suggestions': '建议',
    'No suggestions': '无建议',
    'Warning:': '警告：',
    'Error:': '错误：',
    'Note:': '说明：',
    'Tip:': '提示：'
  };
  Object.freeze(DICT);

  /* ================================================================== *
   * 2. 动态文本规则：数量、相对时间、提交/开启等带变量的文案
   * ================================================================== */

  const UNITS = {
    second: '秒',
    minute: '分钟',
    hour: '小时',
    day: '天',
    week: '周',
    month: '个月',
    year: '年'
  };

  const TIME_RE = /^(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i;
  const TIME_ONE_RE = /^an?\s+(second|minute|hour|day|week|month|year)\s+ago$/i;
  const FUTURE_RE = /^in\s+(\d+)\s+(second|minute|hour|day|week|month|year)s?$/i;
  const FUTURE_ONE_RE = /^in\s+an?\s+(second|minute|hour|day|week|month|year)$/i;

  const TIME_WORDS = {
    'now': '刚刚',
    'just now': '刚刚',
    'today': '今天',
    'yesterday': '昨天',
    'last week': '上周',
    'last month': '上个月',
    'last year': '去年',
    'this week': '本周',
    'this month': '本月',
    'this year': '今年'
  };

  const MONTHS = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12
  };

  // 匹配 “Oct 4” / “October 16th” / “Aug 7, 2025” / “on Oct 4”
  const DATE_RE = /^(?:on\s+)?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,\s*(\d{4}))?$/i;

  // 把英文日期本地化：Oct 4 -> 10 月 4 日；Aug 7, 2025 -> 2025 年 8 月 7 日
  function translateDatePart(text) {
    const match = DATE_RE.exec(String(text).trim());
    if (!match) return null;
    const month = MONTHS[match[1].toLowerCase()];
    if (!month) return null;
    const day = match[2];
    const year = match[3];
    return year ? year + ' 年 ' + month + ' 月 ' + day + ' 日' : month + ' 月 ' + day + ' 日';
  }

  function translateTimePart(text) {
    const key = String(text).replace(/\s+/g, ' ').trim();
    const lower = key.toLowerCase();
    if (hasOwn(TIME_WORDS, lower)) return TIME_WORDS[lower];

    let m = TIME_RE.exec(key);
    if (m) return m[1] + ' ' + UNITS[m[2].toLowerCase()] + '前';
    m = TIME_ONE_RE.exec(key);
    if (m) return '1 ' + UNITS[m[1].toLowerCase()] + '前';
    m = FUTURE_RE.exec(key);
    if (m) return m[1] + ' ' + UNITS[m[2].toLowerCase()] + '后';
    m = FUTURE_ONE_RE.exec(key);
    if (m) return '1 ' + UNITS[m[1].toLowerCase()] + '后';
    return null;
  }

  const VERB_PREFIX = {
    committed: '提交于 ',
    authored: '编写于 ',
    updated: '更新于 ',
    created: '创建于 ',
    released: '发布于 ',
    published: '发布于 ',
    pushed: '推送于 ',
    deleted: '删除于 ',
    joined: '加入于 ',
    reopened: '',
    approved: '批准于 ',
    dismissed: '驳回于 ',
    opened: '',
    closed: '',
    merged: ''
  };

  const VERB_SUFFIX = {
    opened: '开启',
    closed: '关闭',
    merged: '合并',
    reopened: '重新开启'
  };

  const OBJECT_NAMES = {
    issue: '议题',
    'pull request': '拉取请求',
    discussion: '讨论'
  };

  // 反应名：只在句子里用（“2 people reacted with thumbs up”），单独出现时不翻
  const REACTION_NAMES = {
    'thumbs up': '赞',
    'thumbs down': '踩',
    'heart': '爱心',
    'eyes': '眼睛',
    'hooray': '庆祝',
    'laugh': '大笑',
    'rocket': '火箭',
    'confused': '困惑',
    'tada': '欢呼'
  };

  // 排序下拉里的名词
  const SORT_NOUNS = {
    stars: '星标',
    forks: '复刻',
    watchers: '关注者',
    comments: '评论',
    reactions: '回应',
    downloads: '下载量',
    contributors: '贡献者',
    issues: '议题',
    'pull requests': '拉取请求',
    releases: '发行版',
    packages: '软件包',
    followers: '关注者',
    updated: '更新'
  };

  // 多词条目的忽略大小写索引（修复 Community standards / Community Standards 这类差异）
  const DICT_LOWER = (function () {
    const map = Object.create(null);
    Object.keys(DICT).forEach(function (key) {
      if (key.indexOf(' ') === -1) return;
      const lower = key.toLowerCase();
      if (!(lower in map)) map[lower] = DICT[key];
    });
    return map;
  })();

  const ACTION_NAMES = {
    opened: '开启',
    closed: '关闭',
    merged: '合并',
    reopened: '重新开启'
  };

  // 下拉菜单里的「字段：值」前缀
  const FIELD_LABELS = {
    'type': '类型',
    'sort by': '排序',
    'filter': '筛选',
    'language': '语言',
    'state': '状态',
    'label': '标签',
    'milestone': '里程碑',
    'assignee': '负责人',
    'author': '作者',
    'optimized for': '优化目标',
    'reason': '原因',
    'visibility': '可见性',
    'role': '角色'
  };

  // “Good evening, xxx!” 这类问候语
  const GREETINGS = {
    'good morning': '早上好',
    'good afternoon': '下午好',
    'good evening': '晚上好',
    'good night': '晚安',
    'welcome back': '欢迎回来'
  };

  // “No pull requests found” 里的名词
  const LIST_NOUNS = {
    'issue': '议题',
    'issues': '议题',
    'pull request': '拉取请求',
    'pull requests': '拉取请求',
    'discussion': '讨论',
    'discussions': '讨论',
    'repository': '仓库',
    'repositories': '仓库',
    'result': '结果',
    'results': '结果',
    'notification': '通知',
    'notifications': '通知',
    'branch': '分支',
    'branches': '分支',
    'tag': '标签',
    'tags': '标签',
    'file': '文件',
    'files': '文件',
    'commit': '提交',
    'commits': '提交',
    'release': '发行版',
    'releases': '发行版',
    'project': '项目',
    'projects': '项目',
    'member': '成员',
    'members': '成员',
    'workflow': '工作流',
    'workflows': '工作流',
    'package': '软件包',
    'packages': '软件包',
    'user': '用户',
    'users': '用户',
    'package versions': '软件包版本',
    'sponsor': '赞助者',
    'sponsors': '赞助者'
  };

  const PATTERNS = [
    // 数量类
    { re: /^(\d[\d,]*)\s+commits?$/i, fn: (m) => m[1] + ' 次提交' },
    { re: /^(\d[\d,]*)\s+contributors?$/i, fn: (m) => m[1] + ' 位贡献者' },
    { re: /^(\d[\d,]*)\s+branches?$/i, fn: (m) => m[1] + ' 个分支' },
    { re: /^(\d[\d,]*)\s+tags?$/i, fn: (m) => m[1] + ' 个标签' },
    { re: /^(\d[\d,]*)\s+releases?$/i, fn: (m) => m[1] + ' 个发行版' },
    { re: /^(\d[\d,]*)\s+followers?$/i, fn: (m) => m[1] + ' 位关注者' },
    { re: /^(\d[\d,]*)\s+following$/i, fn: (m) => '正在关注 ' + m[1] + ' 人' },
    { re: /^(\d[\d,]*)\s+stars?$/i, fn: (m) => m[1] + ' 个星标' },
    { re: /^(\d[\d,]*)\s+forks?$/i, fn: (m) => m[1] + ' 个复刻' },
    { re: /^(\d[\d,]*)\s+comments?$/i, fn: (m) => m[1] + ' 条评论' },
    { re: /^(\d[\d,]*)\s+watchers?$/i, fn: (m) => m[1] + ' 位关注者' },
    { re: /^(\d[\d,]*)\s+files? changed$/i, fn: (m) => m[1] + ' 个文件已更改' },
    { re: /^(\d[\d,]*)\s+changed files?$/i, fn: (m) => m[1] + ' 个已更改的文件' },
    { re: /^(\d[\d,]*)\s+additions?$/i, fn: (m) => m[1] + ' 处新增' },
    { re: /^(\d[\d,]*)\s+deletions?$/i, fn: (m) => m[1] + ' 处删除' },
    { re: /^Showing\s+([\d,-]+)\s+of\s+([\d,]+)$/i, fn: (m) => '显示 ' + m[1] + '，共 ' + m[2] + ' 条' },
    { re: /^([\d,]+)\s+repository results?$/i, fn: (m) => m[1] + ' 个仓库结果' },
    { re: /^([\d,]+)\s+results?$/i, fn: (m) => m[1] + ' 个结果' },
    // “3.2k results / 1.5m results”
    { re: /^(\d[\d,]*(?:\.\d+)?\s*[kmb]?)\s+results?$/i, fn: (m) => m[1] + ' 个结果' },
    // 语言筛选：“JavaScript language / C++ language”
    { re: /^([A-Za-z0-9+#.\- ]{2,24}?)\s+language$/i, fn: (m) => {
        const name = m[1].trim();
        if (name.toLowerCase() === 'programming') return '编程语言';
        return (translateText(name) || name) + ' 语言';
      }
    },
    { re: /^(\d[\d,]*)\s+repositor(?:y|ies)$/i, fn: (m) => m[1] + ' 个仓库' },
    { re: /^(\d[\d,]*)\s+packages?$/i, fn: (m) => m[1] + ' 个软件包' },
    { re: /^(\d[\d,]*)\s+projects?$/i, fn: (m) => m[1] + ' 个项目' },
    { re: /^(\d[\d,]*)\s+discussions?$/i, fn: (m) => m[1] + ' 个讨论' },
    { re: /^(\d[\d,]*)\s+issues?$/i, fn: (m) => m[1] + ' 个议题' },
    { re: /^(\d[\d,]*)\s+pull requests?$/i, fn: (m) => m[1] + ' 个拉取请求' },
    { re: /^(\d[\d,]*)\s+members?$/i, fn: (m) => m[1] + ' 位成员' },
    { re: /^(\d[\d,]*)\s+teams?$/i, fn: (m) => m[1] + ' 个团队' },
    { re: /^(\d[\d,]*)\s+people$/i, fn: (m) => m[1] + ' 人' },
    { re: /^(\d[\d,]*)\s+notifications?$/i, fn: (m) => m[1] + ' 条通知' },
    { re: /^(\d[\d,]*)\s+unread notifications?$/i, fn: (m) => m[1] + ' 条未读通知' },
    { re: /^(\d[\d,]*)\s+unread$/i, fn: (m) => m[1] + ' 条未读' },
    { re: /^(\d[\d,]*)\s+checks?$/i, fn: (m) => m[1] + ' 项检查' },
    { re: /^(\d[\d,]*)\s+successful checks?$/i, fn: (m) => m[1] + ' 项成功的检查' },
    { re: /^(\d[\d,]*)\s+failing checks?$/i, fn: (m) => m[1] + ' 项失败的检查' },
    { re: /^(\d[\d,]*)\s+pending checks?$/i, fn: (m) => m[1] + ' 项待处理的检查' },
    { re: /^(\d[\d,]*)\s+approvals?$/i, fn: (m) => m[1] + ' 个批准' },
    { re: /^(\d[\d,]*)\s+files?$/i, fn: (m) => m[1] + ' 个文件' },
    { re: /^(\d[\d,]*)\s+folders?$/i, fn: (m) => m[1] + ' 个文件夹' },
    { re: /^(\d[\d,]*)\s+contributions? in the last year$/i, fn: (m) => '过去一年 ' + m[1] + ' 次贡献' },
    { re: /^(\d[\d,]*)\s+contributions?$/i, fn: (m) => m[1] + ' 次贡献' },
    { re: /^(\d[\d,]*)\s+stars? (?:today|this week|this month)$/i, fn: (m) => m[1] + ' 个新增星标' },
    { re: /^Page (\d+) of (\d+)$/i, fn: (m) => '第 ' + m[1] + ' 页，共 ' + m[2] + ' 页' },
    { re: /^Page (\d+)$/i, fn: (m) => '第 ' + m[1] + ' 页' },
    // 面包屑：“1 more breadcrumb items”
    { re: /^(\d+)\s+more breadcrumb items?$/i, fn: (m) => '还有 ' + m[1] + ' 个面包屑项' },
    // 账户设置：“Export all repositories and profile metadata for X. Exports will be available for 7 days.”
    { re: /^Export all repositories and profile metadata for (.+?)\. Exports will be available for (\d+) days\.$/i, fn: (m) => '导出 ' + m[1] + ' 的所有仓库与个人资料元数据。导出文件将在 ' + m[2] + ' 天内可下载。' },
    { re: /^immediately delete all of your repositories \((\d+)\)$/i, fn: (m) => '立即删除你的所有仓库（' + m[1] + '）' },
    { re: /^You will no longer be billed, and after (\d+) days your username will be available to anyone on GitHub\.$/i, fn: (m) => '你将不再被收取费用，' + m[1] + ' 天后你的用户名将对 GitHub 上的任何人开放。' },

    // 贡献图：“3 contributions on November 22nd.”
    { re: /^(\d[\d,]*)\s+contributions? on (.+?)\.?$/i, fn: (m) => {
        const date = translateDatePart(m[2]);
        return date ? date + '有 ' + m[1] + ' 次贡献' : null;
      }
    },
    // “Contribution activity in 2023, 4 of 4”
    { re: /^Contribution activity in (\d{4}), (\d+) of (\d+)$/i, fn: (m) => m[1] + ' 年的贡献活动，第 ' + m[2] + ' 项，共 ' + m[3] + ' 项' },
    // “Created 1 other repository” / “Created 7 commits in 2 repositories”
    { re: /^Created (\d[\d,]*)\s+other repositories$/i, fn: (m) => '创建了 ' + m[1] + ' 个其他仓库' },
    { re: /^Created (\d[\d,]*)\s+other repository$/i, fn: (m) => '创建了 ' + m[1] + ' 个其他仓库' },
    { re: /^Created (\d[\d,]*)\s+commits? in (\d[\d,]*)\s+repositor(?:y|ies)$/i, fn: (m) => '在 ' + m[2] + ' 个仓库中创建了 ' + m[1] + ' 次提交' },
    // “This contribution was made on Nov 23”
    { re: /^This contribution was made on (.+)$/i, fn: (m) => {
        const date = translateDatePart(m[1]);
        return date ? '此贡献于 ' + date + '完成' : null;
      }
    },
    // 单独的时间跨度：“1 week”
    { re: /^(\d+)\s+(second|minute|hour|day|week|month|year)s?$/i, fn: (m) => m[1] + ' ' + UNITS[m[2].toLowerCase()] },
    { re: /^Export all repositories and profile metadata for$/i, fn: () => '导出所有仓库和个人资料元数据：' },
    { re: /^\. Exports will be available for (\d+) days\.$/i, fn: (m) => '。导出文件将在 ' + m[1] + ' 天内可用。' },

    // 日期范围：“November 15, 2026 – November 22, 2026”
    { re: /^(.+?)\s+[–—-]\s+(.+)$/, fn: (m) => {
        const from = translateDatePart(m[1]);
        const to = translateDatePart(m[2]);
        return from && to ? from + ' – ' + to : null;
      }
    },
    // “On main ,”
    { re: /^On (\S+)\s*,$/i, fn: (m) => '在 ' + m[1] + ' 上，' },
    // 图表无障碍描述
    { re: /^Bar chart with (\d+) bars?\.$/i, fn: (m) => '柱状图，共 ' + m[1] + ' 个柱子。' },
    { re: /^The chart has (\d+) X axis displaying (.+?)\.$/i, fn: (m) => '图表有 ' + m[1] + ' 个 X 轴，显示' + (translateText(m[2]) || m[2]) + '。' },
    { re: /^The chart has (\d+) Y axis displaying (.+?)\. Data ranges from (.+) to (.+)\.$/i, fn: (m) => '图表有 ' + m[1] + ' 个 Y 轴，显示' + (translateText(m[2]) || m[2]) + '。数据范围为 ' + m[3] + ' 到 ' + m[4] + '。' },
    // 文件页脚：“223 lines (184 loc) · 10 KB”
    { re: /^(\d[\d,]*)\s+lines?\s+\((\d[\d,]*)\s+loc\)\s+·\s+(.+)$/i, fn: (m) => m[1] + ' 行（' + m[2] + ' 行代码）· ' + m[3] },
    // “with a file smaller than 2GB.”
    { re: /^with a file smaller than (.+?)\.?$/i, fn: (m) => '并使用小于 ' + m[1] + ' 的文件。' },
    // “Too many assets. Releases are limited to 1000 assets.”
    { re: /^Too many assets\. Releases are limited to (\d[\d,]*) assets\.$/i, fn: (m) => '资产过多。每个发行版最多 ' + m[1] + ' 个资产。' },
    // 提交：“Commit d521852” / “commits by jychen089”
    { re: /^Commit ([0-9a-f]{7,40})$/i, fn: (m) => '提交 ' + m[1] },
    { re: /^commits by (.+)$/i, fn: (m) => m[1] + ' 的提交' },
    // 分支：“main branch”（分支名保留）
    { re: /^([A-Za-z0-9._\/-]{2,60})\s+branch$/i, fn: (m) => {
        if (FUNCTION_WORDS[m[1].toLowerCase()]) return null;
        return m[1] + ' 分支';
      }
    },
    // 排序选项：“Most stars / Fewest stars / Fewest forks”
    { re: /^(Most|Fewest) (stars|forks|watchers|comments|reactions|downloads|contributors|issues|pull requests|releases|packages|followers)$/i, fn: (m) => {
        const noun = SORT_NOUNS[m[2].toLowerCase()];
        if (!noun) return null;
        return noun + (m[1].toLowerCase() === 'most' ? '最多' : '最少');
      }
    },
    // 搜索计时：“( 302 ms )”（数据，不翻但也不该上报）
    { re: /^\(?\s*(\d+(?:\.\d+)?)\s*(ms|s)\s*\)?$/i, fn: () => null },

    // 分支同步状态
    { re: /^This branch is (\d+)\s+commits? ahead of (.+)$/i, fn: (m) => '此分支比 ' + m[2] + ' 领先 ' + m[1] + ' 次提交' },
    { re: /^This branch is (\d+)\s+commits? behind (.+)$/i, fn: (m) => '此分支比 ' + m[2] + ' 落后 ' + m[1] + ' 次提交' },
    { re: /^This branch is up to date with (.+)$/i, fn: (m) => '此分支已与 ' + m[1] + ' 同步' },

    // 问候语：“Good evening, xxx!”
    { re: /^(Good morning|Good afternoon|Good evening|Good night|Welcome back),?\s+(.+?)[!！]?$/i, fn: (m) => {
        const greeting = GREETINGS[m[1].toLowerCase()];
        return greeting ? greeting + '，' + m[2] + '！' : null;
      }
    },

    // 空列表：“No pull requests found, try a different filter.”
    { re: /^No (.+?) found,? try a different filter\.?$/i, fn: (m) => {
        const noun = LIST_NOUNS[m[1].toLowerCase()] || m[1];
        return '未找到' + noun + '，请尝试其他筛选条件。';
      }
    },

    // 下拉菜单：“Type: All”“Sort by: Recently starred”
    { re: /^(Type|Sort by|Filter|Language|State|Label|Milestone|Assignee|Author|Optimized for|Reason|Visibility|Role):\s*(.+)$/i, fn: (m) => {
        const label = FIELD_LABELS[m[1].toLowerCase()];
        if (!label) return null;
        const value = translateText(m[2]) || m[2];
        return label + '：' + value;
      }
    },

    // “updated on Oct 4 / created on Oct 4”
    { re: /^(updated|created|committed|released|published|joined|closed|merged|opened|pushed) on (.+)$/i, fn: (m) => {
        const verb = VERB_PREFIX[m[1].toLowerCase()];
        const prefix = verb ? verb.replace(/\s*$/, '') : m[1];
        return prefix + ' ' + (translateDatePart(m[2]) || m[2]);
      }
    },

    // 相对时间 / 未来时间
    { re: TIME_RE, fn: (m) => translateTimePart(m[0]) },
    { re: TIME_ONE_RE, fn: (m) => translateTimePart(m[0]) },
    { re: FUTURE_RE, fn: (m) => translateTimePart(m[0]) },
    { re: FUTURE_ONE_RE, fn: (m) => translateTimePart(m[0]) },
    { re: /^(yesterday|today|just now|now|last week|last month|last year|this week|this month|this year)$/i, fn: (m) => translateTimePart(m[0]) },

    // 日期：句中的英文日期本地化为「10 月 4 日」（带时间与时区的绝对时间戳不翻）
    { re: DATE_RE, fn: (m) => translateDatePart(m[0]) },
    { re: /^No contributions on (.+?)\.?$/i, fn: (m) => {
        const date = translateDatePart(m[1]);
        return date ? date + '没有贡献' : null;
      }
    },
    { re: /^No activity on (.+?)\.?$/i, fn: (m) => {
        const date = translateDatePart(m[1]);
        return date ? date + '没有活动' : null;
      }
    },
    { re: /^(\d+) open and (\d+) closed (projects?|issues?|pull requests?|discussions?) found\.?$/i, fn: (m) => {
        const noun = LIST_NOUNS[m[3].toLowerCase()] || m[3];
        return '找到 ' + m[1] + ' 个进行中和 ' + m[2] + ' 个已关闭的' + noun + '。';
      }
    },
    { re: /^(\d+)\s+remaining$/i, fn: (m) => '剩余 ' + m[1] + ' 个字符' },
    { re: /^(\d[\d,]*)\s+stargazers$/i, fn: (m) => m[1] + ' 个星标' },
    { re: /^(\d[\d,]*)\s+reactions?$/i, fn: (m) => m[1] + ' 个回应' },
    { re: /^(\d[\d,]*)\s+people reacted with (.+)$/i, fn: (m) => {
        const name = REACTION_NAMES[m[2].toLowerCase().trim()];
        return name ? m[1] + ' 人回应了' + name : null;
      }
    },
    { re: /^react with (.+)$/i, fn: (m) => {
        const name = REACTION_NAMES[m[1].toLowerCase().trim()];
        return name ? '以' + name + '回应' : null;
      }
    },
    { re: /^Sort by (.+) (ascending|descending)$/i, fn: (m) => {
        const field = translateText(m[1]) || m[1];
        return '按' + field + (m[2].toLowerCase() === 'ascending' ? '升序' : '降序') + '排序';
      }
    },
    { re: /^I'm not interested in published releases from (.+)$/i, fn: (m) => '我不想看到来自 ' + m[1] + ' 的已发布发行版' },
    { re: /^See fewer (.+)$/i, fn: (m) => '少看到一些' + (LIST_NOUNS[m[1].toLowerCase()] || m[1]) },
    { re: /^Show less (.+)$/i, fn: (m) => '少显示一些' + (LIST_NOUNS[m[1].toLowerCase()] || m[1]) },
    { re: /^Show more (.+)$/i, fn: (m) => '显示更多' + (LIST_NOUNS[m[1].toLowerCase()] || m[1]) },
    { re: /^Link to social profile (\d+)$/i, fn: (m) => '社交资料 ' + m[1] + ' 的链接' },

    // 日期 / 提交列表
    { re: /^Commits on (.+)$/i, fn: (m) => (translateDatePart(m[1]) || m[1]) + ' 的提交' },
    { re: /^(\d[\d,]*)\s+commits? on (.+)$/i, fn: (m) => (translateDatePart(m[2]) || m[2]) + ' 上的 ' + m[1] + ' 次提交' },
    { re: /^Joined on (.+)$/i, fn: (m) => '加入于 ' + (translateDatePart(m[1]) || m[1]) },
    { re: /^Due in (.+)$/i, fn: (m) => { const time = translateTimePart('in ' + m[1]); return time ? time + '到期' : null; } },

    // “opened this issue / merged this pull request” 之类
    { re: /^(opened|closed|merged|reopened)\s+this\s+(issue|pull request|discussion)$/i, fn: (m) => {
        const action = ACTION_NAMES[m[1].toLowerCase()];
        const object = OBJECT_NAMES[m[2].toLowerCase()];
        return action + '了此' + object;
      }
    },
    { re: /^closed this as (completed|not planned)$/i, fn: (m) => '关闭为' + (m[1].toLowerCase() === 'completed' ? '已完成' : '未计划') },

    // 议题 / PR 时间线事件
    { re: /^added (\d[\d,]*)\s+commits?$/i, fn: (m) => '添加了 ' + m[1] + ' 次提交' },
    { re: /^pushed (\d[\d,]*)\s+commits? to (.+)$/i, fn: (m) => '向 ' + m[2] + ' 推送了 ' + m[1] + ' 次提交' },
    { re: /^merged commit ([0-9a-f]+) into (.+)$/i, fn: (m) => '将提交 ' + m[1] + ' 合并到 ' + m[2] },
    { re: /^added the label (.+)$/i, fn: (m) => '添加了标签 ' + m[1] },
    { re: /^removed the label (.+)$/i, fn: (m) => '移除了标签 ' + m[1] },
    { re: /^changed the title$/i, fn: () => '更改了标题' },
    { re: /^requested review from (.+)$/i, fn: (m) => '请求 ' + m[1] + ' 审查' },
    { re: /^approved these changes$/i, fn: () => '批准了这些更改' },
    { re: /^dismissed (?:a |the )?stale review$/i, fn: () => '驳回了过时的审查' },
    { re: /^added this to the (.+) milestone$/i, fn: (m) => '将此添加到 ' + m[1] + ' 里程碑' },
    { re: /^removed this from the (.+) milestone$/i, fn: (m) => '将此从 ' + m[1] + ' 里程碑移除' },
    { re: /^self-assigned this$/i, fn: () => '自行指派了此任务' },
    { re: /^mentioned this (issue|pull request|discussion) in (.+)$/i, fn: (m) => '在 ' + m[2] + ' 中提及了此' + OBJECT_NAMES[m[1].toLowerCase()] },

    // “committed 2 days ago / merged 3 hours ago” 之类
    { re: /^(committed|authored|updated|created|released|published|pushed|deleted|joined|reopened|approved|dismissed|opened|closed|merged)\s+(.+)$/i, fn: (m) => {
        const time = translateTimePart(m[2]);
        if (!time) return null;
        const prefix = VERB_PREFIX[m[1].toLowerCase()];
        const suffix = VERB_SUFFIX[m[1].toLowerCase()] || '';
        if (!prefix) return time + suffix;
        // 数字时间前留空格（提交于 2 天前），中文时间直接相连（提交于昨天）
        return (/^\d/.test(time) ? prefix : prefix.replace(/ $/, '')) + time;
      }
    }
  ];

  /* ================================================================== *
   * 3. 转译核心
   * ================================================================== */

  function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }

  const translateCache = new Map();

  function computeTranslation(core) {
    if (!core) return null;

    if (hasOwn(DICT, core)) return DICT[core];

    // 允许“多个空格/换行”这类排版差异：折叠空白后再查一次
    const collapsed = core.replace(/\s+/g, ' ').trim();
    if (collapsed !== core && hasOwn(DICT, collapsed)) return DICT[collapsed];

    // 多词条目忽略大小写匹配（只对含空格的短语生效，避免误伤 Code / code）
    if (collapsed.indexOf(' ') !== -1) {
      const lower = collapsed.toLowerCase();
      if (DICT_LOWER[lower] !== undefined) return DICT_LOWER[lower];
    }

    for (let i = 0; i < PATTERNS.length; i++) {
      const pattern = PATTERNS[i];
      const match = pattern.re.exec(core);
      if (!match) continue;
      let translated = null;
      try {
        translated = pattern.fn(match);
      } catch (error) {
        translated = null;
      }
      if (typeof translated === 'string' && translated && translated !== core) {
        return translated;
      }
    }

    return null;
  }

  // 开头/结尾的 emoji：GitHub 常把图标当成文字前缀（如“✋ Mentioned”），
  // 直接查词会匹配不到，先剥掉 emoji 再查，最后把 emoji 拼回去
  const EMOJI_RE = /^(?:[\u2190-\u21FF\u2300-\u23FF\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u200D\u20E3]|[\uD800-\uDBFF][\uDC00-\uDFFF])+[\s\uFE0F]*/;
  const EMOJI_TAIL_RE = /[\s\uFE0F]*(?:[\u2190-\u21FF\u2300-\u23FF\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u200D\u20E3]|[\uD800-\uDBFF][\uDC00-\uDFFF])+$/;

  function splitEmoji(text) {
    const head = EMOJI_RE.exec(text);
    let prefix = '';
    let rest = text;
    if (head) {
      prefix = head[0];
      rest = text.slice(prefix.length);
    }
    const tail = EMOJI_TAIL_RE.exec(rest);
    let suffix = '';
    if (tail) {
      suffix = tail[0];
      rest = rest.slice(0, rest.length - suffix.length);
    }
    return { prefix: prefix, core: rest, suffix: suffix };
  }

  function translateText(core) {
    if (!core) return null;
    if (translateCache.has(core)) return translateCache.get(core);

    let translated = computeTranslation(core);

    if (!translated) {
      const parts = splitEmoji(core);
      if (parts.core && (parts.prefix || parts.suffix)) {
        const inner = computeTranslation(parts.core);
        if (inner) translated = parts.prefix + inner + parts.suffix;
      }
    }

    if (translateCache.size >= 2000) translateCache.clear();
    translateCache.set(core, translated);
    return translated;
  }

  // 保留首尾空白，只替换中间的内容
  function translatePreservingSpaces(raw) {
    const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(raw);
    if (!match) return null;
    const core = match[2];
    if (!core) return null;
    const translated = translateText(core);
    if (!translated) return null;
    return match[1] + translated + match[3];
  }

  /* ================================================================== *
   * 3.5 碎片保护：不该翻的零散文本
   *     GitHub 会把一句话拆成多个文本节点，虚词、标点、量词残片
   *     单独翻译只会变成更难看的中英混排
   * ================================================================== */

  // 单个虚词 / 冠词 / 介词：翻了反而破句
  const FUNCTION_WORDS = {
    and: 1, or: 1, to: 1, of: 1, in: 1, on: 1, at: 1, for: 1, with: 1, by: 1, from: 1,
    the: 1, a: 1, an: 1, is: 1, are: 1, was: 1, were: 1, be: 1, been: 1, it: 1,
    this: 1, that: 1, as: 1, if: 1, but: 1, not: 1, no: 1, you: 1, we: 1, they: 1,
    he: 1, she: 1, i: 1, my: 1, your: 1, our: 1, their: 1, its: 1, can: 1, will: 1,
    would: 1, should: 1, could: 1, may: 1, might: 1, do: 1, does: 1, did: 1,
    has: 1, have: 1, had: 1, so: 1, than: 1, then: 1, there: 1, here: 1
  };

  // 数字被拆到另一个节点时，单独的量词名词保留英文（
  // 例：<span>12</span><span>followers</span> 保持 “12 followers”）
  const BARE_UNITS = {
    followers: 1, following: 1, items: 1, commits: 1, stars: 1, forks: 1,
    watchers: 1, contributions: 1, results: 1, packages: 1, projects: 1,
    discussions: 1, members: 1, teams: 1, notifications: 1, branches: 1,
    tags: 1, files: 1, releases: 1, comments: 1, issues: 1, gists: 1,
    sponsors: 1, repositories: 1, lines: 1, bytes: 1, hours: 1, minutes: 1,
    seconds: 1, days: 1, weeks: 1, months: 1, years: 1
  };

  // 纯标点 / 空白（GitHub 会把句号单独吐成一个节点）
  const PUNCT_ONLY_RE = /^[\s.。,，·:：;；!！?？\-–—_/|\\()（）\[\]{}'"“”‘’…]+$/;

  const NOISE_EXACT = {
    'enter': 1, 'esc': 1, 'tab': 1, 'shift': 1, 'ctrl': 1, 'alt': 1, 'cmd': 1,
    'type': 1, 'items': 1, 'users': 1
  };

  // 去掉外层括号（快捷键常写成 “( g then d )”）
  function stripBrackets(text) {
    return text.replace(/^[\s(\[（【]+/, '').replace(/[\s)\]）】]+$/, '');
  }

  // 组合键：alt shift r / ctrl+shift+p / g then d / 单个字母
  const SHORTCUT_RE = /^(?:(?:alt|shift|ctrl|cmd|meta|option|command|fn)\s+)+[a-z0-9+#\/]$|^g then [a-z]$|^[a-z]$/i;

  function shouldSkipFragment(raw) {
    let text = String(raw).trim();
    if (!text) return true;
    if (PUNCT_ONLY_RE.test(text)) return true;
    // 去掉括号后是纯标点 / 快捷键的，也一并跳过
    const unwrapped = stripBrackets(text).trim();
    if (SHORTCUT_RE.test(unwrapped)) return true;
    if (unwrapped !== text) {
      if (!unwrapped) return true;
      if (PUNCT_ONLY_RE.test(unwrapped)) return true;
      text = unwrapped;
    }
    // 有大小写的通常是真实词条（Lists、Repositories），不要误跳过
    if (text !== text.toLowerCase()) return false;
    const lower = text.toLowerCase();
    if (FUNCTION_WORDS[lower]) return true;
    if (BARE_UNITS[lower]) return true;
    if (NOISE_EXACT[lower]) return true;
    return false;
  }

  // 半通顺的中英混排：宁可整句不翻
  let strictSentences = true;

  function isBlockingFragment(raw) {
    const text = String(raw).trim();
    if (!text) return false;
    if (shouldSkipFragment(text)) return false;
    if (!/[A-Za-z]/.test(text)) return false;
    return text.length >= 2;
  }

  /* ================================================================== *
   * 4. DOM 扫描
   *    这些区域属于“代码 / 用户内容”，一律不翻译
   * ================================================================== */

  const SKIP_SELECTOR = [
    'script', 'style', 'noscript', 'template',
    'svg', 'math', 'canvas', 'iframe', 'object', 'embed',
    'pre', 'code', 'kbd', 'samp', 'var',
    'textarea', 'select', 'option', 'optgroup', 'datalist',
    'input[type="hidden"]',
    '[contenteditable]:not([contenteditable="false"])',
    // 用户内容
    '.markdown-body', '.user-content', '[data-testid="markdown-body"]',
    '[data-testid="issue-body"]', '[data-testid="comment-body"]',
    '.comment-body', '.js-comment-body',
    '.markdown-title', '.js-issue-title', '[data-testid="issue-title"]',
    '[data-testid="issue-pr-title-link"]', '.discussion-title', '.release-title',
    '.commit-title', '.commit-desc', '[data-testid="commit-message"]', '.commit-message',
    '.js-navigation-open',
    '.repository-description', '[itemprop="description"]', '.p-note',
    '.branch-name', '.commit-ref', '[data-testid="branch-name"]',
    '.topic-tag', '[data-testid="topic-tag"]',
    '.user-mention', '.team-mention',
    // 代码 / 编辑器
    '.blob-code', '.react-code-lines', '.diff-table', 'table.diff-table', '.highlight',
    '.cm-editor', '.monaco-editor', '.CodeMirror',
    '[role="tree"]', '[role="treeitem"]', '[data-testid="tree-view"]',
    '.react-directory-tree', '[data-testid="code-viewer"]', 'table.files',
    // 自定义跳过区
    '[data-gh-zh-skip]'
  ].join(',');

  const TRANSLATABLE_ATTRS = ['title', 'aria-label', 'placeholder'];
  const OBSERVED_ATTRS = ['title', 'aria-label', 'placeholder', 'value'];

  // 原文备份：关闭中文化时原地还原，不需要刷新页面
  const originalText = new WeakMap();
  const originalAttrs = new WeakMap();
  const lastTranslatedText = new WeakMap();

  // 记录“自己写进去的变更”，避免 MutationObserver 把回写当成新内容
  let selfChangedText = new WeakSet();
  let selfChangedAttrs = new WeakMap();

  function clearSelfChangeTracking() {
    selfChangedText = new WeakSet();
    selfChangedAttrs = new WeakMap();
  }

  // 是否位于代码 / 用户内容区域；会跨越 Shadow DOM 边界检查宿主元素
  function isSkipped(node) {
    let el = null;
    if (!node) return false;

    if (node.nodeType === Node.ELEMENT_NODE) {
      el = node;
    } else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && node.host) {
      el = node.host;
    } else if (node.parentElement) {
      el = node.parentElement;
    } else if (node.parentNode && node.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      el = node.parentNode.host || null;
    }

    while (el) {
      if (el.matches && el.matches(SKIP_SELECTOR)) return true;
      const root = el.getRootNode ? el.getRootNode() : null;
      if (root && root.host) {
        el = root.host;
      } else {
        el = el.parentElement || null;
      }
    }
    return false;
  }

  function markSelfAttr(element, attr) {
    let attrs = selfChangedAttrs.get(element);
    if (!attrs) {
      attrs = new Set();
      selfChangedAttrs.set(element, attrs);
    }
    attrs.add(attr);
  }

  function rememberAttr(element, attr, value) {
    let originals = originalAttrs.get(element);
    if (!originals) {
      originals = Object.create(null);
      originalAttrs.set(element, originals);
    }
    if (!(attr in originals)) originals[attr] = value;
  }

  function forgetAttr(element, attr) {
    const originals = originalAttrs.get(element);
    if (!originals || !(attr in originals)) return;
    delete originals[attr];
    if (!Object.keys(originals).length) originalAttrs.delete(element);
  }

  // 链接文字与 URL 最后一段完全一致时，通常是仓库名 / 用户名 / 应用名，避免误翻
  function isNameLikeLinkText(node, rawText) {
    const parent = node.parentElement;
    if (!parent || !parent.closest) return false;
    const link = parent.closest('a[href]');
    if (!link) return false;

    const href = link.getAttribute('href') || '';
    if (href.charAt(0) !== '/' || href.charAt(1) === '/') return false;

    const path = href.split(/[?#]/)[0].replace(/\/+$/, '');
    const segments = path.split('/').filter(Boolean);
    if (!segments.length) return false;

    let last = segments[segments.length - 1];
    try {
      last = decodeURIComponent(last);
    } catch (error) {
      /* 非法编码时按原样比较 */
    }
    return rawText.trim() === last;
  }

  // 被“整句一致性”规则拦下的文本节点
  let suppressedText = new WeakSet();

  function resetSuppressed() {
    suppressedText = new WeakSet();
  }

  // 一句话只翻一半会变成中英混排，这里改成「要么整句翻，要么整句留英文」
  function shouldSuppressContainer(element) {
    if (!strictSentences) return false;
    const kids = element.childNodes;
    if (!kids || kids.length < 2) return false;

    const texts = [];
    for (let i = 0; i < kids.length; i++) {
      const kid = kids[i];
      if (kid.nodeType !== Node.TEXT_NODE) continue;
      if (!kid.nodeValue || !kid.nodeValue.trim()) continue;
      // 已经翻过的节点要按英文原文判断，否则会误以为“没有可翻内容”
      texts.push(originalText.get(kid) || kid.nodeValue);
    }
    if (texts.length < 2) return false;

    let translatable = 0;
    let blocking = 0;
    for (let i = 0; i < texts.length; i++) {
      if (translatePreservingSpaces(texts[i])) translatable++;
      else if (isBlockingFragment(texts[i])) blocking++;
    }
    if (!translatable || !blocking) return false;

    // 只对“句子”生效：短标签行（Labels / bug）不受影响
    const assembled = texts.join(' ').replace(/\s+/g, ' ').trim();
    if (assembled.split(' ').length < 5) return false;
    return /[.!?]$/.test(assembled);
  }

  // 已经翻过一半的节点，被整句规则拦下时退回英文
  function revertNodeText(node) {
    if (!originalText.has(node)) return 0;
    const original = originalText.get(node);
    if (node.nodeValue === original) return 0;
    selfChangedText.add(node);
    node.nodeValue = original;
    lastTranslatedText.delete(node);
    originalText.delete(node);
    return 1;
  }

  // 前后都是内联元素时，“ or ” / “ and ” 是连接词，应该翻
  const CONNECTOR_RE = /^(\s+)(or|and)(\s+)$/i;
  const CONNECTORS = { or: '或', and: '和' };

  // 中文句尾的半角标点改全角（仅当前一段是中文时）
  const PUNCT_MAP = { '?': '？', '!': '！', '.': '。' };
  const CJK_TAIL_RE = /[\u3400-\u9fff\uf900-\ufaff]$/;

  function previousRenderedText(node) {
    const parent = node.parentNode;
    if (!parent || !parent.childNodes) return '';
    const kids = parent.childNodes;
    for (let i = 0; i < kids.length; i++) {
      if (kids[i] !== node) continue;
      for (let j = i - 1; j >= 0; j--) {
        const sib = kids[j];
        let value = '';
        if (sib.nodeType === Node.TEXT_NODE) value = sib.nodeValue || '';
        else if (sib.nodeType === Node.ELEMENT_NODE) value = sib.textContent || '';
        if (value && value.trim()) return value;
      }
      return '';
    }
    return '';
  }

  function localizePunctuation(node, text) {
    const core = text.trim();
    if (core.length !== 1 || !PUNCT_MAP[core]) return null;
    const prev = previousRenderedText(node);
    if (!prev || !CJK_TAIL_RE.test(prev)) return null;
    return text.replace(core, PUNCT_MAP[core]);
  }

  function translateNodeText(node) {
    const text = node.nodeValue;
    if (!text || !text.trim()) return 0;
    if (suppressedText.has(node)) return 0;
    if (lastTranslatedText.get(node) === text) return 0;

    const connector = CONNECTOR_RE.exec(text);
    let next = null;

    if (connector) {
      next = connector[1] + CONNECTORS[connector[2].toLowerCase()] + connector[3];
    } else {
      // 标点本地化要抢在“跳过碎片”之前，否则 “?” 会被当纯标点直接丢掉
      const punct = localizePunctuation(node, text);
      if (punct && punct !== text) {
        next = punct;
      } else {
        if (shouldSkipFragment(text)) return 0;
        next = translatePreservingSpaces(text);
      }
    }
    if (!next || next === text) return 0;
    if (isNameLikeLinkText(node, text)) return 0;

    if (!originalText.has(node)) originalText.set(node, text);
    selfChangedText.add(node);
    node.nodeValue = next;
    lastTranslatedText.set(node, next);
    return 1;
  }

  function translateElementAttributes(element) {
    let changed = 0;

    for (let i = 0; i < TRANSLATABLE_ATTRS.length; i++) {
      const attr = TRANSLATABLE_ATTRS[i];
      const value = element.getAttribute(attr);
      if (!value || !value.trim()) continue;
      const next = translatePreservingSpaces(value);
      if (!next || next === value) continue;

      rememberAttr(element, attr, value);
      markSelfAttr(element, attr);
      element.setAttribute(attr, next);
      changed++;
    }

    // input 按钮的 value 也是界面文案
    if (element.tagName === 'INPUT') {
      const type = (element.getAttribute('type') || '').toLowerCase();
      if (type === 'submit' || type === 'button' || type === 'reset') {
        const value = element.getAttribute('value');
        if (value && value.trim()) {
          const next = translatePreservingSpaces(value);
          if (next && next !== value) {
            rememberAttr(element, 'value', value);
            markSelfAttr(element, 'value');
            element.setAttribute('value', next);
            changed++;
          }
        }
      }
    }

    return changed;
  }

  // 自身属于“跳过区”但仍是界面控件的元素：只翻属性，不翻内容
  function attrsOnlyElement(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
    if (node.tagName === 'TEXTAREA' || node.tagName === 'SELECT' || node.tagName === 'INPUT') return true;
    return !!node.hasAttribute && node.hasAttribute('contenteditable');
  }

  function translateTree(root) {
    if (!root) return 0;

    if (isSkipped(root)) {
      if (attrsOnlyElement(root)) return translateElementAttributes(root);
      return 0;
    }

    const stack = [root];
    let changed = 0;

    while (stack.length) {
      const node = stack.pop();

      if (node.nodeType === Node.TEXT_NODE) {
        changed += translateNodeText(node);
        continue;
      }

      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        const kids = node.childNodes;
        for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i]);
        continue;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      if (node.matches(SKIP_SELECTOR)) {
        // 文本域 / 下拉框 / 可编辑区本身是界面控件，只跳过其内容，仍翻译 placeholder / aria-label
        if (attrsOnlyElement(node)) changed += translateElementAttributes(node);
        continue;
      }

      changed += translateElementAttributes(node);

      const suppress = shouldSuppressContainer(node);
      const directKids = node.childNodes;
      if (directKids && directKids.length) {
        for (let i = 0; i < directKids.length; i++) {
          const kid = directKids[i];
          if (kid.nodeType !== Node.TEXT_NODE) continue;
          if (suppress) {
            suppressedText.add(kid);
            changed += revertNodeText(kid);
          } else {
            suppressedText.delete(kid);
          }
        }
      }

      const children = node.childNodes;
      for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);

      // GitHub 的 relative-time / clipboard-copy 等组件内容位于 Shadow DOM
      if (node.shadowRoot) {
        observeRoot(node.shadowRoot);
        stack.push(node.shadowRoot);
      }
    }

    return changed;
  }

  function restoreTree(root) {
    if (!root) return 0;

    const stack = [root];
    let changed = 0;

    while (stack.length) {
      const node = stack.pop();

      if (node.nodeType === Node.TEXT_NODE) {
        if (originalText.has(node)) {
          const original = originalText.get(node);
          originalText.delete(node);
          lastTranslatedText.delete(node);
          if (node.nodeValue !== original) {
            selfChangedText.add(node);
            node.nodeValue = original;
            changed++;
          }
        }
        continue;
      }

      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        const kids = node.childNodes;
        for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i]);
        continue;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) continue;

      const originals = originalAttrs.get(node);
      if (originals) {
        Object.keys(originals).forEach(function (attr) {
          const original = originals[attr];
          if (node.getAttribute(attr) !== original) {
            markSelfAttr(node, attr);
            node.setAttribute(attr, original);
            changed++;
          }
        });
        originalAttrs.delete(node);
      }

      const children = node.childNodes;
      for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
      if (node.shadowRoot) stack.push(node.shadowRoot);
    }

    return changed;
  }

  function restoreAll() {
    if (document.body) restoreTree(document.body);
    restoreTitle();
  }

  // 浏览器标签页标题："Pull requests · owner/repo"
  let originalTitle = null;
  let appliedTitle = null;

  function translateTitle() {
    const raw = document.title;
    if (!raw || raw === appliedTitle) return;

    // GitHub 在单页导航后会改写标题，此时旧的备份已经失效
    if (raw !== appliedTitle) originalTitle = raw;

    const index = raw.indexOf(' · ');
    const head = (index >= 0 ? raw.slice(0, index) : raw).trim();
    const tail = index >= 0 ? raw.slice(index) : '';
    if (!head) return;

    const translated = translateText(head);
    if (!translated) return;

    document.title = translated + tail;
    appliedTitle = document.title;
  }

  function restoreTitle() {
    if (originalTitle !== null) {
      document.title = originalTitle;
      originalTitle = null;
    }
    appliedTitle = null;
  }

  /* ================================================================== *
   * 5. 批量调度 + MutationObserver：处理动态加载与单页导航
   * ================================================================== */

  const pendingRoots = new Set();
  let observedRoots = new WeakSet();
  let flushTimer = null;
  let observer = null;

  function observeRoot(root) {
    if (!observer || !root || observedRoots.has(root)) return;
    observedRoots.add(root);
    try {
      observer.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: OBSERVED_ATTRS
      });
    } catch (error) {
      /* 某些节点不可观察时忽略 */
    }
  }

  function scheduleTranslate(root) {
    if (root instanceof Set) {
      root.forEach(function (item) { pendingRoots.add(item); });
    } else if (root) {
      pendingRoots.add(root);
    }
    if (flushTimer) return;
    flushTimer = setTimeout(flush, 60);
  }

  function flush() {
    flushTimer = null;

    const roots = Array.from(pendingRoots);
    pendingRoots.clear();

    if (!enabled || !document.body) return;

    if (roots.length > 40) {
      // 节点过于零散时直接整页重扫，避免大量小范围查询
      translateTree(document.body);
    } else {
      for (let i = 0; i < roots.length; i++) {
        const root = roots[i];
        if (!root || !root.isConnected) continue;
        translateTree(root);
      }
    }
    translateTitle();
    mountToggle();
  }

  function handleMutations(records) {
    if (!enabled) return;

    const roots = new Set();
    let forceFull = false;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const target = record.target;

      if (record.type === 'childList') {
        if (record.addedNodes.length > 300) forceFull = true;
        for (let n = 0; n < record.addedNodes.length; n++) {
          const node = record.addedNodes[n];
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            roots.add(node);
          }
        }
      } else if (record.type === 'characterData') {
        if (selfChangedText.has(target)) {
          selfChangedText.delete(target);
          continue;
        }
        // GitHub 自己改了文本，旧的英文备份已失效
        originalText.delete(target);
        lastTranslatedText.delete(target);
        roots.add(target);
      } else if (record.type === 'attributes') {
        const attr = record.attributeName;
        const attrs = selfChangedAttrs.get(target);
        if (attrs && attrs.has(attr)) {
          attrs.delete(attr);
          if (!attrs.size) selfChangedAttrs.delete(target);
          continue;
        }
        forgetAttr(target, attr);
        roots.add(target);
      }
    }

    if (forceFull) {
      scheduleTranslate(document.body);
    } else if (roots.size) {
      scheduleTranslate(roots);
    }
  }

  function ensureObserver() {
    if (observer || !document.documentElement) return;
    observer = new MutationObserver(handleMutations);
    observeRoot(document.documentElement);
  }

  // 单页导航后丢弃旧页面的 Shadow Root，避免长期会话中观察列表不断增长
  function resetObserver() {
    if (!observer) return;
    observer.disconnect();
    observedRoots = new WeakSet();
    clearSelfChangeTracking();
    observeRoot(document.documentElement);
  }

  function scanAll() {
    if (!document.body) return;
    resetSuppressed();
    translateTree(document.body);
    translateTitle();
  }

  // 整页扫描后丢弃“自己造成的”变更记录，避免它们反过来淹没真正的动态更新
  function scanAllAndForgetRecords() {
    scanAll();
    if (observer && observer.takeRecords) observer.takeRecords();
    clearSelfChangeTracking();
  }

  /* ================================================================== *
   * 6. 右下角「中 / EN」开关
   * ================================================================== */

  const TOGGLE_ID = 'gh-zh-toggle';
  let refreshToggleLabel = null;

  function mountToggle() {
    if (!document.body) return;
    if (document.getElementById(TOGGLE_ID)) return;

    const host = document.createElement('div');
    host.id = TOGGLE_ID;
    host.setAttribute('data-gh-zh-skip', '');
    // 关键：host 上也要禁止选中，否则手机长按会先选中「中」字
    host.style.cssText = [
      'position:fixed', 'right:16px', 'bottom:88px', 'z-index:2147483647',
      '-webkit-user-select:none', 'user-select:none',
      '-webkit-touch-callout:none', '-webkit-tap-highlight-color:transparent'
    ].join(';') + ';';

    const shadow = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

    const style = document.createElement('style');
    style.textContent = [
      ':host{all:initial}',
      ':host{-webkit-user-select:none;user-select:none;touch-action:manipulation}',
      'button{all:unset;box-sizing:border-box;display:flex;align-items:center;justify-content:center;',
      'width:30px;height:30px;border-radius:50%;border:1px solid rgba(31,35,40,.15);',
      'color:#24292f;background:#fff;box-shadow:0 1px 3px rgba(31,35,40,.12);',
      'font:600 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif;',
      'cursor:pointer;opacity:.55;transition:opacity .15s ease;',
      // all:unset 会把 user-select 重置成 auto，这里补回来，避免长按选字
      '-webkit-user-select:none;user-select:none;',
      '-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;',
      'touch-action:manipulation;overscroll-behavior:contain}',
      'button::selection{background:transparent}',
      'button::-moz-selection{background:transparent}',
      'button:hover,button:focus-visible{opacity:1}',
      '@media (prefers-color-scheme:dark){button{color:#e6edf3;background:#21262d;border-color:rgba(240,246,252,.15);box-shadow:0 1px 3px rgba(1,4,9,.4)}}'
    ].join('');
    shadow.appendChild(style);

    const button = document.createElement('button');
    button.type = 'button';

    function updateLabel() {
      button.textContent = enabled ? '中' : 'EN';
      button.setAttribute('aria-label', (enabled ? '关闭 GitHub 中文化' : '开启 GitHub 中文化') + '（长按查看漏翻清单）');
      button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      button.title = (enabled
        ? 'GitHub 中文化：已开启，点击即时切换为英文'
        : 'GitHub 中文化：已关闭，点击即时切换为中文') + '；长按查看漏翻清单';
    }
    updateLabel();
    refreshToggleLabel = updateLabel;

    /* ---------- 长按开关：针对 Android WebView（Via 等）做过防选字处理 ---------- */

    // 手指 500ms，鼠标 650ms（鼠标点击慢一点不该被当成长按）
    const LONG_PRESS_TOUCH_MS = 500;
    const LONG_PRESS_MOUSE_MS = 650;
    const MOVE_TOLERANCE = 8;

    let pressTimer = null;
    let pressStartX = 0;
    let pressStartY = 0;
    let pressStartedAt = 0;
    let pressThreshold = LONG_PRESS_TOUCH_MS;
    let pressPointerType = 'touch';
    let longPressed = false;
    let panelOpenedByPress = false;

    function clearPress() {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
      pressStartedAt = 0;
    }

    function clearSelection() {
      try {
        const selection = window.getSelection && window.getSelection();
        if (selection && selection.rangeCount) selection.removeAllRanges();
      } catch (error) {
        /* 取消失败时忽略 */
      }
    }

    function buzz() {
      try {
        if (navigator.vibrate) navigator.vibrate(12);
      } catch (error) {
        /* 不支持震动时忽略 */
      }
    }

    function openPanelFromPress() {
      if (panelOpenedByPress) return;
      panelOpenedByPress = true;
      longPressed = true;
      clearPress();
      clearSelection();
      buzz();
      showMissingPanel();
    }

    function beginPress(x, y, pointerType) {
      longPressed = false;
      panelOpenedByPress = false;
      clearPress();
      pressStartX = x;
      pressStartY = y;
      pressPointerType = pointerType || 'touch';
      pressThreshold = pressPointerType === 'mouse' ? LONG_PRESS_MOUSE_MS : LONG_PRESS_TOUCH_MS;
      pressStartedAt = Date.now();
      pressTimer = setTimeout(openPanelFromPress, pressThreshold);
    }

    function movedTooFar(x, y) {
      return Math.abs(x - pressStartX) > MOVE_TOLERANCE || Math.abs(y - pressStartY) > MOVE_TOLERANCE;
    }

    // 浏览器抢走手势（发起选字 / 滚动）时不会触发 pointerup，
    // 如果已经按住够久，这里补开面板
    function cancelByGesture() {
      const held = pressStartedAt ? Date.now() - pressStartedAt : 0;
      const wasLongEnough = held >= pressThreshold;
      clearPress();
      if (wasLongEnough) openPanelFromPress();
    }

    if (window.PointerEvent) {
      button.addEventListener('pointerdown', function (event) {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        beginPress(event.clientX || 0, event.clientY || 0, event.pointerType);
      });

      button.addEventListener('pointermove', function (event) {
        if (!pressTimer) return;
        if (movedTooFar(event.clientX || 0, event.clientY || 0)) clearPress();
      });

      button.addEventListener('pointerup', function () {
        clearPress();
      });

      button.addEventListener('pointercancel', cancelByGesture);
      button.addEventListener('pointerleave', function () {
        // 鼠标只是把光标移出去，不应被当成“手势被抢”，直接取消
        if (pressPointerType === 'mouse') clearPress();
        else cancelByGesture();
      });
    } else {
      // 老 WebView 没有 Pointer Events，退回 touch 事件
      button.addEventListener('touchstart', function (event) {
        const touch = event.touches && event.touches[0];
        beginPress(touch ? touch.clientX : 0, touch ? touch.clientY : 0, 'touch');
      }, { passive: true });

      button.addEventListener('touchmove', function (event) {
        if (!pressTimer) return;
        const touch = event.touches && event.touches[0];
        if (touch && movedTooFar(touch.clientX, touch.clientY)) clearPress();
      }, { passive: true });

      button.addEventListener('touchend', function () { clearPress(); });
      button.addEventListener('touchcancel', cancelByGesture);
    }

    // 阻止选中文字 / 拖拽图片，这是「长按选中中字」的直接原因
    function blockSelection(event) {
      event.preventDefault();
    }

    ['selectstart', 'dragstart'].forEach(function (type) {
      shadow.addEventListener(type, blockSelection, true);
      host.addEventListener(type, blockSelection, true);
    });

    // 手机长按的系统菜单 / 电脑右键，都直接当作“打开清单”
    function onContextMenu(event) {
      event.preventDefault();
      event.stopPropagation();
      openPanelFromPress();
    }
    shadow.addEventListener('contextmenu', onContextMenu, true);
    host.addEventListener('contextmenu', onContextMenu, true);

    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (longPressed) {
        // 这次点击是长按的收尾，不要切换语言
        longPressed = false;
        panelOpenedByPress = false;
        return;
      }
      setEnabled(!enabled);
    });

    shadow.appendChild(button);
    document.body.appendChild(host);
  }


  /* ================================================================== *
   * 7. 初始化
   * ================================================================== */

  let enabled = readEnabled();

  function readEnabled() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === null ? true : value !== '0';
    } catch (error) {
      return true;
    }
  }

  function setEnabled(value) {
    const next = !!value;
    if (next === enabled) return;

    enabled = next;
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
    } catch (error) {
      /* 存储不可用时忽略 */
    }
    if (refreshToggleLabel) refreshToggleLabel();

    if (enabled) {
      ensureObserver();
      scanAllAndForgetRecords();
    } else {
      restoreAll();
    }
  }

  function onSoftNavigation() {
    resetObserver();
    if (!enabled) return;
    scheduleTranslate(document.body);
  }

  function ready() {
    if (enabled) {
      ensureObserver();
      scanAllAndForgetRecords();
    }
    document.addEventListener('turbo:load', onSoftNavigation);
    document.addEventListener('pjax:end', onSoftNavigation);
    document.addEventListener('turbo:load', mountToggle);
    document.addEventListener('pjax:end', mountToggle);
    mountToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready, { once: true });
  } else {
    ready();
  }

  /* ================================================================== *
   * 8. 漏翻检测：找出“像界面英文、但词库没有”的文案
   *    用于补词库：手机端长按「中」按钮可打开清单
   * ================================================================== */

  const CJK_RE = /[\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/;
  const HAS_LETTER_RE = /[A-Za-z]/;
  const IDENT_RE = /[/\\_@#<>{}[\]$^~`|]/;
  const URLISH_RE = /^(https?:\/\/|www\.)/i;
  const FILENAME_RE = /^[\w.-]+\.(md|markdown|txt|js|mjs|cjs|ts|tsx|jsx|json|ya?ml|toml|ini|lock|png|jpe?g|gif|svg|webp|ico|css|scss|html?|xml|sh|bat|ps1|py|java|c|h|cpp|go|rs|rb|php|sql)$/i;
  const SHA_RE = /^[0-9a-f]{7,40}$/i;
  const NUMERIC_RE = /^[\d\s.,:%+\-–—/()]+$/;

  // 绝对时间戳（带时区 / 时刻）：按 Q1 不翻译，也不上报
  const TIMESTAMP_RE = /(\d{1,2}:\d{2})|\b(GMT|UTC)[+-]?\d/i;

  // 版权行
  const COPYRIGHT_RE = /^©/;

  // 编程语言名：专有名词，不翻也不报
  const LANGUAGE_NAMES = {
    'markdown': 1, 'json': 1, 'yaml': 1, 'xml': 1, 'csv': 1,
    'python': 1, 'javascript': 1, 'typescript': 1, 'java': 1, 'kotlin': 1,
    'c++': 1, 'c#': 1, 'c': 1, 'go': 1, 'rust': 1, 'ruby': 1, 'php': 1,
    'swift': 1, 'shell': 1, 'html': 1, 'css': 1, 'scss': 1, 'sass': 1,
    'vue': 1, 'svelte': 1, 'dart': 1, 'elixir': 1, 'haskell': 1, 'scala': 1,
    'lua': 1, 'r': 1, 'julia': 1, 'assembly': 1, 'dockerfile': 1, 'makefile': 1,
    'powershell': 1, 'perl': 1, 'clojure': 1, 'erlang': 1, 'f#': 1, 'ocaml': 1,
    'groovy': 1, 'tex': 1, 'matlab': 1, 'solidity': 1, 'mdx': 1, 'astro': 1,
    'razor': 1, 'cuda': 1, 'nix': 1, 'zig': 1, 'objective-c': 1,
    'jupyter notebook': 1, 'vim script': 1, 'blade': 1, 'procfile': 1
  };

  const MISSING_MAX_LENGTH = 120;
  const SENTENCE_MAX_LENGTH = 160;

  // 键盘快捷键记号：g then d / alt shift r / enter / 单个字母
  const KEYBOARD_RE = /^(g then [a-z]|(?:alt|shift|ctrl|cmd|meta|option|command)\s+[a-z]|(?:alt|shift|ctrl|cmd|meta|option|command)(?:\s+(?:alt|shift|ctrl|cmd|meta|option|command))*\s+[a-z0-9]|[a-z]|[a-z]\+[a-z])$/i;

  // 括号包裹的用户名：(jychen089)
  const PAREN_NAME_RE = /^\([A-Za-z0-9-]{2,30}\)$/;

  // 文件名 + 类型标记：README.md, (File) / docs, (Directory)
  const FILE_LABEL_RE = /^[\w.\- ]+,\s*\((File|Directory|Symlink|Submodule|Executable File)\)$/;

  // 技术 / 辅助技术专用标签：Repo Details 2-0、repository body 3、Release interactions 1
  const SCREEN_READER_RE = /^(repo details|repository body|release interactions)\b/i;

  // 数字缩写：4.8k / 1.2m
  const ABBREV_NUM_RE = /^\d+(?:\.\d+)?\s*[kmb]?$/i;

  // 过滤器 slug：contributed-by、most-starred
  const SLUG_RE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)+$/;

  // 含 ISO 日期：Nightly Build 2026-11-17（发行版名称）
  const ISO_DATE_RE = /\b\d{4}-\d{2}-\d{2}\b/;

  // 搜索计时：( 302 ms )
  const TIMING_RE = /^\(?\s*\d+(?:\.\d+)?\s*(ms|s)\s*\)?$/i;

  // 文件大小：10 KB / 2GB
  const FILE_SIZE_RE = /^\d+(?:\.\d+)?\s*(B|KB|MB|GB|TB)$/i;

  // 全小写单 token：大概率是用户名 / 仓库名 / 过滤器值（如 terryhu）
  const USERNAME_LIKE_RE = /^[a-z][a-z0-9-]{2,29}$/;

  // 判断一段文本是否“像界面英文”
  function looksLikeUiText(raw) {
    const text = String(raw).replace(/\s+/g, ' ').trim();
    if (text.length < 2 || text.length > MISSING_MAX_LENGTH) return false;
    if (!HAS_LETTER_RE.test(text)) return false;
    if (CJK_RE.test(text)) return false;
    if (shouldSkipFragment(text)) return false;
    if (URLISH_RE.test(text)) return false;
    if (IDENT_RE.test(text)) return false;
    if (FILENAME_RE.test(text)) return false;
    if (SHA_RE.test(text)) return false;
    if (NUMERIC_RE.test(text)) return false;
    return true;
  }

  // 该被忽略、不该出现在清单里的文本（时间戳、语言名、版权、快捷键等）
  function isNoiseText(raw) {
    const text = String(raw).replace(/\s+/g, ' ').trim();
    if (!text) return true;
    if (TIMESTAMP_RE.test(text)) return true;
    if (COPYRIGHT_RE.test(text)) return true;
    if (KEYBOARD_RE.test(text)) return true;
    if (LANGUAGE_NAMES[text.toLowerCase()]) return true;
    if (ABBREV_NUM_RE.test(text)) return true;
    if (TIMING_RE.test(text)) return true;
    if (FILE_SIZE_RE.test(text)) return true;
    if (PAREN_NAME_RE.test(text)) return true;
    if (knownIdentities.has(text.toLowerCase())) return true;
    if (FILE_LABEL_RE.test(text)) return true;
    if (SCREEN_READER_RE.test(text)) return true;
    // 全小写单词基本是用户名 / 标识符；词库已有的（如 settings）不受影响
    if (USERNAME_LIKE_RE.test(text) && !hasOwn(DICT, text)) return true;
    if (SLUG_RE.test(text)) return true;
    if (ISO_DATE_RE.test(text)) return true;
    // 反应名：用户决定不翻
    if (REACTION_NAMES[text.toLowerCase()]) return true;
    // 纯大写短词：HIFI / PC / WIFI 这类设备名或标识
    if (/^[A-Z0-9#+._-]{2,6}$/.test(text) && !/[a-z]/.test(text)) return true;
    return false;
  }

  // 当前用户 / 仓库所有者，用于过滤“Clevsr”这类用户名
  let knownIdentities = new Set();

  function collectIdentities() {
    const set = new Set();
    try {
      const metas = document.querySelectorAll('meta[name="user-login"], meta[name="octolytics-dimension-user_login"], meta[name="octolytics-dimension-repository_owner"]');
      for (let i = 0; i < metas.length; i++) {
        const value = (metas[i].getAttribute('content') || '').trim().toLowerCase();
        if (value) set.add(value);
      }
    } catch (error) {
      /* 不支持时忽略 */
    }
    const segments = String(location.pathname || '').split('/').filter(Boolean);
    if (segments.length >= 2) set.add(segments[0].toLowerCase());
    return set;
  }

  const MISSING_ATTRS = ['title', 'aria-label', 'placeholder'];

  // 更新日志 / 博客链接：标题是内容不是界面文案（用户已同意不翻）
  const CHANGELOG_RE = /(github\.blog|\/changelog)/i;

  function isInChangelogLink(element) {
    let node = element;
    while (node && node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'A') {
        const href = node.getAttribute('href') || '';
        if (CHANGELOG_RE.test(href)) return true;
      }
      node = node.parentElement;
    }
    return false;
  }

  // 提交信息是用户内容：链接指向 /commit/ 一律不上报
  function isInCommitLink(element) {
    let node = element;
    while (node && node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'A') {
        const href = node.getAttribute('href') || '';
        if (/\/commit\//.test(href)) return true;
      }
      node = node.parentElement;
    }
    return false;
  }

  // Feed 卡片里成句的较长文本基本是仓库描述 / 发行说明（用户内容），不上报
  function isFeedDescription(node) {
    const text = String(node.nodeValue || '').trim();
    if (text.length < 24) return false;

    let el = node.parentElement;
    let depth = 0;
    while (el && depth < 6) {
      if (el.tagName === 'ARTICLE' || el.getAttribute('role') === 'article') return true;
      el = el.parentElement;
      depth++;
    }
    return false;
  }

  // 把被拆散的句子拼起来，避免同一句上报 N 个碎片
  function sentenceGroupOf(node) {
    const single = { text: String(node.nodeValue || '').replace(/\s+/g, ' ').trim(), sentence: false };
    const parent = node.parentElement;
    if (!parent || !parent.childNodes) return single;

    const texts = [];
    const kids = parent.childNodes;
    for (let i = 0; i < kids.length; i++) {
      const kid = kids[i];
      if (kid.nodeType !== Node.TEXT_NODE) continue;
      if (!kid.nodeValue || !kid.nodeValue.trim()) continue;
      texts.push(kid.nodeValue.trim());
    }
    if (texts.length < 2) return single;

    const assembled = texts.join(' ').replace(/\s+/g, ' ').trim();
    if (!assembled || assembled === single.text) return single;
    if (assembled.length > SENTENCE_MAX_LENGTH) return single;
    if (assembled.split(' ').length < 3) return single;
    return { text: assembled, sentence: true };
  }

  function adviceFor(entry) {
    if (/\d/.test(entry.text)) return '规则';
    if (entry.sentence) return '碎片';
    return '词条';
  }

  function collectMissing(limit) {
    knownIdentities = collectIdentities();
    const found = new Map();
    const cap = Math.min(Math.max(Number(limit) || 300, 20), 1000);

    function add(raw, kind) {
      if (typeof raw !== 'string') return;
      const text = raw.replace(/\s+/g, ' ').trim();
      if (!looksLikeUiText(text)) return;
      if (isNoiseText(text)) return;
      if (translateText(text)) return;

      const key = kind + '\u0000' + text;
      const entry = found.get(key);
      if (entry) {
        entry.count++;
        return;
      }
      if (found.size >= cap) return;
      found.set(key, { text: text, count: 1, kind: kind, sentence: kind === 'sentence' });
    }

    function addAttributes(element) {
      for (let i = 0; i < MISSING_ATTRS.length; i++) {
        const value = element.getAttribute(MISSING_ATTRS[i]);
        if (value) add(value, MISSING_ATTRS[i]);
      }
      if (element.tagName === 'INPUT') {
        const type = (element.getAttribute('type') || '').toLowerCase();
        if (type === 'submit' || type === 'button' || type === 'reset') {
          const value = element.getAttribute('value');
          if (value) add(value, 'value');
        }
      }
    }

    // 同一个容器里的多个碎片属于同一句，只上报一次
    const groupedParents = new WeakSet();

    // 整句里的每个碎片都能翻（或属于可跳过的碎片）时，就不该上报
    function allFragmentsCovered(parent) {
      const kids = parent.childNodes || [];
      let sawText = false;
      for (let i = 0; i < kids.length; i++) {
        const kid = kids[i];
        if (kid.nodeType !== Node.TEXT_NODE) continue;
        const raw = kid.nodeValue;
        if (!raw || !raw.trim()) continue;
        sawText = true;
        if (translatePreservingSpaces(raw)) continue;
        if (shouldSkipFragment(raw)) continue;
        return false;
      }
      return sawText;
    }

    function walk(root) {
      if (!root) return;
      const stack = [root];

      while (stack.length) {
        const node = stack.pop();

        if (node.nodeType === Node.TEXT_NODE) {
          const raw = node.nodeValue;
          if (!raw || !raw.trim()) continue;
          if (shouldSkipFragment(raw)) continue;
          if (node.parentElement && isNameLikeLinkText(node, raw)) continue;
          if (node.parentElement) {
            if (isInChangelogLink(node.parentElement)) continue;
            if (isInCommitLink(node.parentElement)) continue;
            if (isFeedDescription(node)) continue;
          }

          const group = sentenceGroupOf(node);
          if (group.sentence) {
            const parent = node.parentElement;
            if (parent) {
              if (groupedParents.has(parent)) continue;
              groupedParents.add(parent);
              // 所有碎片都能翻时，整句已经通了，不用上报
              if (allFragmentsCovered(parent)) continue;
            }
            add(group.text, 'sentence');
          } else {
            add(raw, 'text');
          }
          continue;
        }

        if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          const fragKids = node.childNodes;
          for (let i = fragKids.length - 1; i >= 0; i--) stack.push(fragKids[i]);
          continue;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        const skipped = node.matches(SKIP_SELECTOR);
        if (skipped) {
          if (!attrsOnlyElement(node)) continue;
          addAttributes(node);
          continue;
        }

        addAttributes(node);

        if (node === panelHost) continue;

        const kids = node.childNodes;
        for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i]);
        if (node.shadowRoot) stack.push(node.shadowRoot);
      }
    }

    walk(document.body);

    const list = Array.from(found.values());
    list.forEach(function (entry) { entry.advice = adviceFor(entry); });
    list.sort(function (a, b) {
      if (b.count !== a.count) return b.count - a.count;
      return a.text.localeCompare(b.text);
    });
    return list;
  }

  function missingReport(options) {
    const opts = options || {};
    const list = collectMissing(opts.limit);
    if (!list.length) return '没有发现漏翻的界面英文，词库覆盖良好。';

    const KIND_LABELS = { text: '文本', sentence: '整句' };
    const lines = list.map(function (entry) {
      const kind = KIND_LABELS[entry.kind] || '属性:' + entry.kind;
      return entry.count + '\t' + kind + '\t' + entry.advice + '\t' + entry.text;
    });

    const header = '待补翻译 ' + list.length + ' 条（v' + VERSION + '，次数\t来源\t建议\t原文）：';
    if (opts.asDict) {
      const dictLines = list.map(function (entry) {
        return "    '" + entry.text.replace(/'/g, "\\'") + "': '',";
      });
      return header + '\n' + lines.join('\n') + '\n\nDICT 占位：\n' + dictLines.join('\n');
    }
    return header + '\n' + lines.join('\n');
  }

  // 兜底复制：部分手机浏览器没有 navigator.clipboard 权限
  function copyViaTextarea(text) {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('data-gh-zh-skip', '');
      area.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
      document.body.appendChild(area);
      area.focus();
      area.select();
      const ok = document.execCommand ? document.execCommand('copy') : false;
      document.body.removeChild(area);
      return !!ok;
    } catch (error) {
      return false;
    }
  }

  function copyText(text) {
    let clipboardPromise = null;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        clipboardPromise = navigator.clipboard.writeText(text);
      }
    } catch (error) {
      clipboardPromise = null;
    }

    if (clipboardPromise && typeof clipboardPromise.then === 'function') {
      return clipboardPromise.then(function () {
        return true;
      }, function () {
        return copyViaTextarea(text);
      });
    }

    return Promise.resolve(copyViaTextarea(text));
  }

  const PANEL_ID = 'gh-zh-missing';
  let panelHost = null;

  function closeMissingPanel() {
    if (panelHost && panelHost.parentNode) panelHost.parentNode.removeChild(panelHost);
    panelHost = null;
  }

  function showMissingPanel() {
    if (!document.body || !document.createElement) return null;

    if (panelHost) {
      closeMissingPanel();
    }

    const host = document.createElement('div');
    host.id = PANEL_ID;
    host.setAttribute('data-gh-zh-skip', '');
    host.style.cssText = 'position:fixed;right:16px;bottom:130px;z-index:2147483647;';

    const shadow = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

    const style = document.createElement('style');
    style.textContent = [
      ':host{all:initial}',
      '.panel{box-sizing:border-box;width:min(360px,92vw);max-height:60vh;display:flex;flex-direction:column;',
      'border:1px solid rgba(31,35,40,.15);border-radius:8px;background:#fff;color:#24292f;',
      'box-shadow:0 8px 24px rgba(31,35,40,.2);',
      'font:12px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif}',
      '.head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid rgba(31,35,40,.1)}',
      '.title{flex:1;font-weight:600}',
      '.btn{all:unset;box-sizing:border-box;padding:4px 10px;border-radius:6px;border:1px solid rgba(31,35,40,.15);',
      'background:#f6f8fa;cursor:pointer;font-size:12px}',
      '.btn:hover{background:#eaeef2}',
      '.list{overflow:auto;padding:4px 0}',
      '.row{display:flex;gap:8px;padding:5px 12px;align-items:baseline}',
      '.row:hover{background:#f6f8fa}',
      '.cnt{min-width:22px;text-align:right;color:#57606a;font-variant-numeric:tabular-nums}',
      '.txt{flex:1;word-break:break-word}',
      '.kind{color:#8c959f;font-size:11px}',
      '.empty{padding:16px 12px;color:#57606a}',
      '.foot{padding:8px 12px;border-top:1px solid rgba(31,35,40,.1);color:#57606a}',
      '@media (prefers-color-scheme:dark){.panel{background:#161b22;color:#e6edf3;border-color:rgba(240,246,252,.15)}',
      '.btn{background:#21262d;border-color:rgba(240,246,252,.15);color:#e6edf3}.btn:hover{background:#30363d}',
      '.row:hover{background:#21262d}.cnt,.empty,.foot,.kind{color:#8b949e}.head,.foot{border-color:rgba(240,246,252,.1)}}'
    ].join('');
    shadow.appendChild(style);

    const panel = document.createElement('div');
    panel.className = 'panel';

    const head = document.createElement('div');
    head.className = 'head';

    const title = document.createElement('span');
    title.className = 'title';

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn';
    copyBtn.textContent = '复制';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn';
    closeBtn.textContent = '关闭';

    head.appendChild(title);
    head.appendChild(copyBtn);
    head.appendChild(closeBtn);

    const list = document.createElement('div');
    list.className = 'list';

    const foot = document.createElement('div');
    foot.className = 'foot';

    panel.appendChild(head);
    panel.appendChild(list);
    panel.appendChild(foot);
    shadow.appendChild(panel);

    let current = [];

    function render() {
      current = collectMissing(300);
      list.textContent = '';

      if (!current.length) {
        const empty = document.createElement('div');
        empty.className = 'empty';
        empty.textContent = '没有发现漏翻的界面英文。';
        list.appendChild(empty);
      } else {
        current.forEach(function (entry) {
          const row = document.createElement('div');
          row.className = 'row';

          const count = document.createElement('span');
          count.className = 'cnt';
          count.textContent = String(entry.count);

          const text = document.createElement('span');
          text.className = 'txt';
          text.textContent = entry.text;

          const kind = document.createElement('span');
          kind.className = 'kind';
          kind.textContent = entry.kind === 'sentence' ? '整句' : (entry.kind === 'text' ? entry.advice : entry.kind);

          row.appendChild(count);
          row.appendChild(text);
          row.appendChild(kind);
          list.appendChild(row);
        });
      }

      title.textContent = '待补翻译 ' + current.length + ' 条 · v' + VERSION;
      foot.textContent = '长按「中」按钮打开此清单 · 复制后发给作者（含版本号）';
    }

    copyBtn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      copyBtn.textContent = '复制中…';
      copyText(missingReport({ limit: 300 })).then(function (ok) {
        copyBtn.textContent = ok ? '已复制' : '复制失败';
        setTimeout(function () { copyBtn.textContent = '复制'; }, 1500);
      });
    });

    closeBtn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeMissingPanel();
    });

    render();
    document.body.appendChild(host);
    panelHost = host;
    return current;
  }

  /* ================================================================== *
   * 9. 调试 / 扩展接口
   * ================================================================== */

  window.__GH_ZH__ = {
    version: VERSION,
    dict: DICT,
    patterns: PATTERNS,
    translateText: translateText,
    translateTree: translateTree,
    translateAll: scanAll,
    restoreAll: restoreAll,
    setEnabled: setEnabled,
    isEnabled: function () {
      return enabled;
    },
    // 句子一致性开关（半通顺时整句不翻）
    setStrictSentences: function (value) {
      strictSentences = !!value;
      scanAll();
      return strictSentences;
    },
    // 漏翻检测
    findMissing: function (limit) {
      return collectMissing(limit);
    },
    missingReport: missingReport,
    copyMissing: function () {
      return copyText(missingReport({ limit: 300 }));
    },
    showMissingPanel: showMissingPanel
  };
})();
