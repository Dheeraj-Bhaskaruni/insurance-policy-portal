interface CsvColumn<T> {
  key: keyof T;
  header: string;
  formatter?: (value: T[keyof T]) => string;
}

export function exportToCsv<T extends Record<string, unknown>>(
  data: T[],
  columns: CsvColumn<T>[],
  filename: string,
): void {
  const headers = columns.map((col) => col.header);

  const rows = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key];
      const formatted = col.formatter ? col.formatter(value) : String(value ?? '');
      return `"${formatted.replace(/"/g, '""')}"`;
    }),
  );

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
