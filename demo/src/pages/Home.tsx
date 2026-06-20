import { Link } from 'react-router-dom';
import { InstructorCard } from '../components/InstructorCard';
import type { Instructor } from '../types/instructor';
import instructorsData from '../data/instructors.json';

const featured = (instructorsData as Omit<Instructor, 'id'>[])
  .map((d, i) => ({ ...d, id: i + 1 }))
  .filter((i) => i.review_status === 'published')
  .slice(0, 3);

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            v0.1 Demo
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            躍齡社區師資
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            為中高齡族群打造的在地運動教練媒合平台
            <br />
            找到離你最近的專業師資，開始健康新生活
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon="🏃"
            title="多元課程"
            description="籃球、瑜珈、CrossFit、拳擊⋯⋯超過 6 大類運動，從銀髮體適能到肌力訓練一應俱全"
          />
          <FeatureCard
            icon="📍"
            title="在地媒合"
            description="覆蓋全台 22 個縣市，依你的所在地找到最近的教練與機構"
          />
          <FeatureCard
            icon="✅"
            title="認證把關"
            description="所有師資皆通過審核機制（draft / pending / published / rejected）"
          />
        </section>

        {featured.length > 0 && (
          <section className="mb-12">
            <div className="flex items-end justify-between mb-5">
              <h2 className="text-2xl font-bold text-gray-900">精選師資</h2>
              <Link
                to="/instructors"
                className="text-sm font-medium text-apple-blue hover:underline"
              >
                查看全部 →
              </Link>
            </div>
            {/* Hybrid: desktop auto-fit grid; mobile (<=734px) horizontal snap scroller */}
            <div
              className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5
                         max-[734px]:flex max-[734px]:overflow-x-auto max-[734px]:snap-x
                         max-[734px]:scrollbar-none max-[734px]:pb-scroller
                         max-[734px]:-mx-6 max-[734px]:px-6"
            >
              {featured.map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
            </div>
          </section>
        )}

        <section className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">技術棧</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <TechBadge name="Vite 5" color="bg-purple-100 text-purple-700" />
            <TechBadge name="React 18" color="bg-cyan-100 text-cyan-700" />
            <TechBadge name="TypeScript" color="bg-blue-100 text-blue-700" />
            <TechBadge name="Tailwind v3" color="bg-emerald-100 text-emerald-700" />
            <TechBadge name="Strapi 5" color="bg-indigo-100 text-indigo-700" />
            <TechBadge name="Vitest 2" color="bg-yellow-100 text-yellow-700" />
            <TechBadge name="OpenSpec" color="bg-pink-100 text-pink-700" />
            <TechBadge name="Tailscale" color="bg-gray-100 text-gray-700" />
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">這個 Demo 展示了什麼</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-1">✓</span>
              <span>
                <strong>6 位 mock 師資</strong> 涵蓋 individual 與 organization 兩種類型
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-1">✓</span>
              <span>
                <strong>Grid 卡片版型</strong>：頭像、名稱、標題、課程分類 tags
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-1">✓</span>
              <span>
                <strong>Avatar fallback</strong>：無資料 / 載入失敗自動切換 placeholder
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-1">✓</span>
              <span>
                <strong>3 種 review_status</strong> 並存：published、pending、draft
              </span>
            </li>
          </ul>
        </section>

        <div className="text-center">
          <Link
            to="/instructors"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            瀏覽 6 位師資 →
          </Link>
        </div>

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            這是 <code className="px-2 py-0.5 bg-gray-100 rounded">fitnfun-side</code> 的
            front-end demo，純靜態，無後端依賴
          </p>
          <p className="mt-2">
            資料來源：
            <code className="px-2 py-0.5 bg-gray-100 rounded">strapi/__mocks__/instructors.json</code>
          </p>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function TechBadge({ name, color }: { name: string; color: string }) {
  return (
    <div className={`px-3 py-2 rounded-lg text-center font-medium ${color}`}>
      {name}
    </div>
  );
}
