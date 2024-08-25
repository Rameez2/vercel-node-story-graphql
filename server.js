require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/graphqlSchema');
const resolvers = require('./graphql/resolvers/index');
const jwt = require("jsonwebtoken");

// Connect to MongoDB
require("./db/connection")();

// Create an Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const tokenValue = token.replace('Bearer ', '');
    // console.log('got token',token);
    
    if (!token) {
      return {}; // No token provided
    }

    try {
      const user = jwt.verify(tokenValue, process.env.JWT_SECRET_KEY);
      return { user };
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return {}; // Token invalid or verification failed
    }
  }
});

// Start the server
server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
