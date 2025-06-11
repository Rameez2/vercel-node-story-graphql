const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true }, // Required title
  content: { type: String, required: true }, // Required content
  moral: { type: String }, // Optional moral
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model with required constraint
  likes: { type: Number, default: 0 }, // Integer count of likes
  createdAt: { type: Date, default: Date.now } // Auto-generated creation timestamp
});

module.exports = mongoose.model('stories', storySchema);