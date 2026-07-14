# Authentication Flow & Routing Architecture Migration Report

This document details the architectural migration from a tab-state routing system to a standard, URL-based router leveraging `react-router-dom` with strict role-based route separation and access guards.

---

## 1. Executive Summary

The application has been restructured to separate access into two independent, secure entry points:
1. **Developer Portal** (`/dashboard`): Accessible only to system architects, with custom telemetry, API gateway logs, credit ledger, and operational feature gates.
2. **User Workspace** (`/workspace`): Accessible only to standard/pro/business users, with tools for image background separation, batch processing, downloads, history, and user settings.

---

## 2. Routing Map & Protection Matrix

The application's routing is managed by `react-router-dom`. The following matrix outlines the routing rules:

| Route | View Name | Access Level | Unauthenticated Redirection |
| :--- | :--- | :--- | :--- |
| `/` | Public Landing Page | Public | Already logged-in → `/workspace` (User) or `/dashboard` (Dev) |
| `/auth` | Google Completion Gateway | Public | N/A (Temporary routing splash) |
| `/workspace` | User Studio Workspace | `User` Role | Redirect to `/` |
| `/workspace/batch` | Parallel Batch Processor | `User` Role | Redirect to `/` |
| `/history` | User Activity History | `User` Role | Redirect to `/` |
| `/downloads` | User Download Center | `User` Role | Redirect to `/` |
| `/settings` | User Settings Center | `User` Role | Redirect to `/` |
| `/dashboard/login` | Developer Login | Public | Already logged-in → `/dashboard` |
| `/dashboard` | Developer Dashboard | `Developer` Role | Redirect to `/dashboard/login` |

---

## 3. Key Components Implemented

### A. Dual-Mode Authentication Portal (`AuthPortal.tsx`)
A pristine, animated card layout configured via a `mode: 'user' | 'developer'` prop:
* **User Mode**: Streamlined Google Authentication with brand logos, supporting single-click, zero-password onboarding.
* **Developer Mode**: Secure email-and-password verification with standard admin mock credentials (`developer@vision.ai` / `admin_secure_902`).

### B. Route-Level Protection Guards (`App.tsx`)
A `ProtectedRoute` component wraps all workspace and dashboard endpoints:
* Evaluates `currentUser.role` directly.
* Instantly redirects users if they attempt to view the `/dashboard` route.
* Instantly redirects developers if they attempt to view any `/workspace` or settings routes.

### C. Developer Dashboard (`DeveloperDashboard.tsx`)
A dark-themed dashboard presenting live operations stats:
* **Realtime Telemetry**: Polling simulations tracking CPU load, neural vRAM utilization, and active CUDA queues.
* **Credit Arbitrage Ledger**: Live interactive panel to modify individual user tokens by `+5`/`-5`.
* **Global Operational Gates**: Custom feature toggles to disable GPU workloads or enforce billing limits.
* **Live System Logs Console**: An authentic monospace diagnostic console receiving rolling system triggers in real time.

### D. Subscription Tier Validation Schema
The legacy role limits inside single and batch processing have been refactored to align with subscription plans (`Free`, `Pro`, `Business`):
* **Free Plan**: 5MB upload limits, restricted from parallel batch processing.
* **Pro Plan**: 20MB file upload limits, full parallel batching enabled.
* **Business Plan**: 50MB file upload limits, enterprise batching capacity.
* Settings Center tab is cleared of unrequested telemetry and focused entirely on the user's subscription upgrade logs, api tokens, and webhook configurations.

---

## 4. Migration Sign-off

* **Linter Status**: Pass (0 errors)
* **Build Compilation Status**: Success
* **Development Server**: Active on Port `3000`
