const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'voter'],
    required: true
  },
  aadhar: {
    type: String,
    required: true,
    unique: true,
    match: /^[2-9]{1}[0-9]{11}$/  // ✅ Optional: Aadhar format validation (12 digits)
  }
});

module.exports = mongoose.model('User', userSchema);
