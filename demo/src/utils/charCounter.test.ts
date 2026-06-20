import { describe, it, expect } from 'vitest';
import { getCounterClass } from './charCounter';

describe('getCounterClass', () => {
  it('returns base class when count is well under limit', () => {
    expect(getCounterClass(0, 255)).toBe('text-gray-400');
    expect(getCounterClass(100, 255)).toBe('text-gray-400');
  });

  it('returns base class at exactly 90% (228) - threshold is strict greater-than', () => {
    expect(getCounterClass(228, 255)).toBe('text-gray-400');
  });

  it('returns warning class above 90% (229+)', () => {
    expect(getCounterClass(229, 255)).toBe('text-orange-500');
    expect(getCounterClass(255, 255)).toBe('text-orange-500');
  });

  it('handles empty count as base class', () => {
    expect(getCounterClass(0, 255)).toBe('text-gray-400');
  });
});
