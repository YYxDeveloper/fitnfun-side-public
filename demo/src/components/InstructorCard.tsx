import { Avatar } from './Avatar';
import type { Instructor } from '../types/instructor';

const STATUS_LABELS: Record<Instructor['review_status'], { label: string; color: string }> = {
  published: { label: '已上架', color: 'bg-emerald-100 text-emerald-700' },
  pending: { label: '審核中', color: 'bg-yellow-100 text-yellow-700' },
  draft: { label: '草稿', color: 'bg-gray-100 text-gray-600' },
  rejected: { label: '已退回', color: 'bg-red-100 text-red-700' },
};

const TYPE_LABELS: Record<Instructor['type'], string> = {
  individual: '個人教練',
  organization: '機構',
};

interface Props {
  instructor: Instructor;
}

/**
 * Apple-derived product card: white surface, soft shadow, lifts on hover.
 * Shared by the Instructors grid and the Home featured scroller so both stay
 * visually identical. Mobile (<=734px) sizing is driven by the parent layout.
 */
export function InstructorCard({ instructor }: Props) {
  const status = STATUS_LABELS[instructor.review_status];
  const type = TYPE_LABELS[instructor.type];

  return (
    <article
      className="bg-apple-page rounded-card shadow-card overflow-hidden flex flex-col
                 transition-all duration-300 ease-apple
                 hover:-translate-y-0.5 hover:shadow-card-hover
                 max-[734px]:shrink-0 max-[734px]:basis-[80vw] max-[734px]:snap-center"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-emerald-50 to-sky-50 relative flex items-center justify-center">
        <Avatar
          src={instructor.avatar}
          alt={instructor.name}
          size={120}
          className="border-4 border-white shadow-md"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-pill ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* eyebrow tag */}
        <span className="text-xs font-semibold text-apple-tag mb-1">{type}</span>
        <h3 className="text-lg font-semibold text-apple-ink mb-1">{instructor.name}</h3>
        {instructor.title && <p className="text-sm text-gray-500 mb-3">{instructor.title}</p>}

        {instructor.course_categories && instructor.course_categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {instructor.course_categories.slice(0, 4).map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 rounded-pill"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {instructor.locations && instructor.locations.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <span>📍</span>
            <span>{instructor.locations.join('、')}</span>
          </div>
        )}

        {instructor.target_audience && (
          <p className="text-xs text-gray-600 line-clamp-2">{instructor.target_audience}</p>
        )}

        {/* dual pill CTA — only the primary uses high-saturation apple-blue */}
        <div className="mt-auto pt-4 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-pill bg-apple-ink text-white text-sm py-2 transition
                       hover:bg-black focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-apple-ink"
          >
            深入了解
          </button>
          <button
            type="button"
            className="flex-1 rounded-pill bg-apple-blue text-white text-sm py-2 transition
                       hover:brightness-110 focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
          >
            預約諮詢
          </button>
        </div>
      </div>
    </article>
  );
}
