const { gql } = require('apollo-server');

const typeDefs = gql`#graphql
  type User {
    _id: ID!
    username: String!
    email: String!
    stories: [Story!]
    createdAt:String
    favouriteStories:[Story!]
    followers:[User!]
    followings:[User!]
  }

  type Story {
    _id: ID!
    title: String!
    content: String!
    moral: String!
    author: User!
    comments: [Comment]
    likes:Int!
    # likes:[User!]
    createdAt:String
  }

  type Comment {
    _id: ID!
    content: String!
    story: Story!
    author: User!
    createdAt:String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    user(_id : ID!): User
    users: [User]
    currentuser: User
    stories(limit: Int, offset: Int): [Story]
    mystories:[Story]
    story(_id: ID!): Story
    comments: [Comment]
    comment(_id: ID!): Comment
    favoriteStories:[Story]
    likedStories :[Story]
    followers:[User]
    followings:[User]
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!

    createUser(username: String!, email: String!, password: String!): AuthPayload
    updateUser(username: String, currentPassword:String,password: String): User
    deleteUser(_id: ID!): User
    addStoryToFavorites(_id:ID!) : Story
    removeStoryFromFavorites(_id:ID!) : User
    likeStory(_id: ID!): Story
    unlikeStory(_id:ID!): Story
    addFollower(followerId: ID!): User
    removeFollower(followerId: ID!): User

    createStory(title: String!, content: String!, moral: String!): Story
    updateStory(_id: ID!, title: String, content: String, moral: String): Story
    deleteStory(_id: ID!): Story

    createComment(storyId: ID!, content: String!): Comment
    # TO USE EDIT OR UPDATE COMMENT FEATURE (UnComment below MUTATION)
    # updateComment(_id: ID!, content: String, rating: Int): Comment
    deleteComment(_id: ID!): Comment
  }
`;

module.exports = typeDefs;
