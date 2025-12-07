import { useState, useEffect, useCallback } from 'react';
import { getSalesTransactions, getFilterOptions } from '../services/api';

export const useSalesData = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [summary, setSummary] = useState({
    totalUnitsSold: 0,
    totalAmount: 0,
    totalDiscount: 0,
  });
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    paymentMethods: [],
    ageRange: { min: 0, max: 100 },
  });

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await getFilterOptions();
        if (response.success) {
          setFilterOptions(response.data);
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const requestParams = {
        page: params.page || pagination.currentPage,
        pageSize: params.pageSize || pagination.pageSize,
        ...params,
      };
      
      const response = await getSalesTransactions(requestParams);
      
      if (response.success) {
        setTransactions(response.data.transactions);
        setPagination(response.data.pagination);
        setSummary(response.data.summary);
      }
    } catch (err) {
      setError(err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize]);

  return {
    transactions,
    loading,
    error,
    pagination,
    summary,
    filterOptions,
    fetchTransactions,
    setPagination,
  };
};

