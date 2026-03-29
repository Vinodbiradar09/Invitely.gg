# Invitely.gg

Send Invitations At Scale On Your Behalf

## Tech Stack

Invitely.gg is built with a focus on **Server-First** architecture, utilizing modern primitives for speed, safety, and a "Brutalist" engineering aesthetic.
### Core Architecture & UI
- **Framework:** [Next.js 16.2 (App Router)](https://nextjs.org/) — Utilizing **Server-Side Rendering (SSR)** and Streaming for instant page loads.
- **Development DX:** Powered by **Turbopack** for 400% faster HMR (Hot Module Replacement).
- **Library:** [React 19.2](https://react.dev/) — Leveraging the new `use` hook and Actions for zero-bundle-size logic.
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/) — Next-gen styling via the high-performance **Oxide engine**.
- **Animations:** [Motion 12](https://motion.dev/) — Layout-aware, hardware-accelerated transitions.

### Backend & Infrastructure
- **Database:** [PostgreSQL](https://www.postgresql.org/) — Enterprise-grade relational storage.
- **ORM:** [Prisma 7.4](https://www.prisma.io/) — Optimized with `@prisma/adapter-pg` for low-latency serverless queries.
- **Authentication:** [Better Auth 1.5](https://better-auth.com/) — Fully type-safe session management with native Prisma integration.
- **Email:** [Resend 6.9](https://resend.com/) — Scalable infrastructure for transactional event updates.

### Validation & Intelligence
- **Type Safety:** [Zod 4.3](https://zod.dev/) — End-to-end schema validation from API to UI.
- **Icons:** [Lucide React](https://lucide.dev/) & Phosphor Icons.
- **Runtime:** Node.js 20+ LTS.

installation
### 1. Clone the repository
git clone https://github.com/Vinodbiradar09/Invitely.gg.git
cd Invitely.gg
### 2. Install dependencies
npm install
### 3. Environment Setup
Create a .env file in the root directory and populate the following variables:

BETTER_AUTH_SECRET=p0_v3ry_long_r4ndom_str1ng_h3r3_dont_reuse_dev
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
DATABASE_URL="postgresql://Invitely:Invitely@localhost:5433/Invitely?schema=public"
RESEND_API_KEY=re_prod_AbC123...
FROM="Invitely.gg <noreply@invitely.gg>"
GEMINI_API_KEY=your_gemini_api_key
URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000
CRON_SECRET=generate_a_complex_uuid_for_cron_security
VERCEL_URL=invitely-gg.vercel.app
### 4. Database Migration
npx prisma migrate
npx prisma generate
npx prisma db push
### 5. Run the development server
npm run dev


🤝 Contributing
We love contributions! Whether it's fixing a bug, adding a feature, or improving ui:

Fork the repo.

Create a Branch (git checkout -b feature/amazing-feature).

Commit Changes (Follow Conventional Commits).

Push to the branch (git push origin feature/amazing-feature).

Open a Pull Request.
