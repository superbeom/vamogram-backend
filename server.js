require("dotenv").config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";

const server = new ApolloServer({
  schema,
});

const port = process.env.PORT;

server
  .listen(port)
  .then(() =>
    console.log(`🚀 Server is running on http://localhost:${port} ✅`)
  );
