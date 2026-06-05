# TianJi-SiZhu 项目指南

## 项目简介

天机四柱 — 开源八字排盘 Web 应用（React + Vite），部署于 Cloudflare Pages

## 技术栈

- **前端框架**: React 18 + TypeScript + Vite + TailwindCSS
- **排盘算法**: mystilight-8char (纯前端 JS)
- **可视化**: ECharts
- **数据存储**: IndexedDB (排盘记录) + localStorage (设置)
- **部署平台**: Cloudflare Pages (纯静态 SPA)

## Commit 规范

使用 Conventional Commits:
- `feat:` 新功能
- `fix:` 修复
- `docs:` 文档
- `refactor:` 重构
- `test:` 测试
- `chore:` 构建/工具

## 注意事项

1. 不要自行发起 git 操作，除非用户明确要求
2. 代码注释用英文（与社区一致）
3. 使用 bun 管理依赖
4. 每次修改前先读后写，理解现有代码再改
5. 构建产物不提交到 git

## 关键路径

- 前端入口: `src/main.tsx`
- 排盘算法: `src/lib/bazi/calculator.ts`
- 存储层: `src/lib/storage/db.ts`
- Prompt 生成: `src/lib/prompt/generator.ts`
- 页面: `src/pages/`
- 组件: `src/components/`
- Vite 配置: `vite.config.ts`

## 构建命令

```bash
# 安装依赖
bun install

# 开发模式
bun dev

# 生产构建
bun run build

# 预览构建产物
bun run preview

# 部署到 Cloudflare Pages
bun run deploy
```

## 部署

Cloudflare Pages 配置：
- Build command: `bun run build`
- Build output directory: `dist`
- 已配置 `_redirects` 支持 SPA 路由
