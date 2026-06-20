export interface Instructor {
  id: number;
  type: 'individual' | 'organization';
  name: string;
  title?: string;
  avatar: string | { url: string; id?: number } | null;
  course_categories?: string[];
  instructor_sources?: string[];
  locations?: string[];
  keywords?: string[];
  teaching_domain?: string;
  target_audience?: string;
  service_highlights?: string;
  contact_info?: Record<string, string>;
  review_status: 'draft' | 'pending' | 'published' | 'rejected';
  review_note?: string;
}
