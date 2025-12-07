# Frontend - Retail Sales Management System

## Overview
Frontend application for the Retail Sales Management System built with React and Vite.

## Tech Stack
- React 18
- Vite
- Axios
- CSS3

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend directory (optional):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

4. Build for production:
```bash
npm run build
```

## Features

- **Search**: Full-text search across Customer Name and Phone Number (case-insensitive)
- **Filters**: Multi-select filters for Region, Gender, Category, Tags, Payment Method, Age Range, and Date Range
- **Sorting**: Sort by Date, Quantity, or Customer Name
- **Pagination**: 10 items per page with navigation controls
- **Summary Cards**: Display total units sold, total amount, and total discount

## Component Structure

- `SearchBar`: Search input with refresh button
- `FilterPanel`: Multi-select dropdowns and sorting controls
- `SummaryCards`: Summary statistics display
- `TransactionTable`: Data table with all transaction details
- `Pagination`: Page navigation controls


