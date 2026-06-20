import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { TagInput } from './TagInput';
import { AvatarUpload } from './AvatarUpload';
import { ChipSelector } from './ChipSelector';
import { COURSE_CATEGORY_OPTIONS, INSTRUCTOR_SOURCE_OPTIONS } from '../constants/instructorOptions';
import {
  createInstructor,
  uploadAvatar,
  clearPending,
  getPending,
  type CreateInstructorInput,
} from '../utils/api';
import { getCounterClass } from '../utils/charCounter';

type FormState = Omit<CreateInstructorInput, 'course_categories' | 'instructor_sources' | 'locations' | 'keywords' | 'contact_info' | 'title'> & {
  course_categories: string[];
  instructor_sources: string[];
  locations: string[];
  keywords: string[];
  title: string;
  contactPhone: string;
  contactEmail: string;
  contactLine: string;
  contactWebsite: string;
};

const INITIAL: FormState = {
  type: 'individual',
  name: '',
  title: '',
  course_categories: [],
  instructor_sources: [],
  locations: [],
  keywords: [],
  teaching_domain: '',
  target_audience: '',
  service_highlights: '',
  contactPhone: '',
  contactEmail: '',
  contactLine: '',
  contactWebsite: '',
};

interface Props {
  onSuccess?: () => void;
}

const NAME_MAX = 255;
const TITLE_MAX = 255;

