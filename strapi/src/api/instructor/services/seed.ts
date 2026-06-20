import fs from "fs";
import path from "path";
import mockData from "../__mocks__/instructors.json";

export type MockInstructor = (typeof mockData)[number];

export function loadMockData(): MockInstructor[] {
  return mockData;
}

function resolveImagePath(relativePath: string): string {
  return path.resolve(__dirname, "../../../demo/asset/images", path.basename(relativePath));
}

export async function uploadAvatar(
  strapi: any,
  relativePath: string
): Promise<number | null> {
  const absolutePath = resolveImagePath(relativePath);
  if (!fs.existsSync(absolutePath)) {
    strapi.log.warn(`Avatar not found, skipping: ${absolutePath}`);
    return null;
  }

  const buffer = fs.readFileSync(absolutePath);
  const stats = fs.statSync(absolutePath);
  const filename = path.basename(absolutePath);

  try {
    const uploaded = await strapi.plugin("upload").service("upload").upload({
      data: {
        fileInfo: {
          name: filename,
          alternativeText: `instructor-${filename}`,
          caption: "",
        },
      },
      files: {
        filepath: absolutePath,
        originalFilename: filename,
        size: stats.size,
        mimetype: "image/jpeg",
        buffer,
      },
    });
    return uploaded?.[0]?.id ?? null;
  } catch (err) {
    strapi.log.error(`Failed to upload ${filename}: ${(err as Error).message}`);
    return null;
  }
}

export async function seedInstructors(
  strapi: any
): Promise<{ created: number; skipped: number }> {
  const existing = await strapi.db
    .query("api::instructor.instructor")
    .count();
  if (existing > 0) {
    strapi.log.info(`Seed skipped: ${existing} instructors already exist`);
    return { created: 0, skipped: existing };
  }

  const entries = loadMockData();
  let created = 0;
  let skipped = 0;

  for (const entry of entries) {
    const { avatar, ...rest } = entry;
    const avatarId = avatar ? await uploadAvatar(strapi, avatar) : null;

    await strapi.entityService.create("api::instructor.instructor", {
      data: {
        ...rest,
        avatar: avatarId,
      },
    });
    created++;
  }

  strapi.log.info(`Seeded ${created} instructors (${skipped} skipped)`);
  return { created, skipped };
}
