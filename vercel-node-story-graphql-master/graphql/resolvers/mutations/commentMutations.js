const Comment = require("../../../db/models/commentSchema");

const commentMutations = {
    createComment: async (parent, { storyId, content, rating },context) => {
        if(!context.user) throw new Error("Not authorized");
        
        const comment = new Comment({ story: storyId, content:content.slice(0,4000), rating ,author:context.user.userId});
        await comment.save();
        return comment;
    },
    // TO USE EDIT OR UPDATE COMMENT FEATURE (Uncomment Below MUTATION)
    // updateComment: async (parent, { _id, content, rating },{user}) => {
    //     if (!user) {
    //         throw new Error('Authentication required');
    //       }
    
    //       const comment = await Comment.findById(_id);
    //       if (!comment) {
    //         throw new Error('Comment not found');
    //       }
    
    //       if (comment.author.toString() !== user.userId) {
    //         throw new Error('You do not have permission to update this comment');
    //       }
    
    //       if (content) comment.content = content;
    //       if (rating) comment.rating = rating;
    
    //       return await comment.save();
    // },
    deleteComment: async (parent, { _id },{user}) => {
        
        if (!user) {
            throw new Error('Authentication required');
        }
    
        const comment = await Comment.findById(_id);
        if (!comment) {
            throw new Error('Comment not found');
        }
    
        if (comment.author.toString() !== user.userId) {
            throw new Error('You do not have permission to delete this comment');
        }
    
        return await Comment.findByIdAndDelete(_id);
    }
}

module.exports = commentMutations;