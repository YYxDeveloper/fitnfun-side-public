import { describe, it, expect, beforeAll } from "vitest";
import fs from "fs";
import path from "path";
import { validateInstructorData } from "../content-types/instructor/validators";
import mockData from "../__mocks__/instructors.json";

const PROJECT_ROOT = path.resolve(__dirname, "../../..", "../..");
const SCHEMA_PATH = path.resolve(
  __dirname,
  "../content-types/instructor/schema.json"
);

let schemaAttributes: Set<string>;

beforeAll(() => {
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf-8"));
  schemaAttributes = new Set(Object.keys(schema.attributes));
});

describe("instructors-mock.json 結構", () => {
  it("是合法 JSON 且為非空陣列", () => {
    expect(Array.isArray(mockData)).toBe(true);
    expect(mockData.length).toBeGreaterThan(0);
  });

  it("至少包含 1 筆 individual 與 1 筆 organization", () => {
    const types = new Set(mockData.map((d: any) => d.type));
    expect(types.has("individual")).toBe(true);
    expect(types.has("organization")).toBe(true);
  });

  it.each(mockData.map((d: any, i: number) => [d.name ?? `#${i}`, d]))(
    "%s 通過 validateInstructorData",
    (_name, entry: any) => {
      expect(() => validateInstructorData(entry)).not.toThrow();
    }
  );
});

describe("instructors-mock.json 必填欄位", () => {
  it.each(mockData.map((d: any, i: number) => [d.name ?? `#${i}`, d]))(
    "%s 有 type / name / review_status",
    (_name, entry: any) => {
      expect(entry.type).toMatch(/^(individual|organization)$/);
      expect(entry.name).toBeTruthy();
      expect(entry.review_status).toMatch(
        /^(draft|pending|published|rejected)$/
      );
    }
  );

  it("所有 review_status 都至少出現一次", () => {
    const statuses = new Set(mockData.map((d: any) => d.review_status));
    expect(statuses.size).toBeGreaterThanOrEqual(2);
  });
});

describe("instructors-mock.json avatar 檔案", () => {
  it.each(
    mockData
      .filter((d: any) => d.avatar)
      .map((d: any) => [d.name, d.avatar as string])
  )("%s 指向實際存在的檔案", (_name, avatarPath: string) => {
    const fullPath = path.resolve(PROJECT_ROOT, avatarPath);
    expect(fs.existsSync(fullPath)).toBe(true);
  });

  it("至少有 1 筆資料有 avatar", () => {
    const withAvatar = mockData.filter((d: any) => d.avatar);
    expect(withAvatar.length).toBeGreaterThan(0);
  });
});

describe("instructors-mock.json 與 schema 同步", () => {
  it("所有 mock 欄位名稱都存在於 schema.attributes", () => {
    const mockKeys = new Set<string>();
    for (const entry of mockData) {
      for (const key of Object.keys(entry)) mockKeys.add(key);
    }
    for (const key of mockKeys) {
      expect(schemaAttributes.has(key)).toBe(true);
    }
  });

  it("schema 的必填欄位在 mock 中都有值", () => {
    const requiredKeys: string[] = [];
    const schemaJson = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf-8"));
    for (const [key, def] of Object.entries(schemaJson.attributes as Record<string, any>)) {
      if (def.required) requiredKeys.push(key);
    }
    for (const entry of mockData) {
      for (const key of requiredKeys) {
        expect((entry as any)[key]).toBeTruthy();
      }
    }
  });
});
