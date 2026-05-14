const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  equipmentType: {
    type: String,
    enum: ['vehicle', 'weapon', 'ammunition', 'equipment'],
    required: true
  },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  openingBalance: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  unit: { type: String, default: 'units' },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
