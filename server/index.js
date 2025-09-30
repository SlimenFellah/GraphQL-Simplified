/**
 * GraphQL Simplified - Server
 * 
 * A modern GraphQL server built with Apollo Server and Express.js
 * 
 * Developed and maintained by Slimene Fellah
 * Portfolio: https://www.slimenefellah.dev/
 * Available for freelance work
 */

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');

// Import GraphQL schema and resolvers
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: process.env.NODE_ENV === 'development',
    playground: process.env.GRAPHQL_PLAYGROUND === 'true',
  });

  // Start the server
  await server.start();

  // Apply middleware
  app.use(
    process.env.GRAPHQL_ENDPOINT || '/graphql',
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server)
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'GraphQL Server is running!' });
  });

  // Start HTTP server
  const PORT = process.env.PORT || 4000;
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  
  console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}${process.env.GRAPHQL_ENDPOINT || '/graphql'}`);
  console.log(`🔍 GraphQL Playground available at http://localhost:${PORT}${process.env.GRAPHQL_ENDPOINT || '/graphql'}`);
}

// Start the server
startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});