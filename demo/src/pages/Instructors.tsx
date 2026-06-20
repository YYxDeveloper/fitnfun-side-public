import { Link } from 'react-router-dom';
import { InstructorCard } from '../components/InstructorCard';
import type { Instructor } from '../types/instructor';
import instructorsData from '../data/instructors.json';

const instructors = (instructorsData as Omit<Instructor, 'id'>[]).map((d, i) => ({
  ...d,
  id: i + 1,
}));

export function Instructors() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block"
            >
              ← 回到首頁
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              社區師資名單
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              共 {instructors.length} 位 ·{' '}
              {instructors.filter((i) => i.type === 'individual').length} 位個人教練 ·{' '}
              {instructors.filter((i) => i.type === 'organization').length} 個機構
            </p>
          </div>
          <Link
            to="/instructors/new"
            className="rounded-pill bg-apple-blue text-white px-5 py-2.5 text-sm font-medium transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
          >
            + 新增師資
          </Link>
        </header>

        {/* Hybrid: desktop auto-fit grid; mobile (<=734px) horizontal snap scroller */}
        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5
                     max-[734px]:flex max-[734px]:overflow-x-auto max-[734px]:snap-x
                     max-[734px]:scrollbar-none max-[734px]:pb-scroller
                     max-[734px]:-mx-4 max-[734px]:px-4"
        >
          {instructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-900">
            ← 回到首頁
          </Link>
        </footer>
      </div>
    </div>
  );
}
