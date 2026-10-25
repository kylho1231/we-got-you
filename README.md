# WE GOT YOU
> **Local Help. Right When You Need It.**  
> The Ultimate Local Repair, Roadside Assistance & Emergency Service Discovery Platform  
> **Launch Location:** San Jose de Buenavista, Antique, Philippines (5700)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-5.2-blueviolet.svg)](https://maplibre.org/)
[![PostgreSQL PostGIS](https://img.shields.io/badge/PostgreSQL-PostGIS-336791.svg)](https://postgis.net/)

---

## 🌟 Platform Highlights

- **3 Portals in One System:**
  1. **Customer Portal:** Problem search, interactive MapLibre GL map, quote builder, 15-state booking lifecycle, live in-app messaging, verified reviews.
  2. **Provider Dashboard:** Operating mode declaration (`SHOP_VISIT`, `HOME_SERVICE`, `ROADSIDE_ASSISTANCE`), active Roadside Dispatch (ON/OFF) switch, itemized quote builder (parts + labor), status updates.
  3. **Super Admin Control Center:** Provider verification queue, lead ingestion tool (pre-seeded with 34 researched Antique repair businesses), dispute moderation, and live operational dispatch monitor.
- **Antique Province First:**
  - Initial hub: **San Jose de Buenavista** with all 28 barangays (Funda-Dalipe, Atabay, Poblacion 1-8, San Pedro, Maybato, San Angel, etc.).
  - Expansion pipeline: **Sibalom** and **Hamtic**.
- **Real Roadside Emergency Assistance:**
  - Dedicated mobile-first rescue wizard for flat tires, dead batteries, motorcycle breakdowns, and towing referrals.
  - Active provider matching with proximity calculation (Haversine formula).
  - Explicit safety disclaimers and immediate shortcut to **Unified 911** and Antique PNP (`0998 598 6236`) for accidents, fire, and life-threatening crises.
- **AI-Powered "We Got You Assistant":**
  - Natural problem triage understanding English, Tagalog, and local Visayan/Karay-a terms.
  - Detects hazardous repairs (high-voltage capacitors, fuel leaks) with instant safety warnings.
  - Recommends real verified Antique shops from database records.
- **PWA & Mobile-First:**
  - Responsive layouts tested at 375px, 768px, 1024px, 1440px.
  - Accessible touch targets (minimum 44x44px), thumb-friendly bottom navigation, WCAG AA 4.5:1 contrast, and zero emoji icons (Lucide SVG icons).

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- **Node.js:** v18.18+ or v20+ (tested on Node v24.20)
- **Package Manager:** `npm` (or `pnpm`)

### 2. Installation
```bash
git clone <repo-url>
cd "WE GOT YOU"

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Run Automated Test Suite
Verify state machine transitions, roadside dispatch filters, and distance calculations:
```bash
npm test
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your mobile browser or desktop.

---

## 🗄️ Database Schema & Supabase Setup

The complete production PostgreSQL + PostGIS schema is located in:
`supabase/migrations/20261025000000_init_we_got_you_schema.sql`

It includes:
- PostGIS spatial indexing (`GEOGRAPHY(POINT, 4326)`)
- 15-state `booking_status_type` enum
- Full tables for `providers`, `provider_service_modes`, `service_requests`, `quotes`, `roadside_requests`, `messages`, `reviews`, and `provider_leads`
- Complete Row Level Security (RLS) policies.

---

## 📁 Key Routes

- `/` — Customer Homepage (Hero search, categories, verified shops, roadside CTA)
- `/find-repairers` — Advanced search engine with list & MapLibre split view
- `/map` — Dedicated interactive map centered on Antique
- `/services` — All 7 hierarchical service categories & subcategories
- `/repairers/[slug]` — Dedicated provider public profile & authentic review gallery
- `/roadside-assistance` — Emergency roadside assistance wizard
- `/dashboard` — Customer portal (Bookings, quotes, favorites)
- `/dashboard/requests/[id]` — 15-step request timeline & live messaging thread
- `/provider/dashboard` — Provider portal (Quotes, jobs, roadside dispatch switch)
- `/provider/onboarding` — Provider registration & verification document upload
- `/admin` — Super admin control center (Leads import tool, provider approvals, dispatch monitor)
- `/safety` — Trust & safety protocols, 911 emergency hotlines
- `/privacy` — RA 10173 Philippine Data Privacy Act notice
- `/terms` — Terms of Service and transparent cancellation rules

---

## 🔒 Security & Data Privacy

- **Philippine Data Privacy Act (RA 10173):** Customer home coordinates and sensitive ID documents are protected and never displayed on public search pins.
- **Authentic Reviews:** Rating calculations are mathematically computed strictly from verified completed bookings.
- **Prior Quote Approval:** Customers must affirmatively accept labor and parts fees before chargeable work commences.
- **No Hallucinated Data:** Zero fake testimonials, fake ratings, or simulated emergency responders.
