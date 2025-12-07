# Backend - Retail Sales Management System

## Overview
Backend API for the Retail Sales Management System built with Node.js, Express, and MongoDB.

## Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://localhost:27017/retail_sales
PORT=5000
```

3. Make sure MongoDB is running on your system.

4. Import the dataset into MongoDB:
   - Download the dataset from the provided Google Drive link
   - Convert to JSON format if needed (CSV can be converted using online tools or scripts)
   - Option 1: Use MongoDB Compass - Import the JSON file directly
   - Option 2: Use mongoimport command:
     ```bash
     mongoimport --db retail_sales --collection salestransactions --file dataset.json --jsonArray
     ```
   - Option 3: Use the provided import script (after converting to JSON):
     ```bash
     npm run import-data <path-to-json-file>
     ```
   - The collection should be named `salestransactions`

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### GET /api/sales/transactions
Get sales transactions with search, filters, sorting, and pagination.

**Query Parameters:**
- `search` (string): Search term for customer name or phone number
- `sortBy` (string): Sort criteria (date-desc, date-asc, quantity-desc, quantity-asc, customerName-asc, customerName-desc)
- `page` (number): Page number (default: 1)
- `pageSize` (number): Items per page (default: 10)
- `regions` (array): Filter by customer regions
- `genders` (array): Filter by genders
- `categories` (array): Filter by product categories
- `tags` (array): Filter by tags
- `paymentMethods` (array): Filter by payment methods
- `ageMin` (number): Minimum age
- `ageMax` (number): Maximum age
- `dateStart` (string): Start date (ISO format)
- `dateEnd` (string): End date (ISO format)

### GET /api/sales/filter-options
Get available filter options for dropdowns.

**Response:**
```json
{
  "success": true,
  "data": {
    "regions": ["North", "South", "East", "West"],
    "genders": ["Male", "Female"],
    "categories": ["Clothing", "Electronics", ...],
    "tags": ["tag1", "tag2", ...],
    "paymentMethods": ["Cash", "Card", ...],
    "ageRange": {
      "min": 18,
      "max": 80
    }
  }
}
```

