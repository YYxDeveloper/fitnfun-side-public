import { describe, it, expect } from "vitest";
import {
  assertStringArray,
  validateLocations,
  validateContactInfo,
  validateInstructorData,
  VALID_LOCATIONS,
} from "../validators";

// ─── assertStringArray ────────────────────────────────────────────────────────

describe("assertStringArray", () => {
  it("passes for valid string[]", () => {
    expect(() => assertStringArray(["活力運動", "樂律動"], "course_categories")).not.toThrow();
  });

  it("passes for empty array", () => {
    expect(() => assertStringArray([], "keywords")).not.toThrow();
  });

  it("passes for null / undefined (optional field)", () => {
    expect(() => assertStringArray(null, "keywords")).not.toThrow();
    expect(() => assertStringArray(undefined, "keywords")).not.toThrow();
  });

  it("throws when value is not an array", () => {
    expect(() => assertStringArray("活力運動", "course_categories")).toThrow(
      "「course_categories」必須是陣列，收到：string"
    );
    expect(() => assertStringArray(123, "keywords")).toThrow("必須是陣列");
  });

  it("throws when array contains non-string elements", () => {
    expect(() => assertStringArray([1, "valid"], "course_categories")).toThrow(
      "陣列內每個元素必須是字串"
    );
    expect(() => assertStringArray([null, "valid"], "keywords")).toThrow("必須是字串");
  });
});

// ─── validateLocations ───────────────────────────────────────────────────────

describe("validateLocations", () => {
  it("passes for valid Taiwan counties", () => {
    expect(() => validateLocations(["台北市", "新北市", "花蓮縣"])).not.toThrow();
  });

  it("passes for all 22 counties", () => {
    expect(() => validateLocations([...VALID_LOCATIONS])).not.toThrow();
  });

  it("passes for empty array", () => {
    expect(() => validateLocations([])).not.toThrow();
  });

  it("passes for null / undefined", () => {
    expect(() => validateLocations(null)).not.toThrow();
    expect(() => validateLocations(undefined)).not.toThrow();
  });

  it("throws for invalid county name", () => {
    expect(() => validateLocations(["台北市", "花蓮縣x"])).toThrow("無效的上課地點：花蓮縣x");
  });

  it("throws when array contains non-string (delegates to assertStringArray)", () => {
    expect(() => validateLocations([123])).toThrow("必須是字串");
  });

  it("throws when value is not an array", () => {
    expect(() => validateLocations("台北市")).toThrow("必須是陣列");
  });
});

// ─── validateContactInfo ─────────────────────────────────────────────────────

describe("validateContactInfo", () => {
  it("passes for valid partial contact_info", () => {
    expect(() => validateContactInfo({ 電話: "02-1234-5678" })).not.toThrow();
    expect(() => validateContactInfo({ line: "@abc", email: "a@b.com" })).not.toThrow();
  });

  it("passes for all valid keys", () => {
    expect(() =>
      validateContactInfo({ 電話: "02-1234", line: "@abc", email: "a@b.com", website: "https://x.com" })
    ).not.toThrow();
  });

  it("passes for empty object", () => {
    expect(() => validateContactInfo({})).not.toThrow();
  });

  it("passes for null / undefined", () => {
    expect(() => validateContactInfo(null)).not.toThrow();
    expect(() => validateContactInfo(undefined)).not.toThrow();
  });

  it("throws when value is an array", () => {
    expect(() => validateContactInfo([])).toThrow("「contact_info」必須是物件，收到：array");
  });

  it("throws when value is a string", () => {
    expect(() => validateContactInfo("02-1234")).toThrow("必須是物件");
  });

  it("throws for invalid key", () => {
    expect(() => validateContactInfo({ 電話: "02-1234", fb: "https://fb.com" })).toThrow(
      "無效 key：fb"
    );
  });

  it("throws when value is not a string", () => {
    expect(() => validateContactInfo({ 電話: 1234567 })).toThrow(
      "所有 value 必須是字串，無效欄位：電話"
    );
    expect(() => validateContactInfo({ line: null })).toThrow("必須是字串");
  });
});

// ─── validateInstructorData ──────────────────────────────────────────────────

describe("validateInstructorData", () => {
  it("passes for complete valid data", () => {
    expect(() =>
      validateInstructorData({
        course_categories: ["活力運動"],
        instructor_sources: ["躍齡"],
        locations: ["台北市", "新北市"],
        keywords: ["銀髮", "肌力"],
        contact_info: { 電話: "02-1234", email: "a@b.com" },
      })
    ).not.toThrow();
  });

  it("passes when all fields are absent (all optional)", () => {
    expect(() => validateInstructorData({ name: "測試教練", type: "individual" })).not.toThrow();
  });

  it("throws on invalid locations within full payload", () => {
    expect(() =>
      validateInstructorData({
        locations: ["台北市", "無效縣市"],
        keywords: ["銀髮"],
      })
    ).toThrow("無效的上課地點：無效縣市");
  });

  it("throws on non-array course_categories", () => {
    expect(() =>
      validateInstructorData({ course_categories: "活力運動" })
    ).toThrow("「course_categories」必須是陣列");
  });

  it("throws on invalid contact_info key", () => {
    expect(() =>
      validateInstructorData({ contact_info: { ig: "https://ig.com" } })
    ).toThrow("無效 key：ig");
  });
});
