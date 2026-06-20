import { useState, type KeyboardEvent } from 'react';

export interface ChipOption {
  value: string;
  label: string;
}

export interface ChipSelectorProps {
  label: string;
  options: ChipOption[];
  value: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
  hint?: string;
  customPlaceholder?: string;
}

export function ChipSelector({
  label,
  options,
  value,
  onChange,
  required,
  hint,
  customPlaceholder = '輸入後按 Enter',
}: ChipSelectorProps) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const presetKeys = new Set(options.map((o) => o.value));
  const customValues = value.filter((v) => !presetKeys.has(v));

  const isSelected = (v: string) => value.includes(v);

  const toggle = (v: string) => {
    if (isSelected(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      onChange([...value, v]);
    }
  };

  const addCustom = (raw: string) => {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setCustomInput('');
  };

  const removeCustom = (v: string) => {
    onChange(value.filter((x) => x !== v));
  };

  const handleCustomKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (customInput.trim()) {
        addCustom(customInput);
      }
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-apple-ink mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <div className="flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-apple-blue focus-within:border-apple-blue min-h-[42px]">
        {options.map((opt) => {
          const selected = isSelected(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              aria-pressed={selected}
              className={
                selected
                  ? 'px-3 py-1 text-xs rounded-pill bg-apple-blue text-white border border-apple-blue transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue'
                  : 'px-3 py-1 text-xs rounded-pill bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300'
              }
            >
              {opt.label}
            </button>
          );
        })}

        {customValues.map((cv) => (
          <span
            key={cv}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-pill border border-emerald-200"
          >
            {cv}
            <button
              type="button"
              onClick={() => removeCustom(cv)}
              className="text-emerald-500 hover:text-emerald-800 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 rounded-full"
              aria-label={`移除 ${cv}`}
            >
              ×
            </button>
          </span>
        ))}

        {customOpen ? (
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleCustomKeyDown}
            onBlur={() => {
              if (customInput.trim()) addCustom(customInput);
              setCustomOpen(false);
            }}
            autoFocus
            placeholder={customPlaceholder}
            className="flex-1 min-w-[120px] text-sm outline-none bg-transparent"
          />
        ) : (
          <button
            type="button"
            onClick={() => setCustomOpen(true)}
            className="px-3 py-1 text-xs rounded-pill border border-dashed border-gray-300 text-gray-500 hover:border-apple-blue hover:text-apple-blue transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
          >
            ＋ 自訂
          </button>
        )}
      </div>

      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
