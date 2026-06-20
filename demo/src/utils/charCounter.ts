export function getCounterClass(count: number, max: number): string {
  const threshold = Math.floor((max * 228) / 255);
  return count > threshold ? 'text-orange-500' : 'text-gray-400';
}