export function InstructorForm({ onSuccess }: Props) {
  const [form, setForm] = useState<FormState>({ ...INITIAL });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    savedLocally?: boolean;
  } | null>(null);
  const [showPending, setShowPending] = useState(false);
  const navigate = useNavigate();

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage({ type: 'error', text: '請填寫姓名' });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    setShowPending(false);

    let avatarId: number | null = null;
    if (avatarFile) {
      avatarId = await uploadAvatar(avatarFile);
    }

    const contact_info: Record<string, string> = {};
    if (form.contactPhone) contact_info['電話'] = form.contactPhone;
    if (form.contactEmail) contact_info['email'] = form.contactEmail;
    if (form.contactLine) contact_info['line'] = form.contactLine;
    if (form.contactWebsite) contact_info['website'] = form.contactWebsite;

    const input: CreateInstructorInput = {
      type: form.type,
      name: form.name.trim(),
      title: form.title?.trim() || undefined,
      course_categories: form.course_categories,
      instructor_sources: form.instructor_sources,
      locations: form.locations,
      keywords: form.keywords,
      teaching_domain: form.teaching_domain?.trim() || undefined,
      target_audience: form.target_audience?.trim() || undefined,
      service_highlights: form.service_highlights?.trim() || undefined,
      contact_info: Object.keys(contact_info).length > 0 ? contact_info : undefined,
      review_status: 'draft',
      ...(avatarId !== null ? { avatar: avatarId } : {}),
    };

    const result = await createInstructor(input);

    setSubmitting(false);

    if (result.success) {
      setMessage({ type: 'success', text: '送出成功！已建立草稿，待管理員審核。' });
      setForm({ ...INITIAL });
      if (onSuccess) {
        onSuccess();
      }
    } else {
      const saved = result.savedLocally ? '（已暫存至本機）' : '';
      setMessage({ type: 'error', text: `${result.error}${saved}`, savedLocally: result.savedLocally });
    }
  };

  const handleClearPending = () => {
    clearPending();
    setShowPending(false);
  };

  const pendingContent = showPending
    ? JSON.stringify(getPending(), null, 2)
    : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div>
          <div
            className={`rounded-xl p-4 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
          {message.type === 'success' && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/instructors')}
                className="rounded-pill bg-apple-blue text-white px-6 py-2.5 text-sm font-medium transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
              >
                返回師資列表
              </button>
            </div>
          )}
          {message.type === 'error' && message.savedLocally && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowPending((v) => !v)}
                className="text-sm text-apple-blue hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue rounded"
              >
                {showPending ? '收合暫存資料' : '查看暫存資料 →'}
              </button>
              {showPending && (
                <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <pre
                    data-testid="pending-data-content"
                    className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap break-all"
                  >
                    {pendingContent}
                  </pre>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleClearPending}
                      className="rounded-pill bg-gray-100 text-gray-600 px-4 py-1.5 text-xs font-medium transition hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                    >
                      清除暫存
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Section 1: Basic Info */}
      <section className="bg-white rounded-card shadow-card p-6">
        <h2 className="text-lg font-semibold text-apple-ink mb-4">基本資料</h2>

        <AvatarUpload onChange={setAvatarFile} />

        <div className="mb-4">
          <label className="block text-sm font-medium text-apple-ink mb-1">
            師資類別<span className="text-red-500 ml-0.5">*</span>
          </label>
          <select
            value={form.type}
            onChange={(e) =>
              set('type', e.target.value as 'individual' | 'organization')
            }
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-apple-blue focus:border-apple-blue outline-none"
          >
            <option value="individual">個人教練</option>
            <option value="organization">機構</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-apple-ink mb-1">
            姓名<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="請填寫姓名"
              maxLength={NAME_MAX}
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-apple-blue focus:border-apple-blue outline-none pr-16"
            />
            <span
              data-testid="name-counter"
              className={`absolute right-3 bottom-2 text-xs ${getCounterClass(form.name.length, NAME_MAX)}`}
            >
              {form.name.length} / {NAME_MAX}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-apple-ink mb-1">
            職稱
          </label>
          <div className="relative">
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="例如：籃球體能教練"
              maxLength={TITLE_MAX}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-apple-blue focus:border-apple-blue outline-none pr-16"
            />
            <span
              data-testid="title-counter"
              className={`absolute right-3 bottom-2 text-xs ${getCounterClass(form.title.length, TITLE_MAX)}`}
            >
              {form.title.length} / {TITLE_MAX}
            </span>
          </div>
        </div>

        <TagInput
          label="所在地"
          value={form.locations}
          onChange={(v) => set('locations', v)}
          placeholder="例如：台北市"
          hint="按 Enter 或逗號新增標籤"
        />
      </section>

      {/* Section 2: Course Info */}
      <section className="bg-white rounded-card shadow-card p-6">
        <h2 className="text-lg font-semibold text-apple-ink mb-4">課程資訊</h2>

        <ChipSelector
          label="課程分類"
          options={COURSE_CATEGORY_OPTIONS}
          value={form.course_categories}
          onChange={(v) => set('course_categories', v)}
          hint="選擇對應的課程分類，或自訂其他"
        />

        <TagInput
          label="關鍵字"
          value={form.keywords}
          onChange={(v) => set('keywords', v)}
          placeholder="例如：籃球、體能"
          hint="按 Enter 或逗號新增標籤"
        />

        <ChipSelector
          label="來源"
          options={INSTRUCTOR_SOURCE_OPTIONS}
          value={form.instructor_sources}
          onChange={(v) => set('instructor_sources', v)}
          hint="選擇對應的師資來源，或自訂其他"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-apple-ink mb-1">
            教學領域
          </label>
          <textarea
            value={form.teaching_domain}
            onChange={(e) => set('teaching_domain', e.target.value)}
            placeholder="描述你的專業領域與教學特色"
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-apple-blue focus:border-apple-blue outline-none resize-y"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-apple-ink mb-1">
            適合對象
          </label>
          <textarea
            value={form.target_audience}
            onChange={(e) => set('target_audience', e.target.value)}
            placeholder="描述適合的學員群體"
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-apple-blue focus:border-apple-blue outline-none resize-y"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-apple-ink mb-1">
            服務亮點
          </label>
          <textarea
            value={form.service_highlights}
            onChange={(e) => set('service_highlights', e.target.value)}
            placeholder="列出你的服務特色（每行一項）"
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-apple-blue focus:border-apple-blue outline-none resize-y"
          />
        </div>
      </section>

      {/* Section 3: Contact Info */}
      <section className="bg-white rounded-card shadow-card p-6">
        <h2 className="text-lg font-semibold text-apple-ink mb-4">聯絡資訊</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-apple-ink mb-1">
              電話
            </label>
            <input
              type="tel"
              value={form.contactPhone}
              onChange={(e) => set('contactPhone', e.target.value)}
              placeholder="09xx-xxx-xxx"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-apple-blue focus:border-apple-blue outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-ink mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => set('contactEmail', e.target.value)}
              placeholder="email@example.com"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-apple-blue focus:border-apple-blue outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-ink mb-1">
              LINE
            </label>
            <input
              type="text"
              value={form.contactLine}
              onChange={(e) => set('contactLine', e.target.value)}
              placeholder="@line_id"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-apple-blue focus:border-apple-blue outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-ink mb-1">
              Website
            </label>
            <input
              type="url"
              value={form.contactWebsite}
              onChange={(e) => set('contactWebsite', e.target.value)}
              placeholder="https://example.com"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-apple-blue focus:border-apple-blue outline-none"
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => navigate('/instructors')}
          className="rounded-pill bg-gray-100 text-gray-600 px-6 py-2.5 text-sm font-medium transition hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-pill bg-apple-blue text-white px-6 py-2.5 text-sm font-medium transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? '送出中...' : '送出申請 →'}
        </button>
      </div>
    </form>
  );
}
