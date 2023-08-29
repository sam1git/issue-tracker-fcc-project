const mongoose = require('mongoose');

let issueSchema = new mongoose.Schema({
  issue_title: String,
  issue_text: String,
  created_on: {
    type: Date,
    immutable: true,
    default: () => new Date().toISOString()
  },
  updated_on: {
    type: Date,
    default: () => new Date().toISOString()
  },
  created_by: String,
  assigned_to: {type: String, default: ""},
  open: {
    type: Boolean,
    default: true
  },
  status_text: {type: String, default: ""}
})

module.exports = issueSchema;