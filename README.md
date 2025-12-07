# Retail Sales Management System

## Overview
A full-stack MERN application for managing and analyzing retail sales data. The system provides advanced search, filtering, sorting, and pagination capabilities to handle large-scale sales datasets (300MB+). Built with clean architecture principles and optimized for performance.

## Tech Stack

### Backend
- Node.js with ES6 modules
- Express.js
- MongoDB with Mongoose
- CORS

### Frontend
- React 18
- Vite
- Axios
- CSS3

## Search Implementation Summary
- **Fields**: Customer Name and Phone Number
- **Method**: Case-insensitive regex search using MongoDB text indexes
- **Performance**: Debounced input (300ms) on frontend to reduce API calls
- **Backend**: Combined `$or` query with regex matching on indexed fields

## Filter Implementation Summary
- **Types**: Multi-select dropdowns for Region, Gender, Category, Tags, Payment Method; Range inputs for Age and Date
- **Method**: MongoDB `$in` operators for multi-select, range queries for numeric/date fields
- **Combination**: All filters work independently and in combination (AND logic)
- **State**: Filters preserved during pagination and sorting
- **Performance**: Indexed fields ensure fast query execution

## Sorting Implementation Summary
- **Options**: Date (Newest/Oldest First), Quantity (High to Low/Low to High), Customer Name (A-Z/Z-A)
- **Method**: MongoDB sort on indexed fields
- **State**: Sort preference preserved during filtering and pagination
- **Default**: Date (Newest First)

## Pagination Implementation Summary
- **Page Size**: Fixed at 10 items per page
- **Method**: MongoDB `skip()` and `limit()` with total count calculation
- **Navigation**: Previous/Next buttons and page number display with ellipsis
- **State**: Current page preserved; resets to page 1 on filter/search change
- **Performance**: Only fetches required page of data

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/retail_sales
PORT=5000
```

4. Start MongoDB service (if not running):
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

5. Import the dataset:
   - Download the dataset from the provided Google Drive link
   - Use MongoDB Compass or `mongoimport` to import the data
   - Collection name should be `salestransactions`
   - Example with mongoimport:
   ```bash
   mongoimport --db retail_sales --collection salestransactions --file dataset.json --jsonArray
   ```

6. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, defaults to localhost:5000):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Production Build

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. The built files will be in `frontend/dist/`

## Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── README.md
└── docs/
    └── architecture.md
```

## API Endpoints

### GET /api/sales/transactions
Get sales transactions with search, filters, sorting, and pagination.

**Query Parameters:**
- `search` (string): Search term
- `sortBy` (string): Sort criteria
- `page` (number): Page number
- `pageSize` (number): Items per page
- `regions` (array): Filter by regions
- `genders` (array): Filter by genders
- `categories` (array): Filter by categories
- `tags` (array): Filter by tags
- `paymentMethods` (array): Filter by payment methods
- `ageMin` (number): Minimum age
- `ageMax` (number): Maximum age
- `dateStart` (string): Start date (ISO format)
- `dateEnd` (string): End date (ISO format)

### GET /api/sales/filter-options
Get available filter options for dropdowns.

## Features

- ✅ Full-text search (Customer Name, Phone Number)
- ✅ Multi-select filters (Region, Gender, Category, Tags, Payment Method)
- ✅ Range filters (Age, Date)
- ✅ Sorting (Date, Quantity, Customer Name)
- ✅ Pagination (10 items per page)
- ✅ Summary statistics (Total units, Total amount, Total discount)
- ✅ Responsive design
- ✅ Loading and error states
- ✅ State preservation across operations

## Architecture Document
See `/docs/architecture.md` for detailed architecture documentation.

## Notes

- All code is manually written (no auto-generated tools)
- Clean separation of concerns
- Modular and maintainable code structure
- Optimized for large datasets (300MB+)
- Follows professional coding standards

