require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/transfers', require('./routes/transfers'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/assets', require('./routes/assets'));

// Bases route
const Base = require('./models/Base');
const { protect } = require('./middleware/auth');
app.get('/api/bases', protect, async (req, res) => {
  const bases = await Base.find({ isActive: true });
  res.json({ success: true, data: bases });
});

// Audit logs route (admin only)
const AuditLog = require('./models/AuditLog');
const { authorize } = require('./middleware/auth');
app.get('/api/audit-logs', protect, authorize('admin'), async (req, res) => {
  const logs = await AuditLog.find()
    .populate('performedBy', 'name email role')
    .populate('base', 'name')
    .sort({ timestamp: -1 })
    .limit(100);
  res.json({ success: true, data: logs });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
