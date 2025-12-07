import React, { useState } from 'react';
import '../styles/FilterPanel.css';

const FilterPanel = ({ filters, filterOptions, onFilterChange, onSortChange, sortBy }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (filterName) => {
    setOpenDropdown(openDropdown === filterName ? null : filterName);
  };

  const handleMultiSelect = (filterName, value) => {
    const currentValues = filters[filterName] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({
      ...filters,
      [filterName]: newValues,
    });
  };

  const handleAgeRangeChange = (type, value) => {
    const ageRange = filters.ageRange || { min: undefined, max: undefined };
    onFilterChange({
      ...filters,
      ageRange: {
        ...ageRange,
        [type]: value ? parseInt(value) : undefined,
      },
    });
  };

  const handleDateRangeChange = (type, value) => {
    const dateRange = filters.dateRange || { start: null, end: null };
    onFilterChange({
      ...filters,
      dateRange: {
        ...dateRange,
        [type]: value || null,
      },
    });
  };

  const getSelectedCount = (filterName) => {
    const values = filters[filterName];
    return values && values.length > 0 ? values.length : 0;
  };

  const renderMultiSelectDropdown = (filterName, label, options) => {
    const selectedCount = getSelectedCount(filterName);
    const isOpen = openDropdown === filterName;

    return (
      <div className="filter-dropdown">
        <button
          className={`filter-button ${selectedCount > 0 ? 'active' : ''}`}
          onClick={() => toggleDropdown(filterName)}
        >
          {label}
          {selectedCount > 0 && <span className="filter-count">{selectedCount}</span>}
          <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
          <div className="dropdown-menu">
            {options.map((option) => (
              <label key={option} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={(filters[filterName] || []).includes(option)}
                  onChange={() => handleMultiSelect(filterName, option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="filter-panel">
      {renderMultiSelectDropdown('regions', 'Customer Region', filterOptions.regions)}
      {renderMultiSelectDropdown('genders', 'Gender', filterOptions.genders)}
      
      <div className="filter-dropdown">
        <button
          className={`filter-button ${filters.ageRange ? 'active' : ''}`}
          onClick={() => toggleDropdown('ageRange')}
        >
          Age Range
          {filters.ageRange && (filters.ageRange.min || filters.ageRange.max) && (
            <span className="filter-count">1</span>
          )}
          <span className="dropdown-arrow">{openDropdown === 'ageRange' ? '▲' : '▼'}</span>
        </button>
        {openDropdown === 'ageRange' && (
          <div className="dropdown-menu age-range-menu">
            <div className="age-range-inputs">
              <input
                type="number"
                placeholder="Min"
                min={filterOptions.ageRange.min}
                max={filterOptions.ageRange.max}
                value={filters.ageRange?.min || ''}
                onChange={(e) => handleAgeRangeChange('min', e.target.value)}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                min={filterOptions.ageRange.min}
                max={filterOptions.ageRange.max}
                value={filters.ageRange?.max || ''}
                onChange={(e) => handleAgeRangeChange('max', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {renderMultiSelectDropdown('categories', 'Product Category', filterOptions.categories)}
      {renderMultiSelectDropdown('tags', 'Tags', filterOptions.tags)}
      {renderMultiSelectDropdown('paymentMethods', 'Payment Method', filterOptions.paymentMethods)}

      <div className="filter-dropdown">
        <button
          className={`filter-button ${filters.dateRange ? 'active' : ''}`}
          onClick={() => toggleDropdown('dateRange')}
        >
          Date
          {filters.dateRange && (filters.dateRange.start || filters.dateRange.end) && (
            <span className="filter-count">1</span>
          )}
          <span className="dropdown-arrow">{openDropdown === 'dateRange' ? '▲' : '▼'}</span>
        </button>
        {openDropdown === 'dateRange' && (
          <div className="dropdown-menu date-range-menu">
            <div className="date-range-inputs">
              <input
                type="date"
                value={filters.dateRange?.start || ''}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
              />
              <span>to</span>
              <input
                type="date"
                value={filters.dateRange?.end || ''}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="sort-dropdown">
        <label className="sort-label">Sort by:</label>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="date-desc">Date (Newest First)</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="quantity-desc">Quantity (High to Low)</option>
          <option value="quantity-asc">Quantity (Low to High)</option>
          <option value="customerName-asc">Customer Name (A-Z)</option>
          <option value="customerName-desc">Customer Name (Z-A)</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;

