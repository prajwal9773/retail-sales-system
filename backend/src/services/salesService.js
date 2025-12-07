import SalesTransaction from '../models/SalesTransaction.js';
import cache from '../utils/cache.js';

/**
 * Build filter query based on provided filters
 */
const buildFilterQuery = (filters) => {
  const query = {};

  if (filters.regions && filters.regions.length > 0) {
    query.customerRegion = { $in: filters.regions };
  }

  if (filters.genders && filters.genders.length > 0) {
    query.gender = { $in: filters.genders };
  }

  if (filters.ageRange) {
    if (filters.ageRange.min !== undefined && filters.ageRange.max !== undefined) {
      query.age = { $gte: filters.ageRange.min, $lte: filters.ageRange.max };
    } else if (filters.ageRange.min !== undefined) {
      query.age = { $gte: filters.ageRange.min };
    } else if (filters.ageRange.max !== undefined) {
      query.age = { $lte: filters.ageRange.max };
    }
  }

  if (filters.categories && filters.categories.length > 0) {
    query.productCategory = { $in: filters.categories };
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  if (filters.paymentMethods && filters.paymentMethods.length > 0) {
    query.paymentMethod = { $in: filters.paymentMethods };
  }

  if (filters.dateRange) {
    query.date = {};
    if (filters.dateRange.start) {
      query.date.$gte = new Date(filters.dateRange.start);
    }
    if (filters.dateRange.end) {
      query.date.$lte = new Date(filters.dateRange.end);
    }
  }

  return query;
};

/**
 * Build search query for customer name and phone number
 */
const buildSearchQuery = (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return {};
  }

  const trimmedSearch = searchTerm.trim();
  return {
    $or: [
      { customerName: { $regex: trimmedSearch, $options: 'i' } },
      { phoneNumber: { $regex: trimmedSearch, $options: 'i' } },
    ],
  };
};

/**
 * Build sort object based on sort criteria
 */
const buildSortObject = (sortBy) => {
  switch (sortBy) {
    case 'date-desc':
      return { date: -1 };
    case 'date-asc':
      return { date: 1 };
    case 'quantity-desc':
      return { quantity: -1 };
    case 'quantity-asc':
      return { quantity: 1 };
    case 'customerName-asc':
      return { customerName: 1 };
    case 'customerName-desc':
      return { customerName: -1 };
    default:
      return { date: -1 }; // Default: newest first
  }
};

/**
 * Get sales transactions with search, filter, sort, and pagination
 * Optimized for large datasets with caching and efficient queries
 */
export const getSalesTransactions = async (params) => {
  try {
    const {
      search = '',
      filters = {},
      sortBy = 'date-desc',
      page = 1,
      pageSize = 10,
    } = params;

    // Generate cache key
    const cacheKey = cache.generateKey('transactions', {
      search,
      filters,
      sortBy,
      page,
      pageSize,
    });

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Build combined query
    const searchQuery = buildSearchQuery(search);
    const filterQuery = buildFilterQuery(filters);
    const combinedQuery = { ...searchQuery, ...filterQuery };

    // Build sort object
    const sortObject = buildSortObject(sortBy);

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Optimize: Use cursor-based pagination hint for better performance on large offsets
    // For very large skip values, consider using cursor-based pagination instead
    const maxSkip = 10000; // MongoDB skip becomes slow after this
    const useCursorPagination = skip > maxSkip;

    let transactions, totalCount;

    if (useCursorPagination) {
      // For large offsets, use a more efficient approach
      // Get the last transaction ID from previous page (would need to be passed)
      // For now, fall back to skip but with optimization hints
      [transactions, totalCount] = await Promise.all([
        SalesTransaction.find(combinedQuery)
          .sort(sortObject)
          .skip(skip)
          .limit(pageSize)
          .lean()
          .hint(sortObject), // Use index hint
        SalesTransaction.countDocuments(combinedQuery),
      ]);
    } else {
      // Standard pagination for smaller offsets
      [transactions, totalCount] = await Promise.all([
        SalesTransaction.find(combinedQuery)
          .sort(sortObject)
          .skip(skip)
          .limit(pageSize)
          .lean()
          .hint(sortObject), // Use index hint for better performance
        SalesTransaction.countDocuments(combinedQuery),
      ]);
    }

    // Calculate summary statistics
    const summaryQuery = { ...filterQuery };
    if (search) {
      Object.assign(summaryQuery, searchQuery);
    }

    const summaryData = await SalesTransaction.aggregate([
      { $match: summaryQuery },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$quantity' },
          totalAmount: { $sum: '$totalAmount' },
          totalDiscount: { $sum: { $subtract: ['$totalAmount', '$finalAmount'] } },
        },
      },
    ]);

    const summary = summaryData[0] || {
      totalUnits: 0,
      totalAmount: 0,
      totalDiscount: 0,
    };

    const result = {
      transactions,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
      summary: {
        totalUnitsSold: summary.totalUnits || 0,
        totalAmount: summary.totalAmount || 0,
        totalDiscount: summary.totalDiscount || 0,
      },
    };

    // Cache result (shorter TTL for frequently changing data)
    cache.set(cacheKey, result, 2 * 60 * 1000); // 2 minutes

    return result;
  } catch (error) {
    throw new Error(`Error fetching sales transactions: ${error.message}`);
  }
};

/**
 * Get distinct values for filter options
 * Cached for better performance as these don't change frequently
 */
export const getFilterOptions = async () => {
  try {
    const cacheKey = 'filter-options';
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Use parallel queries for better performance
    const [regions, genders, categories, tags, paymentMethods, ageRange] = await Promise.all([
      SalesTransaction.distinct('customerRegion'),
      SalesTransaction.distinct('gender'),
      SalesTransaction.distinct('productCategory'),
      SalesTransaction.distinct('tags'),
      SalesTransaction.distinct('paymentMethod'),
      SalesTransaction.aggregate([
        {
          $group: {
            _id: null,
            minAge: { $min: '$age' },
            maxAge: { $max: '$age' },
          },
        },
      ]),
    ]);

    const ageData = ageRange[0] || { minAge: 0, maxAge: 100 };

    const result = {
      regions: regions.filter(Boolean).sort(),
      genders: genders.filter(Boolean).sort(),
      categories: categories.filter(Boolean).sort(),
      tags: tags.filter(Boolean).sort(),
      paymentMethods: paymentMethods.filter(Boolean).sort(),
      ageRange: {
        min: ageData.minAge || 0,
        max: ageData.maxAge || 100,
      },
    };

    // Cache filter options (longer TTL as they change less frequently)
    cache.set(cacheKey, result, 10 * 60 * 1000); // 10 minutes

    return result;
  } catch (error) {
    throw new Error(`Error fetching filter options: ${error.message}`);
  }
};

