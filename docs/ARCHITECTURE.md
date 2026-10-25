# WE GOT YOU — System Architecture & Technical Specifications

**Tagline:** Local Help. Right When You Need It.  
**Launch Location:** San Jose de Buenavista, Antique, Philippines (5700)  
**Expansion Pipeline:** Sibalom (5701), Hamtic (5715), Antique Province, Western Visayas  
**Primary Currency:** Philippine Peso (PHP / ₱)  
**Timezone:** Asia/Manila (UTC+8)

---

## 1. System Overview

**We Got You** is an enterprise-grade local-service discovery, quotation, and roadside dispatch marketplace designed specifically for provincial Philippine communities with mobile-first smartphones and varying network bandwidth.

```
                      +-----------------------------------+
                      |         WE GOT YOU PWA            |
                      |   (Next.js App Router + Tailwind) |
                      +-----------------+-----------------+
                                        |
       +--------------------------------+--------------------------------+
       |                                |                                |
+------v-------+                +-------v--------+               +-------v--------+
|   Customer   |                |    Provider    |               |  Super Admin   |
|    Portal    |                |   Dashboard    |               | Control Center |
+--------------+                +----------------+               +----------------+
       |                                |                                |
       +--------------------------------+--------------------------------+
                                        |
                      +-----------------v-----------------+
                      |    Universal Data & State Layer   |
                      |   (PostGIS + Supabase / Local)    |
                      +-----------------+-----------------+
                                        |
       +--------------------------------+--------------------------------+
       |                                |                                |
+------v-------+                +-------v--------+               +-------v--------+
| MapLibre GL  |                | 15-State State |               |  AI Assistant  |
|  Geospatial  |                |    Machine     |               | (Gemini / NLP) |
+--------------+                +----------------+               +----------------+
```

---

## 2. Core Modules & Technical Specifications

### A. Geolocation & Spatial Queries
- **Engine:** MapLibre GL JS with OpenStreetMap raster and CARTO Voyager tiles.
- **Coordinates:** Haversine spherical trigonometric calculation on client and `GEOGRAPHY(POINT, 4326)` on PostgreSQL / PostGIS.
- **Privacy:** Customer home address and coordinates are private and only exposed to the confirmed assigned technician during active service.

### B. 15-State Booking Lifecycle Machine
Valid state sequence enforced on client and backend:
1. `DRAFT`
2. `SUBMITTED`
3. `AWAITING_PROVIDER`
4. `PROVIDER_ACCEPTED`
5. `AWAITING_QUOTE`
6. `QUOTE_SENT`
7. `QUOTE_ACCEPTED`
8. `SCHEDULED`
9. `IN_PROGRESS`
10. `PROVIDER_MARKED_COMPLETE`
11. `COMPLETED`
12. `CANCELLED`
13. `DECLINED`
14. `EXPIRED`
15. `DISPUTED`

### C. Roadside Emergency Assistance
- **State Machine:** `LOOKING_FOR_PROVIDER` &rarr; `OFFER_SENT` &rarr; `PROVIDER_ACCEPTED` &rarr; `ETA_PROVIDED` &rarr; `PROVIDER_EN_ROUTE` &rarr; `ARRIVED` &rarr; `ASSISTANCE_IN_PROGRESS` &rarr; `COMPLETED`.
- **Filtering:** Only providers with `isRoadsideActive === true` and declared `ROADSIDE_ASSISTANCE` service mode are eligible.
- **Safety Directive:** Immediate prominent disclaimer directing fire, crash, or injury situations to **Unified 911** or Antique PNP (**0998 598 6236**).

### D. Provider Lead Ingestion & Verification
- 34 Discovered Antique provider leads pre-seeded across San Jose de Buenavista.
- CSV and JSON parser in Super Admin dashboard.
- Verification badges separated into 4 distinct checks:
  1. Identity Confirmed
  2. Contact Verified
  3. Business Registration (DTI / Mayor's Permit)
  4. Technical Credentials (TESDA NC II / Manufacturer Accredited)

### E. AI-Powered "We Got You Assistant"
- Problem triage engine supporting English, Tagalog, and Karay-a / Hiligaynon terms.
- Low-risk triage checks and safety alerts (high-voltage capacitor discharge warnings, fuel hazards).
- Matches against real database providers in Antique; never invents fake listings or false ETAs.
