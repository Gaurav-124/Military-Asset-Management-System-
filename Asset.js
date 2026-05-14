const AuditLog = require('../models/AuditLog');

const auditLog = async (action, entity, entityId, performedBy, base, details, ipAddress) => {
  try {
    await AuditLog.create({ action, entity, entityId, performedBy, base, details, ipAddress });
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};

module.exports = auditLog;
