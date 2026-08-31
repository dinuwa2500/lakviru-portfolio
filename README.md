# Lakviru Perera — Software Engineer Portfolio & CMS

A high-performance personal portfolio and administrative CMS built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and PostgreSQL (Prisma ORM).

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- pnpm (or npm / yarn)
- PostgreSQL database (e.g. Neon, Supabase, or local)

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and configure your environment variables:

```bash
cp .env.example .env.local
```

Required environment variables in `.env.local`:

```env
# Database connection string
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# Strong 32+ character authentication secret
AUTH_SECRET="your-32-char-random-jwt-secret"

# GitHub username to synchronize
GITHUB_USERNAME="your-github-username"
GITHUB_TOKEN="" # Optional: GitHub Personal Access Token

# Public Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Initial Admin Credentials
DEFAULT_ADMIN_EMAIL="admin@yourdomain.com"
DEFAULT_ADMIN_PASSWORD="YourSecurePassword123!"
```

### 3. Install Dependencies & Generate Database Client
```bash
pnpm install
pnpm run build
```

### 4. Run the Development Server
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin CMS.

---

## Deployment on Vercel

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Configure the environment variables (`DATABASE_URL`, `AUTH_SECRET`, `GITHUB_USERNAME`, `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD`) in **Project Settings → Environment Variables**.
4. Click **Deploy**.
