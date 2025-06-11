const User = require("../../../db/models/userSchema");
const Comment = require("../../../db/models/commentSchema");
const Story = require("../../../db/models/storySchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userMutations = {
  login: async (parent, { email, password }) => {
    const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.TOKEN_EXPIRE_TIME }
       );

      return {
        token,
        user
      };
  },
  createUser: async (parent, { username, email, password }) => {
    try {
      
      // Check if the username or email already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        throw new Error("Username or email already in use.");
      }
  
      // Hash the password
      const hashPassword = await bcrypt.hash(password, 10);
  
      // Create and save the new user
      const user = new User({ username, email, password: hashPassword });
      await user.save();
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.TOKEN_EXPIRE_TIME }
       );

    // Return the user along with the token
    return { token, user };
    } catch (error) {
      // console.error("Error creating user:", error);
      throw new Error(error.message);
    }
  },
  updateUser: async (parent, {username, password,currentPassword },{user}) => {
    
    if (!user) {
      throw new Error('Authentication required');
    }
  
    // Find the user to check current password
    const existingUser = await User.findById(user.userId);
    if (!existingUser) {
      throw new Error('User not found');
    }
  
    // Verify current password
    let currentUser = await User.findById(user.userId);
    
    // Verify the current password if provided
    if (currentPassword && !await bcrypt.compare(currentPassword, currentUser.password)) {
      throw new Error('Current password is incorrect');
    }
  
    // Prepare the update object
    const updateData = {};
    if (username) updateData.username = username;
    if (password) {
      // Hash the new password before saving
      updateData.password = await bcrypt.hash(password, 10);
    }
  
    // Update the user and return the updated document
    return await User.findByIdAndUpdate(user.userId, updateData, { new: true });
  },
  deleteUser: async (parent, { _id },{user}) => {
    if (!user) {
      throw new Error('Authentication required');
  }

  if (_id !== user.userId) {
      throw new Error('You do not have permission to delete this account');
  }

  // Delete all stories by this user
  const userStories = await Story.find({ author: _id });
  const storyIds = userStories.map(story => story._id);
  await Story.deleteMany({ author: _id });

  // Delete all comments associated with those stories
  await Comment.deleteMany({ story: { $in: storyIds } });

  // Finally, delete the user
  return await User.findByIdAndDelete(_id);
  },
  addStoryToFavorites: async (parent, { _id }, { user }) => {
    
    if (!user) {
      throw new Error('Authentication required');
    }
  
    // Find the story
    const story = await Story.findById(_id);
    if (!story) {
      throw new Error('Story not found');
    }
  
    // Find the user and add the story ID to their favourites
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { $addToSet: { favoriteStories: _id } }, // Add the story ID to favourites array, only if it’s not already present
      { new: true } // Return the updated document
    );
  
    // Optionally, return the updated user or just a success message
    return story;
  },
  removeStoryFromFavorites: async (parent, { _id }, { user }) => {
    // Ensure the user is authenticated
    if (!user) {
      throw new Error('Authentication required');
    }

    // Find the current user
    const currentUser = await User.findById(user.userId);
    if (!currentUser) {
      throw new Error('User not found');
    }

    // Remove the story from the user's favourites
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { $pull: { favoriteStories: _id } }, // Remove story ID from favourites array
      { new: true } // Return the updated user document
    );

    // If the story was not found in the user's favourites
    if (!updatedUser) {
      throw new Error('Story not found in favourites');
    }

    return updatedUser;
  },
  addFollower: async (_, { followerId }, { user }) => {
    if (!user) {
      throw new AuthenticationError('Authentication required');
    }

    const userId = user.userId; // Access user ID from the context
    // Check if the current user is trying to follow themselves
    if (userId === followerId) {
      throw new UserInputError('You cannot follow yourself');
    }
    // Find both the user who is being followed and the follower
    const userToFollow = await User.findById(followerId);
    const follower = await User.findById(userId);

    if (!userToFollow || !follower) {
      throw new UserInputError('User not found');
    }

    // Update the user's followers array to add the followerId if not already present
    await User.updateOne(
      { _id: followerId },
      { $addToSet: { followers: userId } }
    );

    // Update the follower's following array to add the userId if not already present
    await User.updateOne(
      { _id: userId },
      { $addToSet: { followings: followerId } }
    );

    return userToFollow;
  },
  removeFollower:async (_, { followerId }, { user }) => {
    if (!user) {
      throw new Error('Authentication required');
    }
  
    // Find the current user and the user to be unfollowed
    const currentUserId = user.userId;
  
    // Remove the user to unfollow from the current user's followings list
    await User.updateOne(
      { _id: currentUserId },
      { $pull: { followings: followerId } }
    );
  
    // Remove the current user from the user to unfollow's followers list
    await User.updateOne(
      { _id: followerId },
      { $pull: { followers: currentUserId } }
    );
  
    // Optionally, return the updated user
    const updatedCurrentUser = await User.findById(currentUserId);
    return updatedCurrentUser;
  },
  
}

module.exports = userMutations;