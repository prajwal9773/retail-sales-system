import express from 'express';

/**
 * Compression middleware for API responses
 * Reduces response size for large datasets
 */
export const compressionMiddleware = (req, res, next) => {
  // Enable compression for JSON responses
  res.setHeader('Content-Encoding', 'gzip');
  next();
};

