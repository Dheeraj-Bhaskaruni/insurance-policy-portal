interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  retryOn?: (error: unknown) => boolean;
}

const defaultConfig: Required<RetryConfig> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  retryOn: (error: unknown) => {
    if (error instanceof Error && 'response' in error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      return status !== undefined && status >= 500;
    }
    return error instanceof TypeError;
  },
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {},
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay, retryOn } = { ...defaultConfig, ...config };

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !retryOn(error)) {
        throw error;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      const jitter = delay * (0.5 + Math.random() * 0.5);
      await new Promise((resolve) => setTimeout(resolve, jitter));
    }
  }

  throw lastError;
}
