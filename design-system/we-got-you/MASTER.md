# WE GOT YOU — Design System (Master Specification)

**Project:** WE GOT YOU (Local Repair, Roadside Assistance & Emergency Service Discovery Platform)  
**Location Focus:** San Jose de Buenavista, Antique, Philippines  
**Platform:** Mobile-First Progressive Web App (PWA) / Responsive Web  
**Design Intelligence Standard:** UI/UX Pro Max v2.0 & shadcn/ui Tailwind Standards  
**Last Updated:** 2026-10-26  

---

## 1. Product Archetype & Design Personality

- **Archetype:** Local Services & Emergency Roadside Assistance Marketplace
- **Tone & Emotion:** Dependable, reassuring, crystal-clear, fast under distress, trustworthy, community-rooted
- **Key Constraints:**
  - Designed for slow or fluctuating mobile data in provincial Philippine settings (3G/4G/5G).
  - High-stress roadside emergencies require zero-friction dispatch (large tap targets, high contrast, prominent hotlines).
  - Clear distinction between verified physical shops, emergency roadside units, and unverified research leads.

---

## 2. Color Palette & Semantic Tokens

### Core Color Tokens

| Token | Light Mode Value | Dark Mode Value | Usage / Semantics |
|-------|------------------|-----------------|-------------------|
| `--color-primary` | `#2563EB` (Blue 600) | `#3B82F6` (Blue 500) | Brand primary, verified provider pins, quote requests |
| `--color-primary-dark` | `#1D4ED8` (Blue 700) | `#1E40AF` (Blue 800) | Active/pressed primary buttons |
| `--color-emergency` | `#DC2626` (Red 600) | `#EF4444` (Red 500) | Emergency Roadside Assistance, Flat tires, Battery jump, 911 banner |
| `--color-emergency-bg` | `#FEF2F2` (Red 50) | `#450A0A` (Red 950) | Emergency callout containers |
| `--color-accent` | `#06B6D4` (Cyan 500) | `#22D3EE` (Cyan 400) | Live interactive state, AI assistant, user geolocator |
| `--color-surface` | `#FFFFFF` (White) | `#0B1220` (Midnight Slate) | Page background & primary card canvas |
| `--color-surface-muted`| `#F8FAFC` (Slate 50) | `#111C2E` (Deep Navy) | Secondary card surface, input backgrounds |
| `--color-border` | `#E2E8F0` (Slate 200) | `#1E293B` (Slate 800) | Container borders, subtle card dividers |
| `--color-text-main` | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | Primary headings, titles, high contrast body (15.8:1 ratio) |
| `--color-text-muted` | `#64748B` (Slate 500) | `#94A3B8` (Slate 400) | Subtitles, helper text, timestamps (4.6:1 ratio) |
| `--color-success` | `#16A34A` (Green 600) | `#22C55E` (Green 500) | Confirmed bookings, verified DTI badges, completed repairs |
| `--color-warning` | `#D97706` (Amber 600) | `#F59E0B` (Amber 500) | Discovered research directory leads, pending storefront pins |

---

## 3. Typography Hierarchy

Using **Inter** (Primary UI) and **Outfit** (Display / Brand Headings) with native fallback to clean system fonts.

- **Display Hero (H1):** `text-3xl sm:text-5xl font-extrabold tracking-tight`
- **Section Headers (H2):** `text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white`
- **Card Titles (H3):** `text-lg sm:text-xl font-bold text-slate-900 dark:text-white`
- **Body Text:** `text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300`
- **Meta / Badges:** `text-xs font-semibold uppercase tracking-wider`
- **Currency & Numbers:** Monospace/Tabular numerals (`font-mono font-bold`) for Philippine Peso figures (`₱ 1,500.00`) to prevent layout shifts.

---

## 4. Spacing, Rhythm & Touch Targets (UI/UX Pro Max Priority)

- **8-Point Spatial Grid:** Standard spacing tiers (`gap-2`, `gap-3`, `gap-4`, `gap-6`, `gap-8` / `8px`, `12px`, `16px`, `24px`, `32px`).
- **Touch Target Rule (CRITICAL):**
  - **All interactive elements** (buttons, cards, chips, form inputs, map pins, bottom navigation tabs) **MUST have a minimum bounding box of 44x44px** (`min-h-[44px] min-w-[44px]`).
  - Added `touch-action: manipulation` across buttons and interactive targets to eliminate the 300ms mobile tap delay.
- **Corner Radii Hierarchy:**
  - Badges & Pills: `rounded-full` (9999px)
  - Form inputs & Buttons: `rounded-xl` (12px)
  - Cards & Service Blocks: `rounded-2xl` (16px)
  - Modals & Hero Containers: `rounded-3xl` (24px)

---

## 5. Icon & Asset Rules

1. **NO EMOJIS AS ICONS (Strict Rule):**
   - Never use emoji glyphs (e.g. 🔧, 🚗, 📱, ⚠️) as structural interface icons.
   - Use clean, scalable SVGs from **Lucide React** (`lucide-react`) exclusively.
   - Maintain uniform stroke width (1.75px–2.0px) across adjacent icon elements.
2. **Contextual Semantics:**
   - Decorative icons beside text must use `aria-hidden="true"`.
   - Icon-only buttons must provide an explicit `aria-label` (e.g., `aria-label="Close modal"`).

---

## 6. Motion & Micro-Interactions

- **Hover & Focus Transitions:** `150ms–200ms ease-in-out` (`transition-all duration-200`).
- **Press Feedback:** Instant visual depression or color shift without layout boundary shift (`active:scale-[0.98]`).
- **Modal & Drawer Transitions:** Slide-up spring easing (`cubic-bezier(0.16, 1, 0.3, 1)` with `animate-slide-up`).
- **Reduced Motion:** Respects `prefers-reduced-motion: reduce` by suppressing layout animations.

---

## 7. Anti-Patterns to Avoid

- ❌ **No Artificial Loading Delays:** Do not simulate artificial delays or fake spinning loaders when local state is ready.
- ❌ **No Hardcoded Hex Colors in Component Markup:** Use semantic Tailwind tokens (`bg-brand-600`, `text-slate-900 dark:text-white`) instead of arbitrary one-off `#2563EB` strings.
- ❌ **No Overlapping Fixed Elements:** Bottom mobile navigation bar (`BottomNav`) has a reserved bottom padding (`pb-24`) on all scrollable views so content is never occluded.
- ❌ **No Low-Contrast Text:** Gray-on-gray text below 4.5:1 ratio is strictly prohibited. Dark mode surfaces must maintain at least 4.5:1 text contrast for body copy.
