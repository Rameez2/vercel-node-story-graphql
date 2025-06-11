const User = require('../../db/models/userSchema'); // Import User model
const Story = require('../../db/models/storySchema'); // Import Story model
const Comment = require('../../db/models/commentSchema'); // Import Comment model

const relationalQueries = {
  Story: {
    author: async (parent) => {
      try {
        
        const user = await User.findById({_id:parent.author});

        return user;
      } catch (error) {
        console.log(error);

        throw new Error('Error fetching author');
      }
    },
    comments: async (parent) => {
      try {
        return await Comment.find({ story: parent._id });
      } catch (error) {
        
        console.error('Error fetching comments:', error.message);
        throw new Error('Error fetching comments');
      }
    },
  },
  Comment: {
    story: async (parent) => {
      try {
        const story = await Story.findById(parent.story);
        if (!story) throw new Error('Story not found');
        return story;
      } catch (error) {
        console.error('Error fetching story:', error.message);
        throw new Error('Error fetching story');
      }
    },
    author: async (parent) => {
      try {
        const user = await User.findById(parent.author);
        if (!user) throw new Error('User not found');
        return user;
      } catch (error) {
        console.error('Error fetching author:', error.message);
        throw new Error('Error fetching author');
      }
    },
  },
  User: {
    stories: async (parent) => {
      try {
        return await Story.find({ author: parent._id });
      } catch (error) {
        console.error('Error fetching stories:', error.message);
        throw new Error('Error fetching stories');
      }
    },
    followers: async (parent) => {
      try {
        // Find users where their _id is in the parent.followers array
        return await User.find({ _id: { $in: parent.followers } });
      } catch (error) {
        console.error('Error fetching followers:', error.message);
        throw new Error('Error fetching followers');
      }
    },

    followings: async (parent) => {
      try {
        // Find users where their _id is in the parent.following array
        return await User.find({ _id: { $in: parent.followings } });
      } catch (error) {
        console.error('Error fetching following:', error.message);
        throw new Error('Error fetching following');
      }
    },
  },
};

module.exports = relationalQueries;
