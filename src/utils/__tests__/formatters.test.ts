import {
  formatCurrency,
  formatDate,
  formatPhoneNumber,
  truncateText,
  capitalizeFirst,
  formatPercentage,
} from '../formatters';

describe('formatCurrency', () => {
  it('formats positive amounts', () => {
    expect(formatCurrency(1200)).toBe('$1,200');
    expect(formatCurrency(50000)).toBe('$50,000');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('formats decimal amounts', () => {
    expect(formatCurrency(99.99)).toBe('$99.99');
  });
});

describe('formatDate', () => {
  it('formats ISO date strings', () => {
    expect(formatDate('2026-03-15T12:00:00Z')).toBe('Mar 15, 2026');
  });

  it('returns Invalid date for bad input', () => {
    expect(formatDate('not-a-date')).toBe('Invalid date');
  });

  it('accepts custom format', () => {
    expect(formatDate('2026-01-01T12:00:00Z', 'yyyy')).toBe('2026');
  });
});

describe('formatPhoneNumber', () => {
  it('formats 10-digit number', () => {
    expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
  });

  it('returns original for non-matching format', () => {
    expect(formatPhoneNumber('5550101')).toBe('5550101');
  });
});

describe('truncateText', () => {
  it('does not truncate short text', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('truncates long text with ellipsis', () => {
    expect(truncateText('Hello World!', 5)).toBe('Hello...');
  });
});

describe('capitalizeFirst', () => {
  it('capitalizes first letter', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
  });
});

describe('formatPercentage', () => {
  it('formats decimal as percentage', () => {
    expect(formatPercentage(0.856)).toBe('85.6%');
  });
});
