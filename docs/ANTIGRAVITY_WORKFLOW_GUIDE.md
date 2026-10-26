# Antigravity Developer & Operating Guide: WE GOT YOU

This guide provides developers, maintainers, and operators with instructions for building, reviewing, and extending the **WE GOT YOU** platform within **Google Antigravity 2.0 (AGY)**.

---

## 1. Antigravity Surfaces & Workspace Architecture

### A. The Chat Canvas
- **Direct Agent Collaboration:** Chat directly with the Antigravity agent to implement features, fix bugs, optimize performance, or execute database migrations.
- **Slash Commands (`/`):**
  - `/goal`: Launch long-running, autonomous workflows with comprehensive verification gates.
  - `/plan`: Request an implementation blueprint before modifying mission-critical files.
  - `/schedule`: Set up cron-based periodic audits or one-shot background alarms (e.g. nightly lead sweeps).
  - `/boost`: Deep multi-perspective architecture and security review.
  - `/ui-ux-pro-max`: Query local UI design intelligence (palettes, typography, WCAG compliance).
  - `/ui-styling`: Apply shadcn/ui and Tailwind CSS utility component patterns.
  - `/compact`: Condense conversation context while preserving active project milestones.
- **`@` Mentions:**
  - `@data/antique_provider_leads.csv` — Reference the raw 48 Antique repairers dataset.
  - `@design-system/we-got-you/MASTER.md` — Reference global design tokens and styling rules.
  - `@supabase/migrations/` — Reference PostGIS database migrations.

### B. Auxiliary Pane & Artifacts
- **Artifacts:** Structured Markdown and diff reports are published to the artifacts panel:
  - [`we_got_you_implementation_report.md`](file:///C:/Users/jhonk/.gemini/antigravity/brain/844f2f8f-6ac2-4cab-a28a-d10f4f947328/we_got_you_implementation_report.md)
- **Background Tasks:** Long-running dev servers and test runners run autonomously in the background without freezing the chat session.
- **Terminals & Sandboxing:** Commands default to sandboxed execution (`BypassSandbox: false`).

---

## 2. Integrated Skills & Design Standards

### A. UI/UX Pro Max Standard
- Located at: [`design-system/we-got-you/MASTER.md`](file:///c:/Users/jhonk/OneDrive/Documents/WE%20GOT%20YOU/design-system/we-got-you/MASTER.md)
- **10 Core Priorities:**
  1. *Accessibility (CRITICAL):* 4.5:1 text contrast minimum, visible focus rings, aria-labels for icons/buttons.
  2. *Touch Targets (CRITICAL):* 44x44px minimum touch targets, 8px+ spacing, no 0ms instant state jumps.
  3. *Performance (HIGH):* Zero CLS (< 0.1), skeleton placeholders for loading state.
  4. *Visual Elements (HIGH):* Vector SVGs from Lucide exclusively (**NEVER emojis as structural icons**).
  5. *Layout & Responsive (HIGH):* Mobile-first breakpoints (375px, 640px, 768px, 1024px, 1440px).
  6. *Typography & Color (MEDIUM):* Tabular numerals for Philippine Peso (`₱`), semantic CSS tokens.
  7. *Animation (MEDIUM):* 150-200ms transitions, respects `prefers-reduced-motion`.
  8. *Forms & Feedback (MEDIUM):* Persistent visible labels, inline validation next to fields.
  9. *Navigation (HIGH):* Elevated rescue button in mobile bottom bar, un-obscured content (`pb-24`).
  10. *Trust & Transparency (CRITICAL):* Strict separation between verified shops and research leads.

### B. UI Styling Component Library
Accessible shadcn/ui + Tailwind utility components live directly in [`components/ui/`](file:///c:/Users/jhonk/OneDrive/Documents/WE%20GOT%20YOU/components/ui/):
- [`Button.tsx`](file:///c:/Users/jhonk/OneDrive/Documents/WE%20GOT%20YOU/components/ui/Button.tsx) — 44px min touch targets, loading states, variants.
- [`Card.tsx`](file:///c:/Users/jhonk/OneDrive/Documents/WE%20GOT%20YOU/components/ui/Card.tsx) — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter.
- [`Input.tsx`](file:///c:/Users/jhonk/OneDrive/Documents/WE%20GOT%20YOU/components/ui/Input.tsx) — Form input with floating labels, error text, and left/right icons.
- [`Badge.tsx`](file:///c:/Users/jhonk/OneDrive/Documents/WE%20GOT%20YOU/components/ui/Badge.tsx) — Status pills (verified, roadside ready, lead).
- [`Alert.tsx`](file:///c:/Users/jhonk/OneDrive/Documents/WE%20GOT%20YOU/components/ui/Alert.tsx) — Alert banners (info, warning, emergency, success).
- [`Skeleton.tsx`](file:///c:/Users/jhonk/OneDrive/Documents/WE%20GOT%20YOU/components/ui/Skeleton.tsx) — Loading placeholders preventing layout shift.
- [`Modal.tsx`](file:///c:/Users/jhonk/OneDrive/Documents/WE%20GOT%20YOU/components/ui/Modal.tsx) — Accessible dialogs with focus trapping and ESC support.
- [`Tabs.tsx`](file:///c:/Users/jhonk/OneDrive/Documents/WE%20GOT%20YOU/components/ui/Tabs.tsx) — Accessible tab navigation strips.

---

## 3. Specialized Antigravity Subagents

Delegate domain-specific tasks to Antigravity subagents:
- **`test-engineer`**: Execute regression suites, mock provider interactions, test 15-state transitions.
- **`security-auditor`**: Audit PostGIS RLS policies, phone number privacy, and anti-fraud verifications.
- **`web-performance-auditor`**: Profile Core Web Vitals (LCP, FID, CLS) on mobile 3G simulations.
- **`code-reviewer`**: Peer-review pull requests across correctness, readability, architecture, security, and performance.

---

## 4. Operational Commands & Cheatsheet

```bash
# 1. Run automated test suite
node scripts/test-runner.js

# 2. Synchronize 48 Antique provider leads from CSV
node scripts/update-leads-from-csv.js

# 3. Compile Next.js production build
npm run build

# 4. Start local development server
npm run dev
```
