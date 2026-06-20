import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import {
  validateAvatarFile,
  ACCEPTED_AVATAR_MIME_TYPES,
} from '../utils/avatarUpload';

interface AvatarUploadProps {
  onChange?: (file: File | null) => void;
}

export function AvatarUpload({ onChange }: AvatarUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const applyFile = (next: File | null) => {
    if (!next) {
      setFile(null);
      setError(null);
      onChange?.(null);
      return;
    }
    const result = validateAvatarFile(next);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
    setFile(next);
    onChange?.(next);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    applyFile(next);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const next = e.dataTransfer.files?.[0] ?? null;
    applyFile(next);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFilePicker();
    }
  };

  const handleClear = () => applyFile(null);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-apple-ink mb-2">
        大頭照
        <span className="text-gray-400 ml-1 text-xs">（選填）</span>
      </label>

      <div className="flex items-start gap-4">
        <div
          role="button"
          tabIndex={0}
          onClick={openFilePicker}
          onKeyDown={handleKeyDown}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          aria-label="上傳大頭照"
          className={`relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center
                      bg-gray-100 border-2 cursor-pointer transition
                      ${
                        isDragging
                          ? 'border-apple-blue'
                          : 'border-dashed border-gray-300'
                      }
                      focus:outline-none focus:ring-2 focus:ring-apple-blue`}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="大頭照預覽"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400 pointer-events-none">
              <span className="text-2xl" aria-hidden>
                📷
              </span>
              <span className="text-[10px] mt-0.5">上傳</span>
            </div>
          )}
        </div>

        <div className="flex-1 pt-1">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_AVATAR_MIME_TYPES.join(',')}
            onChange={handleInputChange}
            className="hidden"
            aria-label="選擇大頭照檔案"
          />

          {file && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-pill bg-gray-100 text-gray-600 px-4 py-1.5 text-xs font-medium
                         transition hover:bg-gray-200 focus-visible:outline
                         focus-visible:outline-2 focus-visible:outline-offset-2
                         focus-visible:outline-gray-400"
            >
              重新上傳
            </button>
          )}

          <p className="text-xs text-gray-500 mt-2">
            支援 JPG / PNG / WebP，最大 5MB
          </p>

          {error && (
            <p className="text-xs text-red-500 mt-1" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
