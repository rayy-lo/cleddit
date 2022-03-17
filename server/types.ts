import session from "express-session";
import { Request, Response } from "express";

export type MyContext = {
  req: Request;
  res: Response;
};

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}
