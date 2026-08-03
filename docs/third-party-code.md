# Third-Party Code

| Package | Why it was chosen |
|---|---|
| `next` (16.2.12) | App framework — routing, API routes, and rendering, so frontend and backend live in one project. |
| `react` / `react-dom` (19.2.4) | Required peer dependencies of Next.js for building the UI. |
| `typescript` | Catches shape mismatches between the Prisma schema, API responses, and UI props at compile time. |
| `tailwindcss` / `@tailwindcss/postcss` | Utility-first styling without hand-writing CSS files. |
| `@tailwindcss/oxide-linux-x64-gnu` (optional) | Explicit fix for an npm optional-dependency resolution bug (npm/cli#4828) that left Tailwind's native binary missing after installing on Node 20 on the lab machine. |
| `prisma` / `@prisma/client` (pinned to `^6`) | ORM and query builder for SQLite. Pinned to major version 6 specifically — version 7 changes the `url` field in `schema.prisma` and throws a `P1012` error on the format used here. |
| `vitest` | Test runner with native TypeScript/ESM support, no extra Babel config needed. |
| `vite-tsconfig-paths` | Lets Vitest resolve the same `@/...` import alias used throughout the app, so tests import from `lib/` the same way the app does. |
| `eslint` / `eslint-config-next` | Next.js's recommended lint rules, catches common React/Next mistakes. |