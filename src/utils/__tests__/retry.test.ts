import { describe, it, expect, vi } from 'vitest';

import { withRetry } from '../retry';

describe('withRetry', () => {
  it('returns value on first successful attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await withRetry(fn, { maxRetries: 3, baseDelay: 10 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds eventually', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new TypeError('Network error'))
      .mockRejectedValueOnce(new TypeError('Network error'))
      .mockResolvedValue('recovered');

    const result = await withRetry(fn, { maxRetries: 3, baseDelay: 10 });
    expect(result).toBe('recovered');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('throws after exhausting retries', async () => {
    const fn = vi.fn().mockRejectedValue(new TypeError('persistent failure'));

    await expect(
      withRetry(fn, { maxRetries: 2, baseDelay: 10 }),
    ).rejects.toThrow('persistent failure');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('does not retry when retryOn returns false', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('non-retryable'));

    await expect(
      withRetry(fn, {
        maxRetries: 3,
        baseDelay: 10,
        retryOn: () => false,
      }),
    ).rejects.toThrow('non-retryable');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('respects custom retryOn condition', async () => {
    const error429 = Object.assign(new Error('Too Many Requests'), {
      response: { status: 429 },
    });
    const fn = vi.fn()
      .mockRejectedValueOnce(error429)
      .mockResolvedValue('ok');

    const result = await withRetry(fn, {
      maxRetries: 2,
      baseDelay: 10,
      retryOn: (err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status;
        return status === 429;
      },
    });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
