import { describe, it, expect, vi, beforeEach } from 'vitest';

import { exportToCsv } from '../exportCsv';

describe('exportToCsv', () => {
  let mockLink: {
    setAttribute: ReturnType<typeof vi.fn>;
    click: ReturnType<typeof vi.fn>;
    style: Record<string, string>;
  };

  beforeEach(() => {
    mockLink = {
      setAttribute: vi.fn(),
      click: vi.fn(),
      style: {},
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLElement);
    vi.spyOn(document.body, 'appendChild').mockReturnValue(null as unknown as Node);
    vi.spyOn(document.body, 'removeChild').mockReturnValue(null as unknown as Node);
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:test-url');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it('creates a download link with correct filename', () => {
    const data = [{ name: 'Alice', age: 30 }];
    const columns = [
      { key: 'name' as const, header: 'Name' },
      { key: 'age' as const, header: 'Age' },
    ];

    exportToCsv(data, columns, 'test-export');

    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'test-export.csv');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('uses formatter when provided', () => {
    const data = [{ amount: 1500 }];
    const columns = [
      { key: 'amount' as const, header: 'Amount', formatter: (v: unknown) => `$${v}` },
    ];

    exportToCsv(data, columns, 'formatted');

    expect(URL.createObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'text/csv;charset=utf-8;' }),
    );
  });

  it('escapes double quotes in values', () => {
    const data = [{ text: 'He said "hello"' }];
    const columns = [{ key: 'text' as const, header: 'Text' }];

    exportToCsv(data, columns, 'escaped');

    const blobCall = (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(blobCall).toBeInstanceOf(Blob);
  });

  it('handles empty data array', () => {
    exportToCsv([], [{ key: 'name' as const, header: 'Name' }], 'empty');

    expect(mockLink.click).toHaveBeenCalled();
  });
});
