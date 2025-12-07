import mongoose from 'mongoose';

const salesTransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    index: true,
  },
  date: {
    type: Date,
    index: true,
  },
  customerId: String,
  customerName: {
    type: String,
  },
  phoneNumber: {
    type: String,
    index: true,
  },
  gender: {
    type: String,
    index: true,
  },
  age: {
    type: Number,
    index: true,
  },
  customerRegion: {
    type: String,
    index: true,
  },
  customerType: String,
  productId: String,
  productName: String,
  brand: String,
  productCategory: {
    type: String,
    index: true,
  },
  tags: [{
    type: String,
    index: true,
  }],
  quantity: {
    type: Number,
    index: true,
  },
  pricePerUnit: Number,
  discountPercentage: Number,
  totalAmount: Number,
  finalAmount: Number,
  paymentMethod: {
    type: String,
    index: true,
  },
  orderStatus: String,
  deliveryType: String,
  storeId: String,
  storeLocation: String,
  salespersonId: String,
  employeeName: String,
}, {
  timestamps: false,
});

// Compound indexes for common query patterns
salesTransactionSchema.index({ customerName: 'text', phoneNumber: 'text' });
salesTransactionSchema.index({ date: -1 });
salesTransactionSchema.index({ customerName: 1 });
salesTransactionSchema.index({ quantity: -1 });

const SalesTransaction = mongoose.model('SalesTransaction', salesTransactionSchema);

export default SalesTransaction;

