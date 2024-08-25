const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Unique constraint for emails
  password: { type: String, required: true }, // Required field for password
  favoriteStories: [ { type: mongoose.Schema.Types.ObjectId, ref: 'stories' }], // favoriteStories
  likedStories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'stories' }], // liked Stories
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }], // Followers
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }], // Followings
  createdAt: { type: Date, default: Date.now } // Auto-generated creation timestamp
});

module.exports = mongoose.model('users', userSchema);