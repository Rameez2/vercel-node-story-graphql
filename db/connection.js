const mongoose = require('mongoose');

module.exports = (async function connectDB() {
  const uri = process.env.MONGO_URI; // MongoDB URI from environment variables
  try {
    // Connect using default Mongoose options (as of Mongoose v6+)
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully'); // Success message
  } catch (err) {
    console.error('MongoDB connection error:', err); // Error handling
    process.exit(1); // Exit process with failure code
  }
});
