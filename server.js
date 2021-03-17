require("dotenv").config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { getUser } from "./users/users.utils";

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
    };
  },
});

const port = process.env.PORT;

server
  .listen(port)
  .then(() =>
    console.log(`🚀 Server is running on http://localhost:${port} ✅`)
  );
