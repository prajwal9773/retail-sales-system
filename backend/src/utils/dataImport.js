import mongoose from 'mongoose';
import SalesTransaction from '../models/SalesTransaction.js';
import connectDB from './database.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Import data from JSON file
 * Usage: node src/utils/dataImport.js <path-to-json-file>
 */
const importData = async () => {
  try {
    await connectDB();
    
    const filePath = process.argv[2];
    if (!filePath) {
      console.error('Please provide the path to the JSON file');
      console.log('Usage: node src/utils/dataImport.js <path-to-json-file>');
      process.exit(1);
    }

    console.log('Reading file...');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    if (!Array.isArray(data)) {
      console.error('JSON file must contain an array of objects');
      process.exit(1);
    }

    console.log(`Found ${data.length} records`);
    console.log('Importing data...');

    // Transform data to match schema
    const transactions = data.map(item => ({
      transactionId: item.transactionId || item['Transaction ID'] || item['transaction_id'],
      date: item.date || item.Date || item['transaction_date'],
      customerId: item.customerId || item['Customer ID'] || item['customer_id'],
      customerName: item.customerName || item['Customer name'] || item['Customer Name'] || item['customer_name'],
      phoneNumber: item.phoneNumber || item['Phone Number'] || item['phone_number'],
      gender: item.gender || item.Gender,
      age: item.age || item.Age,
      customerRegion: item.customerRegion || item['Customer region'] || item['customer_region'],
      customerType: item.customerType || item['Customer Type'] || item['customer_type'],
      productId: item.productId || item['Product ID'] || item['product_id'],
      productName: item.productName || item['Product Name'] || item['product_name'],
      brand: item.brand || item.Brand,
      productCategory: item.productCategory || item['Product Category'] || item['product_category'],
      tags: Array.isArray(item.tags) ? item.tags : (item.Tags ? (Array.isArray(item.Tags) ? item.Tags : [item.Tags]) : []),
      quantity: item.quantity || item.Quantity || item['quantity'],
      pricePerUnit: item.pricePerUnit || item['Price per Unit'] || item['price_per_unit'],
      discountPercentage: item.discountPercentage || item['Discount Percentage'] || item['discount_percentage'],
      totalAmount: item.totalAmount || item['Total Amount'] || item['total_amount'],
      finalAmount: item.finalAmount || item['Final Amount'] || item['final_amount'],
      paymentMethod: item.paymentMethod || item['Payment Method'] || item['payment_method'],
      orderStatus: item.orderStatus || item['Order Status'] || item['order_status'],
      deliveryType: item.deliveryType || item['Delivery Type'] || item['delivery_type'],
      storeId: item.storeId || item['Store ID'] || item['store_id'],
      storeLocation: item.storeLocation || item['Store Location'] || item['store_location'],
      salespersonId: item.salespersonId || item['Salesperson ID'] || item['salesperson_id'],
      employeeName: item.employeeName || item['Employee name'] || item['Employee Name'] || item['employee_name'],
    }));

    // Insert in batches for better performance
    const batchSize = 1000;
    let imported = 0;

    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      await SalesTransaction.insertMany(batch, { ordered: false });
      imported += batch.length;
      console.log(`Imported ${imported}/${transactions.length} records...`);
    }

    console.log(`\nSuccessfully imported ${imported} records!`);
    console.log('Creating indexes...');
    
    // Indexes are already defined in the model, but we can ensure they exist
    await SalesTransaction.createIndexes();
    
    console.log('Indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error.message);
    process.exit(1);
  }
};

importData();

