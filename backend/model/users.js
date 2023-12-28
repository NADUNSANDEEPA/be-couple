const mongoose = require('mongoose');

// Define the schema for the form data
const formDataSchema = new mongoose.Schema({
  facebook_name: String,
  phone_number: String,
  gender: String,
  your_age: Number,
  your_job_field: String,
  do_not_show_number: Boolean,
}, { timestamps: true });

// Create a Mongoose model based on the schema
const FormDataModel = mongoose.model('users', formDataSchema);

module.exports = FormDataModel;
