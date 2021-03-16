require("dotenv").config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";

const server = new ApolloServer({
  schema,
  context: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE1ODgyMjY0fQ.u3NR1Xzhf-U2haDXKlGrxBkme5Wwtzbd2NOMXHBhDaI",
  },
});

const port = process.env.PORT;

server
  .listen(port)
  .then(() =>
    console.log(`🚀 Server is running on http://localhost:${port} ✅`)
  );
