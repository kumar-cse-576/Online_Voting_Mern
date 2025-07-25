const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/admin', require('./routes/adminRoutes'));
// THIS must be present
// ✅ Register auth route

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vote', require('./routes/voteRoutes_backup'));
app.use('/api/vote', require('./routes/voteRoutes'));



// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/votingdb")
  .then(() => console.log('✅ Connected to MongoDB locally'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
