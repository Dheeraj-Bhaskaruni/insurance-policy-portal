import policiesReducer, { setFilters, clearSelectedPolicy } from '../policiesSlice';

describe('policiesSlice', () => {
  const initialState = {
    items: [],
    selectedPolicy: null,
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,
    filters: { page: 1, pageSize: 10 },
  };

  it('returns initial state', () => {
    expect(policiesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('handles setFilters', () => {
    const state = policiesReducer(initialState, setFilters({ search: 'test', page: 2 }));
    expect(state.filters.search).toBe('test');
    expect(state.filters.page).toBe(2);
    expect(state.filters.pageSize).toBe(10);
  });

  it('handles clearSelectedPolicy', () => {
    const withSelected = {
      ...initialState,
      selectedPolicy: { id: 'test' } as never,
    };
    const state = policiesReducer(withSelected, clearSelectedPolicy());
    expect(state.selectedPolicy).toBeNull();
  });
});
