# GIF (Gsm Idea Festival) - Frontend Guide

## Project Overview

GIF is a comprehensive management service designed to efficiently operate the entire process of the Gwangju Software Meister High School Idea Festival. Moving away from traditional manual processes, GIF integrates all workflows into a single platform to maximize operational efficiency. This ranges from student (Client) team project management and material submission, to administrator (Admin) tasks—which are subdivided by teacher roles (Idea Festival Coordinator, Major Subject Teacher, General Subject Teacher, and Head of Grade)—such as form creation, submission status tracking, evaluation, and score aggregation.

## Tech Stack

- **Framework & Core:** Next.js 15 (App Router), React 19, TypeScript 5
- **Monorepo Strategy:** Turborepo 2
- **Data Fetching & State:** TanStack Query 5 (React Query), Axios
- **Styling & UI:** Tailwind CSS 4, Sonner (Toast Library)
- **Package Manager:** npm

## Key Commands

### Project-wide Development & Build

- `npm run dev` : Run the development server for the entire monorepo
- `npm run build` : Build all projects in the monorepo
- `npm run lint` : Run code linting checks

### App-specific Execution (Based on npm workspace)

- `npm run dev -w apps/admin` : Run the development server for the Admin app only
- `npm run dev -w apps/client` : Run the development server for the Client app only

## Code Style & Architecture Guidelines

### 1. Monorepo Structure (Turborepo 2)

- `apps/admin`: Admin web service for teachers (Coordinator, Major, General, Head of Grade)
- `apps/client`: Client web service for students (Team project management and material submission)
- `packages/*`: Shared components (ui), common configurations, and utility files

### 2. Next.js 15 & React 19 Development Rules

- All components must be authored as Server Components by default. Explicitly declare the `'use client'` directive at the very top of the file only when using state management, event handling, or TanStack Query hooks.
- Write robust, standardized code by leveraging the latest features of React 19 and Next.js 15, such as asynchronous Server Actions, data mutation handling, and updated caching behaviors.

### 3. Data Fetching Rules (TanStack Query 5 & Axios)

- API requests must be modularized and managed using Axios instances.
- Server data synchronization and caching must strictly adhere to TanStack Query v5 conventions, including the mandatory use of array-type `queryKey`, `useQuery`, and `useMutation`.

### 4. Role-based Authorization

- **Admin:** Ensure robust UI branching and page-level access control (via Middleware and Layouts) based on the teacher's specific role (Idea Festival Coordinator, Major Subject Teacher, General Subject Teacher, Head of Grade).
- **Client:** Verify team membership to ensure that any student belonging to the respective team (both the team leader and team members) can freely submit and modify project materials.

---

## Harness: GIF Development & Git Workflow

**Goal:** Enforce consistent development patterns (API layer, components, pages) and automate the full git pipeline.

### Development Workflow
- **Full feature** (API + UI together): use `gif-feature` skill
- **API only** (service + hooks): use `gif-api` skill
- **Page/component only**: use `gif-component` skill

### Git Workflow
- **Any git operation** (commit, push, PR, review comments): use `gif-workflow` skill

Simple code questions can be answered directly without a skill.

**Change History:**
| Date | Change | Target | Reason |
|------|--------|--------|--------|
| 2026-06-01 | Initial setup — git workflow harness | All | - |
| 2026-06-01 | Added development harness (feature, API, component) | All | Project-wide coding pattern enforcement |
