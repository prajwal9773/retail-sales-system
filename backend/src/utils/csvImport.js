import mongoose from 'mongoose';
import SalesTransaction from '../models/SalesTransaction.js';
import connectDB from './database.js';
import fs from 'fs';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Import data from CSV file
 * Usage: node src/utils/csvImport.js <path-to-csv-file>
 */
const importCSV = async () => {
  try {
    await connectDB();
    
    const filePath = process.argv[2];
    if (!filePath) {
      console.error('Please provide the path to the CSV file');
      console.log('Usage: node src/utils/csvImport.js <path-to-csv-file>');
      process.exit(1);
    }

    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }

    console.log('Starting CSV import...');
    console.log(`Reading file: ${filePath}`);

    // Clear existing data (optional - comment out if you want to keep existing data)
    const existingCount = await SalesTransaction.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing records. Clearing collection...`);
      await SalesTransaction.deleteMany({});
      console.log('Collection cleared.');
    }

    const transactions = [];
    let rowCount = 0;
    const batchSize = 5000; // Process in batches of 5000

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
          try {
            // Parse and transform CSV row to match schema
            const transaction = {
              transactionId: row['Transaction ID'] || row['transactionId'] || null,
              date: row['Date'] || row['date'] ? new Date(row['Date'] || row['date']) : null,
              customerId: row['Customer ID'] || row['customerId'] || null,
              customerName: row['Customer Name'] || row['customerName'] || null,
              phoneNumber: row['Phone Number'] || row['phoneNumber'] || null,
              gender: row['Gender'] || row['gender'] || null,
              age: row['Age'] || row['age'] ? parseInt(row['Age'] || row['age']) : null,
              customerRegion: row['Customer Region'] || row['customerRegion'] || null,
              customerType: row['Customer Type'] || row['customerType'] || null,
              productId: row['Product ID'] || row['productId'] || null,
              productName: row['Product Name'] || row['productName'] || null,
              brand: row['Brand'] || row['brand'] || null,
              productCategory: row['Product Category'] || row['productCategory'] || null,
              tags: row['Tags'] || row['tags'] 
                ? (row['Tags'] || row['tags']).split(',').map(tag => tag.trim()).filter(Boolean)
                : [],
              quantity: row['Quantity'] || row['quantity'] ? parseInt(row['Quantity'] || row['quantity']) : 0,
              pricePerUnit: row['Price per Unit'] || row['pricePerUnit'] ? parseFloat(row['Price per Unit'] || row['pricePerUnit']) : 0,
              discountPercentage: row['Discount Percentage'] || row['discountPercentage'] ? parseFloat(row['Discount Percentage'] || row['discountPercentage']) : 0,
              totalAmount: row['Total Amount'] || row['totalAmount'] ? parseFloat(row['Total Amount'] || row['totalAmount']) : 0,
              finalAmount: row['Final Amount'] || row['finalAmount'] ? parseFloat(row['Final Amount'] || row['finalAmount']) : 0,
              paymentMethod: row['Payment Method'] || row['paymentMethod'] || null,
              orderStatus: row['Order Status'] || row['orderStatus'] || null,
              deliveryType: row['Delivery Type'] || row['deliveryType'] || null,
              storeId: row['Store ID'] || row['storeId'] || null,
              storeLocation: row['Store Location'] || row['storeLocation'] || null,
              salespersonId: row['Salesperson ID'] || row['salespersonId'] || null,
              employeeName: row['Employee Name'] || row['employeeName'] || null,
            };

            // Only add if transactionId exists
            if (transaction.transactionId) {
              transactions.push(transaction);
              rowCount++;

              // Insert in batches
              if (transactions.length >= batchSize) {
                const batch = transactions.splice(0, batchSize);
                await SalesTransaction.insertMany(batch, { ordered: false });
                console.log(`Imported ${rowCount} records...`);
              }
            }
          } catch (error) {
            console.error(`Error processing row ${rowCount + 1}:`, error.message);
          }
        })
        .on('end', async () => {
          try {
            // Insert remaining transactions
            if (transactions.length > 0) {
              await SalesTransaction.insertMany(transactions, { ordered: false });
              console.log(`Imported remaining ${transactions.length} records...`);
            }

            console.log(`\nTotal records processed: ${rowCount}`);
            console.log('Creating indexes...');
            
            // Ensure indexes are created
            await SalesTransaction.createIndexes();
            
            console.log('Indexes created successfully!');
            console.log('\n✅ CSV import completed successfully!');
            
            const finalCount = await SalesTransaction.countDocuments();
            console.log(`Total records in database: ${finalCount}`);
            
            resolve();
            process.exit(0);
          } catch (error) {
            console.error('Error during final insert:', error.message);
            reject(error);
            process.exit(1);
          }
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error.message);
          reject(error);
          process.exit(1);
        });
    });
  } catch (error) {
    console.error('Error importing CSV:', error.message);
    process.exit(1);
  }
};

importCSV();

