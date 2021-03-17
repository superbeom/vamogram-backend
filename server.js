require("dotenv").config();
import { ApolloServer } from "apollo-server";
import client from "./client";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      client,
    };
  },
});

const port = process.env.PORT;

server
  .listen(port)
  .then(() =>
    console.log(`🚀 Server is running on http://localhost:${port} ✅`)
  );
