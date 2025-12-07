import mongoose from 'mongoose';
import SalesTransaction from '../models/SalesTransaction.js';
import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Import CSV data directly to MongoDB Atlas
 * Usage: node src/utils/atlasImport.js <path-to-csv-file> [atlas-connection-string]
 * If connection string not provided, uses MONGODB_URI from .env file
 */
const importToAtlas = async () => {
  try {
    const filePath = process.argv[2];
    const atlasUri = process.argv[3] || process.env.MONGODB_URI;

    if (!filePath) {
      console.error('Please provide CSV file path');
      console.log('Usage: node src/utils/atlasImport.js <path-to-csv-file> [atlas-connection-string]');
      process.exit(1);
    }

    if (!atlasUri) {
      console.error('Please provide Atlas connection string or set MONGODB_URI in .env file');
      process.exit(1);
    }

    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(atlasUri);
    console.log('Connected to MongoDB Atlas!');

    // Clear existing data (optional)
    const existingCount = await SalesTransaction.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing records. Clearing collection...`);
      await SalesTransaction.deleteMany({});
      console.log('Collection cleared.');
    }

    console.log('Starting CSV import to Atlas...');
    console.log(`Reading file: ${filePath}`);

    const transactions = [];
    let rowCount = 0;
    const batchSize = 5000;

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
          try {
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

            if (transaction.transactionId) {
              transactions.push(transaction);
              rowCount++;

              if (transactions.length >= batchSize) {
                const batch = transactions.splice(0, batchSize);
                await SalesTransaction.insertMany(batch, { ordered: false });
                console.log(`Imported ${rowCount} records to Atlas...`);
              }
            }
          } catch (error) {
            console.error(`Error processing row ${rowCount + 1}:`, error.message);
          }
        })
        .on('end', async () => {
          try {
            if (transactions.length > 0) {
              await SalesTransaction.insertMany(transactions, { ordered: false });
              console.log(`Imported remaining ${transactions.length} records...`);
            }

            console.log(`\nTotal records processed: ${rowCount}`);
            console.log('Creating indexes...');
            
            await SalesTransaction.createIndexes();
            
            console.log('Indexes created successfully!');
            console.log('\n✅ CSV import to Atlas completed successfully!');
            
            const finalCount = await SalesTransaction.countDocuments();
            console.log(`Total records in Atlas database: ${finalCount}`);
            
            await mongoose.connection.close();
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
    console.error('Error importing to Atlas:', error.message);
    process.exit(1);
  }
};

importToAtlas();

