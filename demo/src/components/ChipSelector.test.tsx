// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ChipSelector } from './ChipSelector';

const OPTIONS = [
  { value: 'yoga', label: '瑜珈' },
  { value: 'boxing', label: '拳擊' },
  { value: 'dance', label: '舞蹈' },
];

function Harness({ initial = [] as string[] }: { initial?: string[] }) {
  const [val, setVal] = useState<string[]>(initial);
  return <ChipSelector label="測試標籤" options={OPTIONS} value={val} onChange={setVal} />;
}

describe('ChipSelector', () => {
  it('renders all preset chips with their Chinese labels', () => {
    render(<Harness />);
    expect(screen.getByRole('button', { name: '瑜珈' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '拳擊' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '舞蹈' })).toBeInTheDocument();
  });

  it('renders the "+ 自訂" chip at the end', () => {
    render(<Harness />);
    expect(screen.getByRole('button', { name: /自訂/ })).toBeInTheDocument();
  });

  it('renders the label and shows selected state for initial value', () => {
    render(<Harness initial={['yoga']} />);
    expect(screen.getByText('測試標籤')).toBeInTheDocument();
    const yogaBtn = screen.getByRole('button', { name: '瑜珈' });
    expect(yogaBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('toggles a preset chip on click (select then deselect)', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const yogaBtn = screen.getByRole('button', { name: '瑜珈' });

    await user.click(yogaBtn);
    expect(yogaBtn).toHaveAttribute('aria-pressed', 'true');

    await user.click(yogaBtn);
    expect(yogaBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('supports selecting multiple chips at once', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: '瑜珈' }));
    await user.click(screen.getByRole('button', { name: '拳擊' }));

    expect(screen.getByRole('button', { name: '瑜珈' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '拳擊' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '舞蹈' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('submits the English key, not the Chinese label', async () => {
    const handleChange = vi.fn();
    render(
      <ChipSelector
        label="課程分類"
        options={OPTIONS}
        value={[]}
        onChange={handleChange}
      />
    );
    await userEvent.setup().click(screen.getByRole('button', { name: '瑜珈' }));
    expect(handleChange).toHaveBeenLastCalledWith(['yoga']);
  });

  it('expands an input when "+ 自訂" chip is clicked', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: /自訂/ }));
    expect(screen.getByPlaceholderText(/輸入/)).toBeInTheDocument();
  });

  it('adds a custom value via Enter and shows it in chip list', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: /自訂/ }));
    const input = screen.getByPlaceholderText(/輸入/);
    await user.type(input, '體適能{Enter}');

    expect(screen.getByText('體適能')).toBeInTheDocument();
  });

  it('removes a custom value via its × button', async () => {
    const user = userEvent.setup();
    render(<Harness initial={['my-custom']} />);
    expect(screen.getByText('my-custom')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '移除 my-custom' }));
    expect(screen.queryByText('my-custom')).not.toBeInTheDocument();
  });

  it('emits a string[] onChange with combined preset keys and custom strings', async () => {
    const handleChange = vi.fn();
    function Wrapper() {
      const [val, setVal] = useState<string[]>([]);
      return (
        <ChipSelector
          label="x"
          options={OPTIONS}
          value={val}
          onChange={(next) => {
            setVal(next);
            handleChange(next);
          }}
        />
      );
    }
    const user = userEvent.setup();
    render(<Wrapper />);

    await user.click(screen.getByRole('button', { name: '瑜珈' }));
    expect(handleChange).toHaveBeenLastCalledWith(['yoga']);

    await user.click(screen.getByRole('button', { name: /自訂/ }));
    const input = screen.getByPlaceholderText(/輸入/);
    await user.type(input, '皮拉提斯{Enter}');
    expect(handleChange).toHaveBeenLastCalledWith(['yoga', '皮拉提斯']);
  });

  it('does not call onChange on initial render with empty value', () => {
    const handleChange = vi.fn();
    render(
      <ChipSelector
        label="x"
        options={OPTIONS}
        value={[]}
        onChange={handleChange}
      />
    );
    expect(handleChange).not.toHaveBeenCalled();
  });
});
