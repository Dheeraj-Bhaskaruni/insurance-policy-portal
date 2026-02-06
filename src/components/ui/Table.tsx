import React from 'react';

import './Table.css';

interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  loading?: boolean;
  emptyMessage?: string;
}

function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  sortBy,
  sortOrder,
  onSort,
  loading = false,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  const getSortIndicator = (key: string) => {
    if (sortBy !== key) return '';
    return sortOrder === 'asc' ? ' \u2191' : ' \u2193';
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="table-loading">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="table-skeleton-row">
              {columns.map((_, j) => (
                <div key={j} className="table-skeleton-cell" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                onClick={() => col.sortable && onSort?.(col.key)}
                onKeyDown={(e) => {
                  if (col.sortable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSort?.(col.key);
                  }
                }}
                role={col.sortable ? 'button' : undefined}
                tabIndex={col.sortable ? 0 : undefined}
                aria-sort={
                  sortBy === col.key
                    ? sortOrder === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {col.label}
                {col.sortable && getSortIndicator(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={onRowClick ? 'clickable' : ''}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
