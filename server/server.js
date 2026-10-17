const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// ✅ Security headers (helmet)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow /uploads images to load in browser
}));

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/complaints',   require('./routes/complaints'));
app.use('/api/contact',      require('./routes/contact'));
app.use('/api/gallery',      require('./routes/gallery'));
app.use('/api/locations',    require('./routes/locations'));
app.use('/api/newsletters',  require('./routes/newsletters'));
app.use('/api/stats',        require('./routes/stats'));
app.use('/api/carousel',     require('./routes/carousel'));
app.use('/api/news',         require('./routes/news'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Baladiye API is running' }));

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🏛️ Baladiye API running on http://localhost:${PORT}`));
