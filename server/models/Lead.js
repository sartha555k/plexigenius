const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  leadName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Closed'],
    default: 'New'
  },
  assignedEmployee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee',
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
