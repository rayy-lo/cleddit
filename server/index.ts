import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { createClient } from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

createConnection()
  .then(async (connection) => {
    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = createClient();

    app.set("trust proxy", process.env.NODE_ENV !== "production");

    app.use(
      session({
        name: "qid",
        store: new RedisStore({ client: redisClient }),
        saveUninitialized: false,
        secret: "keyboard cat",
        resave: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
          secure: false,
        },
      })
    );

    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [PostResolver, UserResolver],
        validate: false,
      }),
      context: ({ req, res }) => ({ req, res }),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
      app,
      path: "/",
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });

    app.listen(3100, () => {
      console.log("server started on port 3100");
    });
  })
  .catch((error) => console.log("Error: ", error));
