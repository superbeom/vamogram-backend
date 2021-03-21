require("dotenv").config();
import http from "http";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const port = process.env.PORT;
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    if (req) {
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    }
  },
});

const app = express();
app.use(logger("tiny"));
app.use("/static", express.static("uploads"));
apollo.applyMiddleware({ app });

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port} ✅`);
});
