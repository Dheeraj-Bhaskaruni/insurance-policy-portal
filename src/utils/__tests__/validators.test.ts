import {
  isValidEmail,
  isValidPhone,
  isValidZipCode,
  isPositiveNumber,
  required,
  minLength,
  maxLength,
} from '../validators';

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@company.org')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@no-user.com')).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('accepts valid phone numbers', () => {
    expect(isValidPhone('555-123-4567')).toBe(true);
    expect(isValidPhone('(555) 123-4567')).toBe(true);
    expect(isValidPhone('5551234567')).toBe(true);
  });

  it('rejects invalid phone numbers', () => {
    expect(isValidPhone('123')).toBe(false);
  });
});

describe('isValidZipCode', () => {
  it('accepts valid zip codes', () => {
    expect(isValidZipCode('94102')).toBe(true);
    expect(isValidZipCode('94102-1234')).toBe(true);
  });

  it('rejects invalid zip codes', () => {
    expect(isValidZipCode('9410')).toBe(false);
  });
});

describe('isPositiveNumber', () => {
  it('accepts positive numbers', () => {
    expect(isPositiveNumber(1)).toBe(true);
  });

  it('rejects zero, negatives, and Infinity', () => {
    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber(-1)).toBe(false);
    expect(isPositiveNumber(Infinity)).toBe(false);
  });
});

describe('required', () => {
  it('returns undefined for non-empty strings', () => {
    expect(required('hello')).toBeUndefined();
  });

  it('returns error for empty strings', () => {
    expect(required('')).toBe('This field is required');
    expect(required('   ')).toBe('This field is required');
  });
});

describe('minLength', () => {
  const validate = minLength(5);
  it('passes for long enough strings', () => {
    expect(validate('hello')).toBeUndefined();
  });
  it('fails for short strings', () => {
    expect(validate('hi')).toBe('Must be at least 5 characters');
  });
});

describe('maxLength', () => {
  const validate = maxLength(5);
  it('passes for short enough strings', () => {
    expect(validate('hi')).toBeUndefined();
  });
  it('fails for long strings', () => {
    expect(validate('hello world')).toBe('Must be no more than 5 characters');
  });
});
