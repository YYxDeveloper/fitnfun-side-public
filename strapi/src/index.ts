import type { Core } from '@strapi/strapi';
import { seedInstructors } from './api/instructor/services/seed';

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedInstructors(strapi);
  },
};
