# Invitely.gg
**Send Invitations at Scale On Your Behalf**

Invitely.gg is a **server-first**, production platform designed to send invitations at scale with high reliability, type safety, and minimal client-side overhead.  
The system embraces a **engineering philosophy**: simple primitives, explicit data flow, and predictable performance.

---

## Tech Stack

### Core Architecture & UI

- **Framework:** Next.js 16.2 (App Router)  
  - Server-Side Rendering (SSR)
  - Streaming responses
  - Server Actions
- **Runtime UI:** React 19.2  
  - `use` hook
  - Zero-bundle server logic
- **Styling:** Tailwind CSS 4.0  
  - Oxide engine for high-performance builds
- **Animations:** Motion 12  
  - Layout-aware, hardware-accelerated transitions
- **Dev Experience:** Turbopack  
  - Ultra-fast HMR and incremental builds

---

### Backend & Infrastructure

- **Runtime:** Node.js 20+ (LTS)
- **Database:** PostgreSQL
- **ORM:** Prisma 7.4  
  - `@prisma/adapter-pg` for low-latency serverless access
- **Authentication:** Better Auth 1.5  
  - Fully type-safe
  - Native Prisma integration
- **Email Infrastructure:** Resend 6.9  
  - Transactional + batch email delivery

---

### Validation & Utilities

- **Schema Validation:** Zod 4.3  
  - End-to-end type safety
- **Icons:** Lucide React, Phosphor Icons

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Vinodbiradar09/Invitely.gg.git
cd Invitely.gg
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add the following variables:
```env
# Authentication
BETTER_AUTH_SECRET=p0_v3ry_long_r4ndom_str1ng_h3r3_dont_reuse_dev
BETTER_AUTH_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=postgresql://Invitely:Invitely@localhost:5433/Invitely?schema=public

# Email
RESEND_API_KEY=re_prod_AbC123
FROM="Invitely.gg <noreply@invitely.gg>"

# AI (Optional / Feature-specific)
GEMINI_API_KEY=your_gemini_api_key
URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000
VERCEL_URL=invitely-gg.vercel.app

# Cron / Security
CRON_SECRET=generate_a_complex_uuid_for_cron_security
```

### 4. Database Setup & Migration
```bash
npx prisma migrate dev
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```

The app will be available at:
```
http://localhost:3000
```

---

## Architecture Philosophy

- **Server-first by default** — Client components are opt-in, not the norm.
- **Type safety everywhere** — From database → API → UI.
- **Minimal abstraction** — No magic, no hidden state.
- **Predictable performance** — Every query, render, and side-effect is intentional.

---

## 🤝 Contributing

We love contributions! Whether it's fixing a bug, adding a feature, or improving UI:

### Workflow

1. Fork the repository
2. Create a feature branch
```bash
   git checkout -b feature/amazing-feature
```
3. Make your changes
4. Commit using Conventional Commits
```bash
   git commit -m "feat: add scalable invitation batching"
```
5. Push your branch
```bash
   git push origin feature/amazing-feature
```
6. Open a Pull Request
