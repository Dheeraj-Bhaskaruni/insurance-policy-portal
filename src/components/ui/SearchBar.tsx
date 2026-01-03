import React, { useState, useCallback } from 'react';

import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
  initialValue = '',
}) => {
  const [value, setValue] = useState(initialValue);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onSearch(newValue), debounceMs);
    },
    [onSearch, debounceMs],
  );

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">&#128269;</span>
      <input
        type="search"
        className="search-input"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search"
      />
      {value && (
        <button className="search-clear" onClick={handleClear} aria-label="Clear search">
          &times;
        </button>
      )}
    </div>
  );
};

export default SearchBar;
