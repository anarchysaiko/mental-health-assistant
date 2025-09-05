# Mental Health Assistant

这是一个心理健康助手应用，使用 Next.js 15 和 React 开发。

## 功能

- 情绪日记
- 呼吸练习
- AI 聊天
- 用户认证

## 技术栈

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Vercel Postgres (用于用户认证)

## 部署到 Vercel

1. 在 Vercel 上创建新项目并连接到你的 Git 仓库
2. 在 Vercel 项目设置中添加以下环境变量：
   - `QWEN_API_KEY`: 你的通义千问 API 密钥
   - `JWT_SECRET`: 用于 JWT 令牌签名的密钥
   - `POSTGRES_URL`: Vercel Postgres 数据库连接字符串（Vercel 会自动设置）
3. 在 Vercel 上部署项目

## 本地开发

1. 克隆项目
2. 安装依赖：
   ```bash
   npm install
   ```
3. 创建 `.env.local` 文件并添加环境变量：
   ```
   QWEN_API_KEY=your-qwen-api-key
   JWT_SECRET=your-jwt-secret
   POSTGRES_URL=your-postgres-connection-string
   ```
   注意：在本地开发时，你需要自己提供一个 Postgres 数据库并设置连接字符串。
   如果你没有 Postgres 数据库，可以考虑使用 Docker 启动一个本地实例：
   ```bash
   docker run -d -p 5432:5432 -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydb postgres
   ```
   然后在 `.env.local` 中设置：
   ```
   POSTGRES_URL=postgresql://myuser:mypassword@localhost:5432/mydb
   ```
4. 初始化数据库表：
   ```bash
   npx tsx src/lib/init-db.ts
   ```
5. 运行开发服务器：
   ```bash
   npm run dev
   ```

## 项目结构

- `src/app`: 页面和 API 路由
- `src/components`: React 组件
- `src/contexts`: React 上下文
- `src/hooks`: 自定义 React hooks
- `src/lib`: 工具函数和数据库连接
- `src/types`: TypeScript 类型定义

## 认证

应用使用 JWT 令牌进行用户认证。登录后，令牌将存储在 HTTP-only cookie 中。
