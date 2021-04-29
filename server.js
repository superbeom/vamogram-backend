require("dotenv").config();
import http from "http";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
// import RedisServer from "redis-server";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const port = process.env.PORT;
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (req) {
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    } else {
      const {
        context: { loggedInUser },
      } = connection;

      return { loggedInUser };
    }
  },
  subscriptions: {
    onConnect: async ({ token }) => {
      if (!token) {
        throw new Error("You can't listen.");
      }

      const loggedInUser = await getUser(token);

      return { loggedInUser };
    },
  },
});

const app = express();
// const redisServer = new RedisServer();
app.use(logger("tiny"));
app.use("/static", express.static("uploads"));
// app.use("/graphql", { redisServer });
apollo.applyMiddleware({ app });

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}/graphql ✅`);
});
