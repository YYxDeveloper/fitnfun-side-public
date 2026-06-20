import { useState } from 'react';
import { resolveAvatarUrl } from '../utils/avatar';

interface AvatarProps {
  src: string | { url: string } | null | undefined;
  alt: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 64, className = '' }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const resolved = errored ? resolveAvatarUrl('/images/default-avatar.jpg') : resolveAvatarUrl(src);

  if (!resolved) {
    return (
      <div
        className={`rounded-full bg-gray-200 flex items-center justify-center text-gray-400 ${className}`}
        style={{ width: size, height: size }}
        aria-label={alt}
      >
        <span className="text-2xl">👤</span>
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className={`rounded-full object-cover ${className}`}
    />
  );
}
