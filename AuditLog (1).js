const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  fromBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  toBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  equipmentType: {
    type: String,
    enum: ['vehicle', 'weapon', 'ammunition', 'equipment'],
    required: true
  },
  quantity: { type: Number, required: true, min: 1 },
  transferDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'in_transit', 'completed', 'cancelled'],
    default: 'completed'
  },
  notes: { type: String },
  authorizedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transfer', transferSchema);
