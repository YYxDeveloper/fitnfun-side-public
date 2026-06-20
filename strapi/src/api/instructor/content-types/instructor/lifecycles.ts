import { validateInstructorData } from "./validators";

export default {
  beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    validateInstructorData(event.params.data);
  },
  beforeUpdate(event: { params: { data: Record<string, unknown> } }) {
    validateInstructorData(event.params.data);
  },
};
