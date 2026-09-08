const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNo: { type: String, required: true },
  designation: { type: String, required: true },
  gender: { type: String, required: true, enum: ['M', 'F', 'Other'] },
  course: { type: [String], required: true },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
