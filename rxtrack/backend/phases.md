# RxTrack — Sehaj's Task Tracker

## Phase 1: Environment & Foundation ✅ Done
- [x] Create `.env.example` (frontend)
- [x] Create `.env.example` (backend)
- [x] Add `.gitignore` to protect secrets
- [x] Deployment notes (`infrastructure/gcp/README.md`)
- [x] Fix broken dev server (empty `next.config.ts`, `layout.tsx`, `page.tsx`, `tsconfig.json`)
- [x] Fix missing Tailwind import in `globals.css`

## Phase 2: API Client Setup ✅ Done (Ticket #18)
- [x] Axios wrapper in `lib/api.ts` — base URL, headers
- [x] Auth token interceptor
- [x] Error handling interceptor
- [x] Verified working against backend (network error handled correctly)
- [x] Committed, pushed, PR #22 opened

## Phase 3: UI Components ✅ Done (Ticket #12)
- [x] `Button` component
- [x] `Input` component
- [x] `Card` component
- [x] Export barrel `components/index.ts`
- [x] Verified rendering + Tailwind styling
- [x] Committed and pushed

## Phase 4: Database Setup & Seed ✅ Done (Ticket #21)
- [x] Install PostgreSQL locally, fix PATH issue
- [x] Create `rxtrack` database
- [x] Fix Prisma CLI/client version mismatch (downgraded to stable v6)
- [x] Fix `DATABASE_URL` in `schema.prisma`
- [x] Fix seed file path in `prisma.config.ts`
- [x] Run migrations (`prisma migrate dev`)
- [x] Run seed script (`prisma db seed`)
- [x] Verify data in Prisma Studio (users, pharmacy, medicines, prescriptions, fulfillments)

## Phase 5: GCP / Deployment ⏳ Blocked
- [x] Create GCP project (`RxTrack`)
- [ ] Activate GCP billing — **blocked**: requires mandatory ₹1,000 charge for India accounts (decision: not paying for now)
- [ ] Enable Cloud Run / Cloud SQL / Cloud Build APIs
- [ ] Deploy frontend to Cloud Run
- [ ] Deploy backend to Cloud Run
- [ ] **Alternative path:** Deploy frontend to Vercel instead (no mandatory payment)

## Phase 6: App Verification (In Progress)
- [ ] Check `/login` page — currently shows placeholder homepage content, needs investigation
- [ ] Check `/doctor` dashboard page
- [ ] Check `/pharmacy` queue page
- [ ] Fix any broken routes/pages found
- [ ] Full click-through test of login → upload → fulfillment flow

## Phase 7: Final Submission Prep
- [ ] Resolve deployment (Vercel or GCP) so a live demo URL exists
- [ ] Final bug-fix pass across frontend/backend
- [ ] Confirm README has setup instructions
- [ ] Confirm all tickets on board reflect accurate status
- [ ] Final commit + push before deadline