const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  equipmentType: {
    type: String,
    enum: ['vehicle', 'weapon', 'ammunition', 'equipment'],
    required: true
  },
  assignedTo: { type: String, required: true },
  personnelId: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  assignmentDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  status: {
    type: String,
    enum: ['active', 'returned', 'expended'],
    default: 'active'
  },
  isExpended: { type: Boolean, default: false },
  expendedQuantity: { type: Number, default: 0 },
  notes: { type: String },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
