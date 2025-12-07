import * as salesService from '../services/salesService.js';

/**
 * Get sales transactions with search, filters, sorting, and pagination
 */
export const getSalesTransactions = async (req, res) => {
  try {
    const {
      search = '',
      sortBy = 'date-desc',
      page = 1,
      pageSize = 10,
    } = req.query;

    // Parse filters from query string
    const filters = {
      regions: req.query.regions ? (Array.isArray(req.query.regions) ? req.query.regions : [req.query.regions]) : [],
      genders: req.query.genders ? (Array.isArray(req.query.genders) ? req.query.genders : [req.query.genders]) : [],
      categories: req.query.categories ? (Array.isArray(req.query.categories) ? req.query.categories : [req.query.categories]) : [],
      tags: req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]) : [],
      paymentMethods: req.query.paymentMethods ? (Array.isArray(req.query.paymentMethods) ? req.query.paymentMethods : [req.query.paymentMethods]) : [],
      ageRange: req.query.ageMin || req.query.ageMax ? {
        min: req.query.ageMin ? parseInt(req.query.ageMin) : undefined,
        max: req.query.ageMax ? parseInt(req.query.ageMax) : undefined,
      } : null,
      dateRange: req.query.dateStart || req.query.dateEnd ? {
        start: req.query.dateStart || null,
        end: req.query.dateEnd || null,
      } : null,
    };

    // Remove empty filter arrays
    Object.keys(filters).forEach(key => {
      if (Array.isArray(filters[key]) && filters[key].length === 0) {
        delete filters[key];
      } else if (filters[key] === null) {
        delete filters[key];
      }
    });

    const result = await salesService.getSalesTransactions({
      search,
      filters,
      sortBy,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching sales transactions',
    });
  }
};

/**
 * Get filter options for dropdowns
 */
export const getFilterOptions = async (req, res) => {
  try {
    const options = await salesService.getFilterOptions();
    res.json({
      success: true,
      data: options,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching filter options',
    });
  }
};

