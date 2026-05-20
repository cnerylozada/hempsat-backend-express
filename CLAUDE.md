# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server with nodemon (auto-restarts on .ts changes)
npm run build    # compile TypeScript to dist/
npm start        # run compiled output
```

If the dev server exits immediately after printing "Server running on port 3000", check for a stale process on port 3000: `lsof -ti:3000 | xargs kill -9`, then restart.

## Architecture

Express app with TypeScript 6, using `tsx` (not `ts-node`) as the runtime.

**Request flow:** `src/index.ts` → `src/app.ts` → route files → controller files

All routes are prefixed with `API_PREFIX` (`/api/v1`) defined in `src/constants.ts`. New routers are mounted in `app.ts` as `app.use(API_PREFIX, someRoutes)`, and each router file owns its specific sub-path (e.g. `router.get("/health", ...)`).

**Convention:** one controller file per domain (`src/controllers/<domain>.controller.ts`), one router file per domain (`src/routes/<domain>.ts`). Controllers handle request/response logic; routers wire paths to controllers.
