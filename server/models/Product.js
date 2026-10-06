const mongoose = require('mongoose');

const technicalSpecSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true
    },
    discipline: {
      type: String,
      required: [true, 'Discipline (e.g., Hockey, Padel, Gear) is required'],
      enum: ['Hockey', 'Padel', 'Gear'],
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number']
    },
    currency: {
      type: String,
      default: 'EUR',
      trim: true
    },
    carbonPercentage: {
      type: Number,
      min: [0, 'Carbon percentage cannot be negative'],
      max: [100, 'Carbon percentage cannot exceed 100%'],
      default: 0
    },
    bowType: {
      type: String,
      trim: true,
      default: 'N/A' // Relevant for Hockey (e.g. Low Bow, Pro Bow) or Padel shapes (e.g. Diamond, Tear Drop)
    },
    weight: {
      type: String,
      trim: true,
      default: 'Standard'
    },
    images: {
      type: [String],
      required: [true, 'Product image list is required'],
      default: []
    },
    inventoryCount: {
      type: Number,
      required: true,
      default: 10
    },
    technicalSpecs: {
      type: [technicalSpecSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Indexing for faster catalog searching & filtering
productSchema.index({ discipline: 1 });
productSchema.index({ price: 1 });
productSchema.index({ sku: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);