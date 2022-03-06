import "reflect-metadata";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { Post } from "./entity/Post";

createConnection()
  .then(async (connection) => {
    console.log("successful connection");
  })
  .catch((error) => console.log("Error: ", error));
