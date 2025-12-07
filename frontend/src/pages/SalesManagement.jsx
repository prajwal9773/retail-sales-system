import React, { useState, useEffect, useCallback } from 'react';
import { useSalesData } from '../hooks/useSalesData';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import SummaryCards from '../components/SummaryCards';
import TransactionTable from '../components/TransactionTable';
import Pagination from '../components/Pagination';
import '../styles/SalesManagement.css';

const SalesManagement = () => {
  const {
    transactions,
    loading,
    error,
    pagination,
    summary,
    filterOptions,
    fetchTransactions,
    setPagination,
  } = useSalesData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    paymentMethods: [],
    ageRange: null,
    dateRange: null,
  });
  const [sortBy, setSortBy] = useState('date-desc');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initial fetch
  useEffect(() => {
    if (isInitialLoad) {
      fetchTransactions({
        search: searchTerm,
        filters,
        sortBy,
      });
      setIsInitialLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search and filter changes
  useEffect(() => {
    if (isInitialLoad) return;

    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      fetchTransactions({
        search: searchTerm,
        filters,
        sortBy,
        page: 1,
      });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filters, sortBy]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchTransactions({
      search: searchTerm,
      filters,
      sortBy,
      page,
    });
  };

  const handleRefresh = () => {
    fetchTransactions({
      search: searchTerm,
      filters,
      sortBy,
    });
  };

  return (
    <div className="sales-management-wrapper">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`sales-management ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sales-management-header">
          <div className="header-left">
            <button 
              className="menu-toggle" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              ☰
            </button>
            <h1 className="page-title">Sales Management System</h1>
          </div>
          <div className="header-right">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onRefresh={handleRefresh}
            />
            <div className="user-avatar">R</div>
          </div>
        </div>

      <FilterPanel
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        sortBy={sortBy}
      />

      <SummaryCards summary={summary} />

      {error && <div className="error-message">Error: {error}</div>}

      <TransactionTable transactions={transactions} loading={loading} />

        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default SalesManagement;

