const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true, maxLength:4000 }, // Required comment content
  story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' }, // Reference to Story model
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  createdAt: { type: Date, default: Date.now } // Auto-generated creation timestamp
});

module.exports = mongoose.model('comments', commentSchema);