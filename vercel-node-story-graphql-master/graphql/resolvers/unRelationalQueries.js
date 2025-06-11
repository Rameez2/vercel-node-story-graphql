const User = require('../../db/models/userSchema'); // Import User model
const Story = require('../../db/models/storySchema'); // Import Story model
const Comment = require('../../db/models/commentSchema'); // Import Comment model

const unRelationalQueries = {
  Query: {
    users: async () => await User.find(),
    
    // Fetch the current user from the context
    currentuser: async (parent, args, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const currentUser = await User.findById(user.userId);
      if (!currentUser) throw new Error('User not found');
      return currentUser;
    },

    // Fetch the current user from the context
    user: async (parent, {_id},) => {
      const user = await User.findById(_id);
      if (!user) throw new Error('User not found');
      return user;
    },
    
    stories: async (parent, { limit = 10, offset = 0 }) => {
      return await Story.find()
        .skip(offset)
        .limit(limit);
    },
    
    mystories: async (parent, { _id },{user}) => {
            
      if (!user) throw new Error('Authentication required');
      // Find and return stories where the author matches the current user
      return await Story.find({ author: user.userId });
    },
    story: async (parent, { _id }) => {
      try {
        // Fetch the story from the database
        const story = await Story.findById(_id);
        
        // Check if the story exists
        if (!story) throw new Error('Story not found');
        
        // Return the fetched story
        return story;
      } catch (error) {
        console.error('Error fetching story:', error);
        throw new Error('Error fetching story');
      }
    },
    
    comments: async () => await Comment.find(),
    
    comment: async (parent, { _id }) => {
      const comment = await Comment.findById(_id);
      if (!comment) throw new Error('Comment not found');
      return comment;
    },
    favoriteStories: async (parent, args, { user }) => {
      
      if (!user) {
        throw new Error('Authentication required');
      }

      // Fetch the user from the database
      const currentUser = await User.findById(user.userId).populate('favoriteStories');
      
      if (!currentUser) {
        throw new Error('User not found');
      }

      // Return the list of favorite stories
      return currentUser.favoriteStories;
    },
    likedStories: async (parent, args, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const currentUser = await User.findById(user.userId).populate('likedStories');
      if (!currentUser) throw new Error('User not found');
      
      return currentUser.likedStories;
    },
  }
};

module.exports = unRelationalQueries;
