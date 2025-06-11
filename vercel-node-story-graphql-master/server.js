const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();
const typeDefs = require('./graphql/graphqlSchema');
const resolvers = require('./graphql/resolvers/index');
const jwt = require('jsonwebtoken');
require('./db/connection')();

const app = express();
app.use(cors()); // Allow all origins
app.use(bodyParser.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async () => {
  await server.start();
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const tokenValue = token.replace('Bearer ', '');
      if (!token) return {};
      try {
        const user = jwt.verify(tokenValue, process.env.JWT_SECRET_KEY);
        return { user };
      } catch (err) {
        console.error('JWT verification failed:', err.message);
        return {};
      }
    }
  }));

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  });
})();
