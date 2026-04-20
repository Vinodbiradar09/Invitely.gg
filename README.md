# Invitely.gg

> Send Invitations at Scale, On Your Behalf.

Invitely.gg is a server-first platform for sending invitations at scale built for reliability, type safety, and minimal client-side overhead.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1 (App Router, SSR, Streaming, Server Actions) |
| UI | React 19.2 |
| Styling | Tailwind CSS 4.0 (Oxide engine) |
| Animations | Motion 12 |
| Database | PostgreSQL + Prisma 7.4 |
| Auth | Better Auth 1.5 |
| Email | Resend 6.9 |
| Validation | Zod 4.3 |
| Runtime | Node.js 20+ |

---

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

Copy the example below into a `.env` file at the root:

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

---

## Architecture

- **Server-first** — Client components are opt-in.
- **Type-safe end to end** — Database → API → UI.
- **Minimal abstractions** — No magic, no hidden state.
- **Predictable performance** — Every query and render is intentional.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Security

See [SECURITY.md](./SECURITY.md).

## License

[MIT](./LICENSE)
