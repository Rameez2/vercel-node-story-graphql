require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/graphqlSchema');
const resolvers = require('./graphql/resolvers/index');
const jwt = require("jsonwebtoken");

// Connect to MongoDB
require("./db/connection")();

// Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const tokenValue = token.replace('Bearer ', '');

    if (!tokenValue) return {};

    try {
      const user = jwt.verify(tokenValue, process.env.JWT_SECRET_KEY);
      return { user };
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return {};
    }
  },
  cors: {
    origin: '*',         // ✅ Use your frontend origin in production
    credentials: true,   // Allow cookies/credentials if needed
  }
});

// Start the server
server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
