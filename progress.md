# BidCopy — Build Progress

> Last updated: Phase 12 complete (all phases done, pending build verification)

## Status: 🟡 Build verification in progress

---

## ✅ Phase 0 — Scaffold + Config
- pnpm 10.33.2 confirmed installed
- Next.js 16.2.7 scaffolded (TypeScript, Tailwind v4, App Router, src-dir)
- All BidCopy deps installed: anthropic, gemini, clerk, supabase, react-hook-form, zod, lucide-react, clsx, tailwind-merge, react-markdown, remark-gfm, razorpay, @vercel/analytics, svix
- `globals.css` — bc color tokens in Tailwind v4 @theme inline format
- `.env.local.example` — all env vars documented

## ✅ Phase 1 — Supabase Schema
- `supabase/schema.sql` — tables: users, profiles, proposals, posts
- RLS policies + service role bypass + helper function `requesting_user_id()`
- Performance indexes on proposals.user_id, proposals.created_at, users.clerk_id, profiles.user_id
- **ACTION REQUIRED**: Run `supabase/schema.sql` in your Supabase SQL editor

## ✅ Phase 2 — Auth (Clerk)
- `middleware.ts` — protects `/dashboard/**`
- `src/app/layout.tsx` — ClerkProvider + Inter font + Vercel Analytics
- `src/app/sign-in/[[...sign-in]]/page.tsx`
- `src/app/sign-up/[[...sign-up]]/page.tsx`
- `src/app/api/webhooks/clerk/route.ts` — svix signature verification + Supabase upsert

## ✅ Phase 3 — Profile Setup
- `src/types/profile.ts` + `src/types/proposal.ts`
- `src/lib/utils.ts` — cn(), formatDate(), truncate()
- `src/lib/supabase.ts` — browser client + admin client
- `src/lib/prompts.ts` — buildSystemPrompt() + buildUserPrompt()
- `src/lib/humanise.ts` — buildChecklist(), countChecked(), allChecked()
- `src/app/api/profile/route.ts` — GET/POST profile
- `src/app/dashboard/profile/page.tsx` — 4-step form (About/Skills/Projects/Tone)

## ✅ Phase 4 — AI Generate API
- `src/app/api/generate/route.ts` — auth → limit check → Gemini/Claude → JSON parse → save
- `src/app/api/history/route.ts` — paginated GET + PATCH for rating/save
- `src/app/api/create-order/route.ts` — Razorpay order creation
- `src/app/api/verify-payment/route.ts` — HMAC signature verify → upgrade plan

## ✅ Phase 5 — Dashboard UI
- `src/components/ui/` — Button, Input, Textarea, Badge, Card
- `src/components/dashboard/InputPanel.tsx` — platform selector + form
- `src/components/dashboard/OutputPanel.tsx` — 4 tabs + humanise checklist + rating
- `src/components/dashboard/UsageBar.tsx` — animated progress bar
- `src/app/dashboard/page.tsx` — two-column layout, error handling

## ✅ Phase 6 — History Page
- `src/app/dashboard/history/page.tsx` — paginated table, empty state

## ✅ Phase 7 — Landing Page
- `src/components/shared/Nav.tsx` + `Footer.tsx`
- `src/components/landing/Hero.tsx` — animated tagline + UI wireframe preview
- `src/components/landing/HowItWorks.tsx` — 3-step cards
- `src/components/landing/OutputPreview.tsx` — comparison table + Humanise highlight
- `src/components/landing/Testimonials.tsx` — 3 cards
- `src/components/landing/Pricing.tsx` — Free vs Pro
- `src/components/landing/FAQ.tsx` — 6 accordion items
- `src/app/page.tsx` — full landing assembled

## ✅ Phase 8 — SEO Pages
- `/upwork-proposal-generator` — targets "upwork proposal generator"
- `/freelancer-proposal-generator` — targets "freelancer.com proposal generator"
- `/contra-proposal-generator` — zero competition keyword
- `/free-proposal-generator` — targets "free AI proposal generator"

## ✅ Phase 9 — Upgrade + Razorpay
- `src/app/dashboard/upgrade/page.tsx` — Pro plan page + Razorpay checkout

## ✅ Phase 10 — Chrome Extension
- `extension/manifest.json` — MV3, Upwork/Freelancer/Contra host permissions
- `extension/content.js` — extracts job data, saves to chrome.storage
- `extension/background.js` — clears storage on navigation away
- `extension/popup/popup.html` + `popup.js` + `popup.css` — two-state UI

## ✅ Phase 11 — Blog
- `src/app/blog/page.tsx` — ISR, fetches from Supabase posts table
- `src/app/blog/[slug]/page.tsx` — dynamic post, generateMetadata

## ✅ Phase 12 — SEO Infrastructure
- `src/app/sitemap.ts` — all public routes with priority weights
- `src/app/robots.ts` — blocks /dashboard/ and /api/

---

## 🔧 Before Launch Checklist

### You must do (manual steps):
1. **Supabase**: Run `supabase/schema.sql` in SQL editor
2. **Clerk**: Set up app, add keys to `.env.local`
3. **Supabase**: Add keys to `.env.local`
4. **Razorpay**: Add test/live keys to `.env.local`
5. **Google AI**: Add `GOOGLE_AI_API_KEY` to `.env.local`
6. **Anthropic**: Add `ANTHROPIC_API_KEY` to `.env.local`
7. **Clerk webhook**: After Vercel deploy, add webhook endpoint + secret
8. **Chrome Extension**: Load `extension/` as unpacked in chrome://extensions

### Deployment:
```bash
vercel --prod
# Then set all env vars in Vercel dashboard
# Connect bidcopy.com domain in Vercel
```

### Chrome Web Store:
- Create icons (16x16, 48x48, 128x128 PNG) in `extension/icons/`
- Zip the `extension/` folder
- Submit at https://chrome.google.com/webstore/devconsole
