const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Register Voter Only
router.post('/register', async (req, res) => {
  const { username, password, aadhar } = req.body;

  try {
    if (!username || !password || !aadhar) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!/^[2-9]{1}[0-9]{11}$/.test(aadhar)) {
      return res.status(400).json({ message: 'Invalid Aadhar number format' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { aadhar }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Aadhar already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'voter',
      aadhar
    });

    await newUser.save();
    res.status(201).json({ message: 'Voter registered successfully' });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// ✅ Login Voter Only
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.role !== 'voter') {
      return res.status(403).json({ message: 'Only voters can login from this page' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Voter login successful',
      token,
      user: { username: user.username }
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// POST /api/admin/login
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

module.exports = router;
