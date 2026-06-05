# 天机四柱 (TianJi-SiZhu)

> 开源四柱排盘，为 AI 解读而生

本项目 fork 自 [hhx465453939/tianji-sizhu](https://github.com/hhx465453939/tianji-sizhu)，在原桌面客户端（Wails + Go）基础上重构为纯前端 Web 应用，部署于 Cloudflare Pages。

一款开源的八字（四柱）排盘 Web 应用，集成美观可视化界面、完整神煞大运系统、浏览器本地数据持久化，以及面向 AI 大模型的结构化 Prompt 生成能力。

## 在线体验

部署于 Cloudflare Pages，无需安装，打开浏览器即可使用。

## 功能特性

- **完整排盘**: 四柱、十神、五行、大运、流年、神煞
- **数据可视化**: 五行雷达图、大运时间轴、关系连线图
- **本地存储**: IndexedDB 浏览器端持久化，完全离线可用
- **AI Prompt 生成**: 一键生成结构化命理分析提示词（支持多种模板）
- **导出备份**: 一键导出 JSON，方便数据迁移
- **纯前端**: 无后端依赖，所有计算在浏览器完成

## 技术栈

- **前端**: React 18 + TypeScript + Vite + TailwindCSS
- **排盘算法**: mystilight-8char
- **可视化**: ECharts
- **存储**: IndexedDB + localStorage
- **部署**: Cloudflare Pages

## 开发

```bash
# 安装依赖
bun install

# 开发模式
bun dev

# 生产构建
bun run build

# 预览构建产物
bun run preview
```

## 部署到 Cloudflare Pages

方式一：直接命令行部署
```bash
bun run deploy
```

方式二：连接 GitHub 仓库自动部署
- Build command: `bun run build`
- Build output directory: `dist`

## 环境要求

- Bun 1.0+（或 Node.js 18+）

## 致谢

本项目的诞生离不开以下优秀开源项目的启发与支持：

| 项目 | 贡献 |
|------|------|
| [tianji-sizhu (原版)](https://github.com/hhx465453939/tianji-sizhu) | 本项目的上游仓库，原始 Wails 桌面客户端实现 |
| [mystilight-8char](https://github.com/mystilight/mystilight-8char) | 核心排盘算法引擎，提供完整的四柱、十神、神煞、大运计算能力 |
| [8Char-H5](https://github.com/mrsunx/8Char-H5) | 基于 UniAPP 的八字排盘工具，功能设计上给予了重要参考 |
| [cantian-ai/bazi-mcp](https://github.com/cantian-ai/bazi-mcp) | JSON 结构化输出与 RESTful API 设计思路的参考 |
| [命语 (mingyu)](https://github.com/nicekid1/mingyu) | "排盘 + AI Prompt"深度结合的前瞻性理念启发 |
| [ECharts](https://github.com/apache/echarts) | 强大的数据可视化图表库 |

同时感谢开源命理社区中众多无私分享算法与经验的开发者们。

## 协议

见 [LICENSE](./LICENSE) 文件。
