import { ApolloServer, gql } from "apollo-server";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";
import jwt from "jsonwebtoken";

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: (ctx) => {
    const { authorization } = ctx.req.headers;
    // console.log(authorization);
    if (authorization) {
      const payload = jwt.verify(authorization, process.env.JWT_SECRET);
      return { userId: payload.userId };
    }
  },
});

server.listen().then(({ url }) => {
  console.log("Server listening on " + url);
});
