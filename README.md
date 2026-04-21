<div align="center">

<a href="https://invitely-gg.vercel.app">
  <img
    alt="Invitely.gg – Send Invitations at Scale, On Your Behalf."
    src="https://github.com/Vinodbiradar09/Invitely.gg/blob/main/public/invitely.jpeg?raw=true"
    width="80"
    height="80"
  >
</a>

<h3>Invitely.gg</h3>

<p>
  Send Invitations at Scale, On Your Behalf.
  <br />
  <a href="https://invitely-gg.vercel.app"><strong>Learn more »</strong></a>
  <br />
  <br />
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a>
</p>

<p>
  <a href="https://github.com/Vinodbiradar09/Invitely.gg/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Vinodbiradar09/Invitely.gg?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
  <a href="https://github.com/Vinodbiradar09/Invitely.gg/stargazers">
    <img src="https://img.shields.io/github/stars/Vinodbiradar09/Invitely.gg?style=flat&logo=github&color=f80&logoColor=fff" alt="Stars" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16.1-black?logo=next.js&logoColor=fff" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=fff" alt="TypeScript" />
</p>

</div>

<br/>

## Introduction

Invitely.gg is a server-first platform for sending invitations at scale — built for reliability, type safety, and minimal client-side overhead. Give us your list, and we handle the rest. Professional, automated, and sent on your behalf.

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [React](https://react.dev/) – UI
- [TypeScript](https://www.typescriptlang.org/) – language
- [Tailwind CSS](https://tailwindcss.com/) – styling
- [Motion](https://motion.dev/) – animations
- [PostgreSQL](https://www.postgresql.org/) – database
- [Prisma](https://www.prisma.io/) – ORM
- [Better Auth](https://better-auth.com/) – authentication
- [Resend](https://resend.com/) – email delivery
- [Zod](https://zod.dev/) – validation
- [Vercel](https://vercel.com/) – deployments

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL running locally or remotely

### 1. Clone the repository

```bash
git clone https://github.com/Vinodbiradar09/Invitely.gg.git
cd Invitely.gg
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the root:

```env
# Auth
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5433/invitely?schema=public

# Email
RESEND_API_KEY=re_your_api_key
FROM="Invitely.gg <noreply@invitely.gg>"

# AI (optional)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000

# Cron security
CRON_SECRET=your_cron_secret_uuid
```

### 4. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Architecture

- **Server-first** — Client components are opt-in, not the norm.
- **Type-safe end to end** — Database → API → UI.
- **Minimal abstractions** — No magic, no hidden state.
- **Predictable performance** — Every query and render is intentional.

## Contributing

We love contributions! Here's how you can contribute:

- [Open an issue](https://github.com/Vinodbiradar09/Invitely.gg/issues) if you've encountered a bug.
- Follow the [contributing guide](./CONTRIBUTING.md) to set up your local dev environment.
- Make a [pull request](https://github.com/Vinodbiradar09/Invitely.gg/pulls) to add features or fix bugs.

## Security

See [SECURITY.md](./SECURITY.md) for our responsible disclosure policy.

## License

[MIT](./LICENSE)
