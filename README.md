# 心灵守护者 - 心理健康助手

这是一个基于Next.js的心理健康助手应用，为用户提供情绪支持和心理健康资源。

## 功能特性

- 情绪日记：记录和追踪情绪变化
- 呼吸练习：帮助缓解焦虑和压力
- 心理对话：与AI助手进行情感交流
- 账号系统：用户注册和登录功能

## 账号系统

本应用包含一个简单的账号系统，用户可以通过注册创建账户，并使用用户名和密码登录。

### 功能说明

- 用户注册：新用户可以创建账户
- 用户登录：已注册用户可以登录系统
- 路由保护：未登录用户无法访问主页
- 用户登出：用户可以安全退出系统

### 技术实现

- 使用SQLite数据库存储用户信息
- 使用bcrypt进行密码加密
- 使用React Context进行状态管理
- 使用localStorage存储用户会话信息

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
