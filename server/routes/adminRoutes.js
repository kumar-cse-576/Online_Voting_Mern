const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Election = require('../models/Election'); // ✅ Add this line
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const { protectRoute, adminOnly } = require('../middleware/authMiddleware');



// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Admin login error:', err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// TEMPORARY TEST ROUTE
router.get('/test', (req, res) => {
  res.send('Admin route is working!');
});

// Register new admin
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ email, password: hashedPassword });
    const token = jwt.sign({ id: newAdmin._id, role: 'admin' }, 'secretkey');
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error registering admin' });
  }
});
// Create a new election
router.post('/create-election', verifyAdminToken, async (req, res) => {
  try {
    const { title, candidates } = req.body;

    if (!title || !candidates || candidates.length < 2) {
      return res.status(400).json({ message: 'Provide a title and at least two candidates.' });
    }

    const newElection = new Election({
      title,
      candidates: candidates.map(name => ({ name, votes: 0 })),
    });

    await newElection.save();
    res.status(201).json({ message: 'Election created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all elections
router.get('/elections', protectRoute, adminOnly, async (req, res) => {
  try {
    const elections = await Election.find();
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an election by ID
router.delete('/delete-election/:id', protectRoute, adminOnly, async (req, res) => {
  try {
    const id = req.params.id;
    await Election.findByIdAndDelete(id);
    res.json({ message: 'Election deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting election' });
  }
});
module.exports = router;
