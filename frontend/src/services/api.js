import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get sales transactions with filters, search, sort, and pagination
 */
export const getSalesTransactions = async (params) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    
    if (params.page) {
      queryParams.append('page', params.page);
    }
    
    if (params.pageSize) {
      queryParams.append('pageSize', params.pageSize);
    }
    
    // Add filter arrays
    if (params.filters?.regions?.length > 0) {
      params.filters.regions.forEach(region => queryParams.append('regions', region));
    }
    
    if (params.filters?.genders?.length > 0) {
      params.filters.genders.forEach(gender => queryParams.append('genders', gender));
    }
    
    if (params.filters?.categories?.length > 0) {
      params.filters.categories.forEach(category => queryParams.append('categories', category));
    }
    
    if (params.filters?.tags?.length > 0) {
      params.filters.tags.forEach(tag => queryParams.append('tags', tag));
    }
    
    if (params.filters?.paymentMethods?.length > 0) {
      params.filters.paymentMethods.forEach(method => queryParams.append('paymentMethods', method));
    }
    
    if (params.filters?.ageRange) {
      if (params.filters.ageRange.min !== undefined) {
        queryParams.append('ageMin', params.filters.ageRange.min);
      }
      if (params.filters.ageRange.max !== undefined) {
        queryParams.append('ageMax', params.filters.ageRange.max);
      }
    }
    
    if (params.filters?.dateRange) {
      if (params.filters.dateRange.start) {
        queryParams.append('dateStart', params.filters.dateRange.start);
      }
      if (params.filters.dateRange.end) {
        queryParams.append('dateEnd', params.filters.dateRange.end);
      }
    }
    
    const response = await api.get(`/sales/transactions?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching sales transactions');
  }
};

/**
 * Get filter options
 */
export const getFilterOptions = async () => {
  try {
    const response = await api.get('/sales/filter-options');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching filter options');
  }
};

