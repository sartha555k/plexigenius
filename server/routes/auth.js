const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/setup', async (req, res) => {
  try {
    const existing = await User.findOne({ userName: 'admin' });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = new User({ userName: 'admin', password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Admin user created (admin/admin123)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, userName: user.userName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
