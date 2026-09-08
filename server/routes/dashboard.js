const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

router.get('/stats', auth, async (req, res) => {
  try {
    const employeeCount = await Employee.countDocuments();
    const leadCount = await Lead.countDocuments();
    
    res.json({
      totalEmployees: employeeCount,
      totalLeads: leadCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
