export const VALID_LOCATIONS = [
  "台北市", "新北市", "桃園市", "台中市", "台南市", "高雄市",
  "基隆市", "新竹市", "嘉義市",
  "新竹縣", "苗栗縣", "彰化縣", "南投縣", "雲林縣", "嘉義縣",
  "屏東縣", "宜蘭縣", "花蓮縣", "台東縣",
  "澎湖縣", "金門縣", "連江縣",
] as const;

export const VALID_CONTACT_KEYS = ["電話", "line", "email", "website"] as const;

export type ValidLocation = (typeof VALID_LOCATIONS)[number];
export type ValidContactKey = (typeof VALID_CONTACT_KEYS)[number];

/** 驗證欄位必須是 string[] */
export function assertStringArray(value: unknown, fieldName: string): void {
  if (value === null || value === undefined) return;
  if (!Array.isArray(value)) {
    throw new Error(`「${fieldName}」必須是陣列，收到：${typeof value}`);
  }
  const invalidItems = value.filter((item) => typeof item !== "string");
  if (invalidItems.length > 0) {
    throw new Error(
      `「${fieldName}」陣列內每個元素必須是字串，收到：${JSON.stringify(invalidItems)}`
    );
  }
}

/** 驗證 locations 值必須在台灣縣市清單內 */
export function validateLocations(locations: unknown): void {
  assertStringArray(locations, "locations");
  if (!Array.isArray(locations)) return;
  const invalid = (locations as string[]).filter(
    (l) => !VALID_LOCATIONS.includes(l as ValidLocation)
  );
  if (invalid.length > 0) {
    throw new Error(
      `無效的上課地點：${invalid.join("、")}。合法縣市：${VALID_LOCATIONS.join("、")}`
    );
  }
}

/** 驗證 contact_info 必須是物件，keys 僅限四種，values 必須是字串 */
export function validateContactInfo(contactInfo: unknown): void {
  if (contactInfo === null || contactInfo === undefined) return;
  if (typeof contactInfo !== "object" || Array.isArray(contactInfo)) {
    throw new Error(
      `「contact_info」必須是物件，收到：${Array.isArray(contactInfo) ? "array" : typeof contactInfo}`
    );
  }
  const entries = Object.entries(contactInfo as Record<string, unknown>);
  const invalidKeys = entries
    .map(([k]) => k)
    .filter((k) => !VALID_CONTACT_KEYS.includes(k as ValidContactKey));
  if (invalidKeys.length > 0) {
    throw new Error(
      `「contact_info」僅允許 key：${VALID_CONTACT_KEYS.join("、")}。無效 key：${invalidKeys.join("、")}`
    );
  }
  const invalidValues = entries.filter(([, v]) => typeof v !== "string");
  if (invalidValues.length > 0) {
    throw new Error(
      `「contact_info」所有 value 必須是字串，無效欄位：${invalidValues.map(([k]) => k).join("、")}`
    );
  }
}

/** 統一驗證入口 */
export function validateInstructorData(data: Record<string, unknown>): void {
  if (data.course_categories !== undefined) {
    assertStringArray(data.course_categories, "course_categories");
  }
  if (data.instructor_sources !== undefined) {
    assertStringArray(data.instructor_sources, "instructor_sources");
  }
  if (data.locations !== undefined) {
    validateLocations(data.locations);
  }
  if (data.keywords !== undefined) {
    assertStringArray(data.keywords, "keywords");
  }
  if (data.contact_info !== undefined) {
    validateContactInfo(data.contact_info);
  }
}
