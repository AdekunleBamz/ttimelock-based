// Math utilities for common numeric operations

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

export function roundTo(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function floorTo(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

export function ceilTo(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.ceil(value * factor) / factor;
}

export function toPercent(value: number, decimals = 2): string {
  return `${roundTo(value * 100, decimals)}%`;
}

export function fromPercent(value: number): number {
  return value / 100;
}

export function safeDivide(numerator: number, denominator: number, fallback = 0): number {
  if (denominator === 0) return fallback;
  return numerator / denominator;
}

export function sum(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function percentOf(value: number, total: number): number {
  return safeDivide(value * 100, total, 0);
}

export function withinRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function normalize(value: number, min: number, max: number): number {
  if (min === max) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

export function denormalize(value: number, min: number, max: number): number {
  return min + (max - min) * clamp(value, 0, 1);
}
