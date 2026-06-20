import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { InstructorForm } from './InstructorForm';

const mockNavigate = vi.fn();
const mockCreateInstructor = vi.fn();
const mockClearPending = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../utils/api', async () => {
  const actual = await vi.importActual<typeof import('../utils/api')>('../utils/api');
  return {
    ...actual,
    createInstructor: (...args: unknown[]) => mockCreateInstructor(...args),
    clearPending: () => mockClearPending(),
  };
});

function renderForm(props: { onSuccess?: () => void } = {}) {
  return render(
    <MemoryRouter>
      <InstructorForm {...props} />
    </MemoryRouter>,
  );
}

const FORBIDDEN_SIMPLIFIED = ['资', '联', '师', '为', '会', '过', '说', '审', '后', '课', '类', '项', '验', '码', '长', '边', '发', '头', '页'];

describe('InstructorForm — Traditional Chinese unification', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockCreateInstructor.mockReset();
    mockClearPending.mockReset();
  });

  it('renders no forbidden simplified characters in initial render', () => {
    const { container } = renderForm();
    const text = container.textContent ?? '';
    for (const ch of FORBIDDEN_SIMPLIFIED) {
      expect(text).not.toContain(ch);
    }
  });

  it('uses Traditional Chinese for section titles', () => {
    renderForm();
    expect(screen.getByText('基本資料')).toBeInTheDocument();
    expect(screen.getByText('課程資訊')).toBeInTheDocument();
    expect(screen.getByText('聯絡資訊')).toBeInTheDocument();
  });

  it('uses Traditional Chinese for labels', () => {
    renderForm();
    expect(screen.getByText('師資類別')).toBeInTheDocument();
    expect(screen.getByText('職稱')).toBeInTheDocument();
    expect(screen.getByText('電話')).toBeInTheDocument();
  });

  it('uses Traditional Chinese for placeholders', () => {
    renderForm();
    expect(screen.getByPlaceholderText('請填寫姓名')).toBeInTheDocument();
  });

  it('uses Traditional Chinese for submit button', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /送出申請/ })).toBeInTheDocument();
  });
});

describe('InstructorForm — character counter', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockCreateInstructor.mockReset();
    mockClearPending.mockReset();
  });

  it('shows "0 / 255" counter for empty name field', () => {
    renderForm();
    const nameInput = screen.getByPlaceholderText('請填寫姓名');
    expect(nameInput).toBeInTheDocument();
    expect(screen.getByTestId('name-counter')).toHaveTextContent('0 / 255');
  });

  it('shows "0 / 255" counter for empty title field', () => {
    renderForm();
    expect(screen.getByTestId('title-counter')).toHaveTextContent('0 / 255');
  });

  it('updates counter as user types in name', async () => {
    const user = userEvent.setup();
    renderForm();
    const nameInput = screen.getByPlaceholderText('請填寫姓名');
    await user.type(nameInput, '王小明');
    expect(screen.getByTestId('name-counter')).toHaveTextContent('3 / 255');
  });

  it('updates counter as user types in title', async () => {
    const user = userEvent.setup();
    renderForm();
    const titleInput = screen.getByPlaceholderText('例如：籃球體能教練');
    await user.type(titleInput, '籃球教練');
    expect(screen.getByTestId('title-counter')).toHaveTextContent('4 / 255');
  });

  it('keeps neutral counter color below 90%', () => {
    renderForm();
    const counter = screen.getByTestId('name-counter');
    expect(counter.className).toContain('text-gray-400');
    expect(counter.className).not.toContain('text-orange-500');
  });

  it('keeps neutral color at exactly 228 (90% boundary)', async () => {
    renderForm();
    const nameInput = screen.getByPlaceholderText('請填寫姓名');
    const text = '中'.repeat(228);
    fireEvent.change(nameInput, { target: { value: text } });
    expect((nameInput as HTMLInputElement).value.length).toBe(228);
    const counter = screen.getByTestId('name-counter');
    expect(counter.className).toContain('text-gray-400');
    expect(counter.className).not.toContain('text-orange-500');
  });

  it('switches to warning color above 90% (229+)', async () => {
    renderForm();
    const nameInput = screen.getByPlaceholderText('請填寫姓名');
    const text = '中'.repeat(229);
    fireEvent.change(nameInput, { target: { value: text } });
    const counter = screen.getByTestId('name-counter');
    expect(counter).toHaveTextContent('229 / 255');
    expect(counter.className).toContain('text-orange-500');
    expect(counter.className).not.toContain('text-gray-400');
  });
});

