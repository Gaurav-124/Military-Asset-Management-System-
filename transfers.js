const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['purchase', 'transfer', 'assignment', 'expend', 'login', 'logout', 'create', 'update', 'delete'],
    required: true
  },
  entity: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: false });

module.exports = mongoose.model('AuditLog', auditLogSchema);
