import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

createConnection()
  .then(async (connection) => {
    const app = express();

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [PostResolver, UserResolver],
        validate: false,
      }),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    app.listen(3100, () => {
      console.log("server started on port 3100");
    });
  })
  .catch((error) => console.log("Error: ", error));
