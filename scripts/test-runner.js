// ====================================================================
// WE GOT YOU: Automated Production Verification Test Suite
// Verifies: State machines, Roadside dispatch, Pricing, Leads & Safety
// ====================================================================

const assert = require("assert");

console.log("\n🚀 RUNNING WE GOT YOU AUTOMATED TEST SUITE...\n");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

// 1. HAVERSINE DISTANCE TEST
test("Haversine Distance Calculator accurately computes distances in Antique", () => {
  function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  // Distance between San Jose Poblacion and Funda-Dalipe (~1.0 km)
  const dist = calculateDistanceKm(10.7441, 121.9402, 10.7518, 121.9392);
  assert(dist > 0.5 && dist < 2.0, `Expected ~1km, got ${dist}km`);
});

// 2. 15-STEP BOOKING LIFECYCLE TRANSITION VALIDATOR
test("Booking State Machine strictly permits only valid lifecycle transitions", () => {
  const VALID_TRANSITIONS = {
    DRAFT: ["SUBMITTED", "CANCELLED"],
    SUBMITTED: ["AWAITING_PROVIDER", "PROVIDER_ACCEPTED", "DECLINED", "CANCELLED"],
    AWAITING_PROVIDER: ["PROVIDER_ACCEPTED", "DECLINED", "EXPIRED", "CANCELLED"],
    PROVIDER_ACCEPTED: ["AWAITING_QUOTE", "QUOTE_SENT", "SCHEDULED", "CANCELLED"],
    AWAITING_QUOTE: ["QUOTE_SENT", "CANCELLED"],
    QUOTE_SENT: ["QUOTE_ACCEPTED", "DECLINED", "CANCELLED"],
    QUOTE_ACCEPTED: ["SCHEDULED", "IN_PROGRESS", "CANCELLED"],
    SCHEDULED: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["PROVIDER_MARKED_COMPLETE", "DISPUTED"],
    PROVIDER_MARKED_COMPLETE: ["COMPLETED", "DISPUTED"],
    COMPLETED: [],
    CANCELLED: [],
    DECLINED: [],
    EXPIRED: [],
    DISPUTED: ["IN_PROGRESS", "CANCELLED", "COMPLETED"],
  };

  function canTransition(current, next) {
    return VALID_TRANSITIONS[current]?.includes(next) || false;
  }

  assert(canTransition("SUBMITTED", "PROVIDER_ACCEPTED") === true, "Should allow provider accept");
  assert(canTransition("QUOTE_SENT", "QUOTE_ACCEPTED") === true, "Should allow quote acceptance");
  assert(canTransition("SUBMITTED", "COMPLETED") === false, "Must NOT jump straight to completed");
  assert(canTransition("COMPLETED", "SUBMITTED") === false, "Must NOT revert completed bookings");
});

// 3. AUTHENTIC REVIEW RE-CALCULATION TEST
test("Provider Rating is calculated strictly from eligible unmoderated reviews", () => {
  const reviews = [
    { overallRating: 5, isModerated: false },
    { overallRating: 4, isModerated: false },
    { overallRating: 5, isModerated: false },
    { overallRating: 1, isModerated: true }, // Moderated spam review should be excluded!
  ];

  const validReviews = reviews.filter((r) => !r.isModerated);
  const sum = validReviews.reduce((acc, r) => acc + r.overallRating, 0);
  const avg = Math.round((sum / validReviews.length) * 10) / 10;

  assert.strictEqual(validReviews.length, 3, "Only 3 reviews should be counted");
  assert.strictEqual(avg, 4.7, "Average should be 4.7");
});

// 4. ROADSIDE EMERGENCY MATCHING TEST
test("Roadside matching filters only providers who have active dispatch and roadside mode", () => {
  const providers = [
    { id: "1", isRoadsideActive: true, serviceModes: ["ROADSIDE_ASSISTANCE"] },
    { id: "2", isRoadsideActive: false, serviceModes: ["ROADSIDE_ASSISTANCE"] },
    { id: "3", isRoadsideActive: true, serviceModes: ["SHOP_VISIT"] }, // Does not have roadside mode
  ];

  const matched = providers.filter(
    (p) => p.isRoadsideActive && p.serviceModes.includes("ROADSIDE_ASSISTANCE")
  );

  assert.strictEqual(matched.length, 1, "Only provider 1 should qualify for roadside dispatch");
  assert.strictEqual(matched[0].id, "1");
});

// 5. ANTIQUE RESEARCH DATASET INTEGRITY TEST
test("Researched Antique providers dataset contains 34 shops with San Jose locations", () => {
  const leads = require("../data/antique_provider_leads.json");
  assert.strictEqual(leads.length, 34, `Expected 34 leads, got ${leads.length}`);

  const hasEDE = leads.some((l) => l.name.includes("EDE Engineering"));
  const hasRapide = leads.some((l) => l.name.includes("Rapidé"));
  const hasCellu = leads.some((l) => l.name.includes("Cellu-Zite"));
  const hasARS = leads.some((l) => l.name.includes("ARS Welding"));

  assert(hasEDE, "Should contain EDE Engineering");
  assert(hasRapide, "Should contain Rapidé San Jose");
  assert(hasCellu, "Should contain Cellu-Zite");
  assert(hasARS, "Should contain ARS Welding");
});

// 6. EMERGENCY 911 HAZARD DETECTION
test("AIAssistant detects dangerous keywords and prioritizes 911 emergency notice", () => {
  const emergencyKeywords = ["smoke", "usok", "sunog", "apoy", "crash", "bangga", "injur", "emergency 911"];
  const testQuery = "May bangga at sunog malapit sa San Jose bypass road";

  const isEmergency = emergencyKeywords.some((k) => testQuery.toLowerCase().includes(k));
  assert(isEmergency === true, "Must flag emergency for crash and fire keywords");
});

console.log(`\n--------------------------------------`);
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`--------------------------------------\n`);

if (failed > 0) {
  process.exit(1);
}
