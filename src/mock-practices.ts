// Debug only: 3 sample responses of GET /practices/:areaId/:practiceId for mulching practices
// created through POST /practices/:areaId/mulching. Delete after use.
// Run: npx tsx src/mock-practices.ts
//
// Coherence rules followed (from createMulchingPractice + DB constraints):
// - a practice created by the API is active: finished_at = null, updated_at = created_at
// - started_at = the form's appliedOn (<= the day it was submitted); created_at is the submit time (UTC)
// - each sub-form checked <=> its fields filled; unchecked => all its fields null
// - tillage_practice = "conventional" if tilled, else "no_till" (what the controller sends today)
// - mulch amounts are realistic for a smallholder area (~3–6 t/ha over the covered part)
const PHOTO =
  "https://thumbs.dreamstime.com/b/random-photo-girl-random-photo-girl-355290767.jpg";

// 1. Maize, everything checked. Before mulching the farmer plowed half the field once with oxen,
//    cleared weeds by burning a small corner, spread guano and manure. Mulch: sugarcane bagasse
//    bought from a local mill, measured in tonnes.
const everythingChecked = {
  id: "0b6f6c1e-5a1d-4f0e-9d53-2f3c1a9b7e01",
  area_id: "c29c3e20-931d-4b75-9de3-103c48ac2976",
  type: "mulching",
  crop: "maize",
  planted_at: "2026-09-10",
  started_at: "2026-09-28",
  finished_at: null,
  attestation_signature:
    "0x41237bebd3eb6a537c67de834c1075d6abf8f776663dafc7dc355c0277ca09453b2c2334854f742e2658f788cd6421c478131b21325816af630c7fe7b751db9f1b",
  tilled: true,
  tillage_times: 1,
  tillage_tool: "animal_plow",
  tillage_area: "about_half",
  tillage_practice: "conventional",
  fertilizer_used: true,
  fertilizer_type: "other",
  fertilizer_kg: 100,
  fertilizer_other: "Guano de isla",
  burned: true,
  burn_material: "weeds_or_brush",
  burn_area: "small_part",
  compost_manure_used: true,
  compost_manure_type: "manure",
  compost_manure_kg: 500,
  created_at: "2026-09-29T15:12:40.218Z",
  updated_at: "2026-09-29T15:12:40.218Z",
  photos: [PHOTO],
  details: {
    material: "other",
    material_other: "Sugarcane bagasse",
    material_state: "dry",
    source: "brought_in",
    source_description: "Bought from the sugar mill in town",
    amount: 1.5,
    unit: "t",
    coverage: "about_half",
  },
};

// 2. Hemp, "None of these" and not planted yet. The farmer covers the whole bare field with the dry
//    maize stalks left from the last harvest, before sowing.
const noneOfThese = {
  id: "3a8d1f64-2b7c-4e95-a0d3-9c6e5b4a7f12",
  area_id: "83fe93a4-70fe-4f25-be1f-6b15196e81e1",
  type: "mulching",
  crop: "hemp",
  planted_at: null,
  started_at: "2026-10-02",
  finished_at: null,
  attestation_signature:
    "0x42240303dd7f92d5713dfa96cf6be2fc6f4e41c3a8c1356501e1d15dd16dd14c541c8d1a92f1b6911501ed227957e1359d6b6c0b9a61cca2d2ee04649f01716d1c",
  tilled: false,
  tillage_times: null,
  tillage_tool: null,
  tillage_area: null,
  tillage_practice: "no_till",
  fertilizer_used: false,
  fertilizer_type: null,
  fertilizer_kg: null,
  fertilizer_other: null,
  burned: false,
  burn_material: null,
  burn_area: null,
  compost_manure_used: false,
  compost_manure_type: null,
  compost_manure_kg: null,
  created_at: "2026-10-02T21:40:05.731Z",
  updated_at: "2026-10-02T21:40:05.731Z",
  photos: [PHOTO],
  details: {
    material: "crop_residue",
    material_other: null,
    material_state: "dry",
    source: "this_farm",
    source_description: null,
    amount: 800,
    unit: "kg",
    coverage: "all",
  },
};

// 3. Coffee, some options checked. Coffee is perennial (planted years ago) and never plowed, so no_till.
//    The farmer added urea and coffee-pulp compost, then mulched around part of the plants with
//    fresh pruning cuttings from the same farm.
const someChecked = {
  id: "e93b5d12-6c8f-4a31-8d07-b2f4a6c1e904",
  area_id: "4657c6bc-62ca-451d-83b7-73be8531efbb",
  type: "mulching",
  crop: "coffee",
  planted_at: "2019-11-15",
  started_at: "2026-09-20",
  finished_at: null,
  attestation_signature:
    "0x5957fb814c80de0cdb6e01cb1fd409710ddef472cfbbc19ae6b81c18767b5e55321b997ed2319d4bfb494968900a657c3f2ab334530f8f189cac64ccd8d72bbd1b",
  tilled: false,
  tillage_times: null,
  tillage_tool: null,
  tillage_area: null,
  tillage_practice: "no_till",
  fertilizer_used: true,
  fertilizer_type: "urea",
  fertilizer_kg: 50,
  fertilizer_other: null,
  burned: false,
  burn_material: null,
  burn_area: null,
  compost_manure_used: true,
  compost_manure_type: "compost",
  compost_manure_kg: 300,
  created_at: "2026-09-21T13:05:52.904Z",
  updated_at: "2026-09-21T13:05:52.904Z",
  photos: [PHOTO],
  details: {
    material: "leaves_and_cuttings",
    material_other: null,
    material_state: "fresh_green",
    source: "this_farm",
    source_description: null,
    amount: 400,
    unit: "kg",
    coverage: "small_part",
  },
};

console.log(
  JSON.stringify({ everythingChecked, noneOfThese, someChecked }, null, 2),
);