describe('InstructorForm — offline save UI', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockCreateInstructor.mockReset();
    mockClearPending.mockReset();
  });

  it('shows "查看暫存資料" button when savedLocally === true', async () => {
    const user = userEvent.setup();
    mockCreateInstructor.mockResolvedValue({
      success: false,
      error: '無法連線至伺服器',
      savedLocally: true,
    });

    renderForm();
    const nameInput = screen.getByPlaceholderText('請填寫姓名');
    await user.type(nameInput, '測試人員');
    await user.click(screen.getByRole('button', { name: /送出申請/ }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /查看暫存資料/ })).toBeInTheDocument();
    });
  });

  it('does NOT show "查看暫存資料" button on regular error', async () => {
    const user = userEvent.setup();
    mockCreateInstructor.mockResolvedValue({
      success: false,
      error: '伺服器錯誤 500',
      savedLocally: false,
    });

    renderForm();
    const nameInput = screen.getByPlaceholderText('請填寫姓名');
    await user.type(nameInput, '測試人員');
    await user.click(screen.getByRole('button', { name: /送出申請/ }));

    await waitFor(() => {
      expect(screen.getByText(/伺服器錯誤 500/)).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /查看暫存資料/ })).not.toBeInTheDocument();
  });

  it('expands inline block and shows localStorage JSON when toggle is clicked', async () => {
    const user = userEvent.setup();
    const pendingPayload = [{ name: '王小明', type: 'individual', _savedAt: '2026-01-01T00:00:00.000Z' }];
    window.localStorage.setItem('fitnfun-pending-instructors', JSON.stringify(pendingPayload));
    mockCreateInstructor.mockResolvedValue({
      success: false,
      error: '無法連線',
      savedLocally: true,
    });

    renderForm();
    const nameInput = screen.getByPlaceholderText('請填寫姓名');
    await user.type(nameInput, '測試');
    await user.click(screen.getByRole('button', { name: /送出申請/ }));

    const toggle = await screen.findByRole('button', { name: /查看暫存資料/ });
    await user.click(toggle);

    await waitFor(() => {
      expect(screen.getByTestId('pending-data-content')).toBeInTheDocument();
    });
    expect(screen.getByTestId('pending-data-content').textContent).toContain('王小明');
  });

  it('"清除暫存" button inside expanded block calls clearPending', async () => {
    const user = userEvent.setup();
    const pendingPayload = [{ name: '王小明' }];
    window.localStorage.setItem('fitnfun-pending-instructors', JSON.stringify(pendingPayload));
    mockCreateInstructor.mockResolvedValue({
      success: false,
      error: '無法連線',
      savedLocally: true,
    });

    renderForm();
    const nameInput = screen.getByPlaceholderText('請填寫姓名');
    await user.type(nameInput, '測試');
    await user.click(screen.getByRole('button', { name: /送出申請/ }));

    const toggle = await screen.findByRole('button', { name: /查看暫存資料/ });
    await user.click(toggle);

    const clearBtn = await screen.findByRole('button', { name: /清除暫存/ });
    await user.click(clearBtn);

    expect(mockClearPending).toHaveBeenCalledTimes(1);
  });
});

describe('InstructorForm — successful submit behavior', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockCreateInstructor.mockReset();
    mockClearPending.mockReset();
  });

  it('shows "返回師資列表" button after successful submit', async () => {
    const user = userEvent.setup();
    mockCreateInstructor.mockResolvedValue({ success: true, data: { id: 1 } });

    renderForm();
    const nameInput = screen.getByPlaceholderText('請填寫姓名');
    await user.type(nameInput, '王小明');
    await user.click(screen.getByRole('button', { name: /送出申請/ }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /返回師資列表/ })).toBeInTheDocument();
    });
  });

  it('does NOT auto-navigate after successful submit', async () => {
    const user = userEvent.setup();
    mockCreateInstructor.mockResolvedValue({ success: true, data: { id: 1 } });

    renderForm();
    const nameInput = screen.getByPlaceholderText('請填寫姓名');
    await user.type(nameInput, '王小明');
    await user.click(screen.getByRole('button', { name: /送出申請/ }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /返回師資列表/ })).toBeInTheDocument();
    });

    await new Promise((r) => setTimeout(r, 50));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('clicking "返回師資列表" navigates to /instructors', async () => {
    const user = userEvent.setup();
    mockCreateInstructor.mockResolvedValue({ success: true, data: { id: 1 } });

    renderForm();
    const nameInput = screen.getByPlaceholderText('請填寫姓名');
    await user.type(nameInput, '王小明');
    await user.click(screen.getByRole('button', { name: /送出申請/ }));

    const backBtn = await screen.findByRole('button', { name: /返回師資列表/ });
    await user.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/instructors');
  });

  it('calls onSuccess callback after successful submit when provided', async () => {
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    mockCreateInstructor.mockResolvedValue({ success: true, data: { id: 1 } });

    renderForm({ onSuccess });
    const nameInput = screen.getByPlaceholderText('請填寫姓名');
    await user.type(nameInput, '王小明');
    await user.click(screen.getByRole('button', { name: /送出申請/ }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
