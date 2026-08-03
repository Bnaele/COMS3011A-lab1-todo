# Running It

## Requirements

- Node.js **v20.9.0 or later** (Next.js 16 requires it). This project was
  built and tested on Node v20.20.2.
- If your machine has an older Node version and no admin access to upgrade
  it system-wide, install [nvm](https://github.com/nvm-sh/nvm) (no sudo
  required) and run `nvm install 20 && nvm use 20`.

## Setup (from a clean clone)

\```bash
git clone <repo-url>
cd todo-app
npm install
npx prisma migrate deploy
npm run dev
\```

Then open **http://localhost:3000**.

`npm install` automatically generates the Prisma client via a `postinstall`
hook. `npx prisma migrate deploy` creates `prisma/dev.db` and applies the
existing migration — it will not prompt for anything or create a new
migration, so it's safe to run on a fresh clone.

## Running tests

\```bash
npm test
\```

This runs against a separate, throwaway `prisma/test.db` — created fresh
each run via a `pretest` script — so it never touches your real
`prisma/dev.db` development data.

## Building for production

\```bash
npm run build
npm start
\```