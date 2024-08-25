const unRelationalQueries = require("./unRelationalQueries");
const relationalQueries = require("./relationalQueries");
const userMutations = require("./mutations/userMutations");
const storyMutations = require("./mutations/storyMutations");
const commentMutations = require("./mutations/commentMutations")

const resolvers = {
    ...unRelationalQueries,
    ...relationalQueries,
  Mutation: {
    ...userMutations,
    ...storyMutations,
    ...commentMutations
  }
}

module.exports = resolvers;