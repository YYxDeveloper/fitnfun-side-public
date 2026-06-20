import { Link } from 'react-router-dom';
import { InstructorForm } from '../components/InstructorForm';

export function NewInstructor() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-8">
          <Link
            to="/instructors"
            className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block"
          >
            ← 回到師資列表
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            新增社區師資
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            填寫基本資料，送出後進入草稿審核流程
          </p>
        </header>

        <InstructorForm />
      </div>
    </div>
  );
}
