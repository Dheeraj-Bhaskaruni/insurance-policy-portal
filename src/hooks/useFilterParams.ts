import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { FilterParams } from '../types';

const PARAM_KEYS = ['search', 'status', 'type', 'page', 'pageSize', 'sortBy', 'sortOrder'] as const;

export function useFilterParams(defaults?: Partial<FilterParams>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<FilterParams>(() => {
    const params: FilterParams = { ...defaults };

    for (const key of PARAM_KEYS) {
      const value = searchParams.get(key);
      if (value !== null) {
        if (key === 'page' || key === 'pageSize') {
          const num = parseInt(value, 10);
          if (!isNaN(num) && num > 0) {
            params[key] = num;
          }
        } else {
          (params as Record<string, string>)[key] = value;
        }
      }
    }

    return params;
  }, [searchParams, defaults]);

  const setFilters = useCallback(
    (updates: Partial<FilterParams>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        for (const [key, value] of Object.entries(updates)) {
          if (value === undefined || value === '' || value === null) {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        }

        return next;
      }, { replace: true });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return { filters, setFilters, clearFilters };
}
