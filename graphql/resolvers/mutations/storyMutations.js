const Story = require("../../../db/models/storySchema");
const User = require("../../../db/models/userSchema");
const Comment = require("../../../db/models/commentSchema");

const storyMutations = {
    createStory: async (parent, { title, content, moral },context) => {
        if(!context.user) throw new Error("Not authorized");
        // create story
        const story = new Story({ title, content, moral ,author:context.user.userId});
        await story.save();
        return story;
    },
    updateStory: async (parent, { _id, title, content, moral },{user}) => {
        if (!user) {
            throw new Error('Authentication required');
          }
    
          const story = await Story.findById(_id);
          if (!story) {
            throw new Error('Story not found');
          }
    
          if (story.author.toString() !== user.userId) {
            throw new Error('You do not have permission to update this story');
          }
    
          story.title = title || story.title;
          story.content = content || story.content;
          story.moral = moral || story.moral;
    
          return await story.save();
    },
    deleteStory: async (parent, { _id }, { user }) => {
        // Ensure the user is authenticated
        if (!user) {
          throw new Error('Authentication required');
        }
  
        // Find the story to be deleted
        const story = await Story.findById(_id);
        if (!story) {
          throw new Error('Story not found');
        }
  
        // Check if the user is the author of the story
        if (story.author.toString() !== user.userId) {
          throw new Error('You do not have permission to delete this story');
        }
  
        // Remove the story from all users' favourites
        await User.updateMany(
          { favoriteStories: _id }, // Find users who have the story in their favourites
          { $pull: { favoriteStories: _id } } // Remove the story ID from their favourites
        );
  
        // Delete all comments associated with this story
        await Comment.deleteMany({ story: _id });
  
        // Delete the story
        return await Story.findByIdAndDelete(_id);
      },
      likeStory: async (parent, { _id }, { user }) => {
        
        if (!user) throw new Error('Authentication required');
        
        const story = await Story.findById(_id);
        if (!story) throw new Error('Story not found');
        
        const currentUser = await User.findById(user.userId);
        if (currentUser.likedStories.includes(_id)) {
          throw new Error('You already liked this story');
        }
        
        // Add story to user's likedStories and increment likes on the story
        currentUser.likedStories.push(_id);
        story.likes += 1;
        
        await currentUser.save();
        await story.save();
        
        return story;
      },
      unlikeStory: async (parent, { _id }, { user }) => {
        if (!user) throw new Error('Authentication required');
        
        const story = await Story.findById(_id);
        if (!story) throw new Error('Story not found');
        
        const currentUser = await User.findById(user.userId);
        if (!currentUser.likedStories.includes(_id)) {
          throw new Error('You have not liked this story');
        }
        
        // Remove story from user's likedStories and decrement likes on the story
        currentUser.likedStories.pull(_id);
        story.likes -= 1;
        
        await currentUser.save();
        await story.save();
        
        return story;
      }
}

module.exports = storyMutations;