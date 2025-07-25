const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/authMiddleware'); // ✅ FIXED

// 🔐 Protected test route
router.get('/secure-data', protectRoute, (req, res) => {
  res.json({
    message: '✅ This is protected data',
    user: req.user  // Contains user info from the token
  });
});

module.exports = router;
