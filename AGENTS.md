# AGENTS.md

> AI Agent Operating Rules — CampusConnect
> Project Type: Full-Stack Web Application

## 1. Project Overview

CampusConnect is a production-grade full-stack web application designed as a portfolio piece, evolving a single-file MVP into a fully deployable platform. It features real data persistence, user authentication, event management, appointment scheduling, and an AI chat integration. 

The project strictly optimizes for industry credibility, maintainability, and learning velocity over rapid prototyping or overly clever solutions. The codebase must reflect standard modern web development practices that a hiring manager would recognize, ensuring that the architecture is clean, secure, and easily explainable.

## 2. Tech Stack & Constraints

**Approved Core & Libraries:**
- Next.js 15 (App Router)
- React 19
- TypeScript (Strict Mode enabled)
- TailwindCSS
- shadcn/ui
- Zod (for all input and schema validation)
- Node.js & Express (Backend API)
- Prisma ORM & PostgreSQL
- NextAuth.js v5 (Auth.js with JWT sessions)

**Forbidden (Do NOT use):**
- Redux (Use React Query or Server State)
- styled-components (Use TailwindCSS)
- `any` types in TypeScript
- Calling Gemini API from the frontend (Must use backend proxy)
- Introducing new paid services, unapproved packages, or unapproved database migrations

## 3. Core Conventions & Architecture

The repository follows a strict monorepo structure separating the client and server:

- `frontend/`: Next.js 15 App Router. Contains `app/` for routing, `components/` for reusable UI, and `lib/` for API clients.
- `backend/`: Express.js server. Contains `src/routes/` for API endpoints, `src/controllers/` for business logic, and `prisma/schema.prisma` for data modeling.
- `shared/types/`: Single source of truth for TypeScript interfaces shared between frontend and backend.

**Key Patterns:**
- **Security:** Never expose secrets or password hashes. Implement Role-Based Access Control (RBAC).
- **UI States:** Every page must implement structured loading (skeletons), error, and empty states. 
- **Error Handling:** APIs must return predictable, structured JSON errors.

For deep documentation on coding standards, file sizes, and specific design patterns, reference: `agent_docs/code_conventions.md`.

## 4. Commands & Hooks

Before considering any task complete, verify correctness by running the following commands. All must pass without errors.

- **Build:** `npm run build`
- **Test:** `npm run test`
- **Local Dev:** `npm run dev` (Starts frontend + backend)
- **Database:** `npm run docker:up` (PostgreSQL), `npm run db:migrate` (Migrations), `npm run db:seed` (Mock Data)
- **Code Quality:** `npm run lint` and `npm run type-check`
- **E2E Tests:** `npm run test:e2e` (Playwright)
