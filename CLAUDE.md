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

## API Endpoints

### Auth — `src/routes/authentication.ts`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/sign-in` | No | Sign in with wallet signature |
| POST | `/auth/sign-out` | Yes | Invalidate current session |

### Users — `src/routes/users.ts`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users/me` | Yes | Get own profile |
| PATCH | `/users` | Yes | Update identity from KYC (`{ inquiryId }`) |

### Farms — `src/routes/farms.ts`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/farms` | Yes | List own farms |
| GET | `/farms/:id` | Yes | Get single farm by id (own only via RLS) |
| POST | `/farms` | Yes | Create farm — multipart/form-data: `images` (1–3 files) + `latitude` + `longitude` |

### Health — `src/routes/health.ts`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |

## Key Design Decisions

**JWT auth:** `sub` claim = wallet address = `users.id`; `jti` = session id. `req.userId`, `req.jti`, `req.token` are set in `auth.middleware.ts`.

**RLS:** All Supabase queries use `supabaseClient(req.token!)` (user's own JWT, not a service role key). Row-Level Security policies enforce ownership at the database level. Never create a service-role client.

**KYC identity fields** (`national_id`, `first_name`, `last_name`, `inquiry_id`) live in the `users` table (1:1 relationship). `updateUserIdentity` calls `fetchKycData` from `src/services/kyc.service.ts` to resolve Persona inquiry data and updates the user's own row.

**Farm ownership validation (`createFarm`):**
- Fetches user's `national_id`, `first_name`, `last_name` — returns 400 if KYC not yet completed.
- Peru (`PE`): compares `national_id` against `owner_id` extracted from deed.
- USA: compares normalized full name (words sorted alphabetically) against `owner_name` from deed — handles name-order mismatches between data sources.

**Title deed image upload:**
- Field name: `images` (defined in `src/libs/multer.ts` as `TITLE_DEEDS_FIELD`)
- Count: 1–3 files
- Format: JPG or PNG only
- File size: 50 KB min, 5 MB max
- Dimensions: minimum 600 × 900 px (short side × long side); no upper bound
- Middleware chain: `authMiddleware` → `titleDeedUploadMiddleware` → controller

**AI extraction (`src/services/title-deed.service.ts`):** Uses `gemini-2.5-flash` with `thinkingBudget: 0` (disabled to avoid consuming output tokens on reasoning). Strips non-digit characters from `owner_id` after extraction to normalize labels like "D.N.I. 47990300" → "47990300".

**Unique constraints (not indexes):** `users.national_id`, `users.inquiry_id`, `farms.parcel_id` all use `ALTER TABLE ... ADD CONSTRAINT ... UNIQUE (...)` — not `CREATE UNIQUE INDEX`.

**`latitude` / `longitude` in `createFarm`:** Accepted in the request body and validated (Zod coerce) but not persisted — reserved for a future GPS presence-verification feature (Haversine distance check, ≤ 20 m tolerance). Not stored in the farms table.

## Migrations

```bash
npx supabase db push           # apply pending migrations to remote
npx supabase db query --linked "<sql>"  # run ad-hoc SQL on remote (requires --linked; default targets local Docker)
```

Supabase tracks applied migrations by filename. If a file was already applied and then edited locally, `db push` will skip it — run the delta manually via `db query --linked`.
