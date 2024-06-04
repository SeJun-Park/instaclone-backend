import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import schema from './schema.js';

const PORT = process.env.PORT;

async function startServer() {

  const server = new ApolloServer({
    schema
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer();
