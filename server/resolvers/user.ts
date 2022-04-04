import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entity/User";
import argon2 from "argon2";
import { MyContext } from "../types";

@InputType()
class UsernamePasswordInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.user) {
      return null;
    }

    const user = await User.findOne({ username: req.session.user.username });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (options.email.length <= 5) {
      return {
        errors: [
          {
            field: "email",
            message: "Email cannot be less than 5 characters",
          },
        ],
      };
    }

    if (options.password.length <= 5) {
      return {
        errors: [
          {
            field: "password",
            message: "Password cannot be less than 5 characters",
          },
        ],
      };
    }

    const user = await User.findOne({ username: options.email });

    if (user) {
      return {
        errors: [
          {
            field: "email",
            message: "Email is already in use.",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);

    const newUser = await User.create({
      username: options.email,
      password: hashedPassword,
    }).save();

    req.session.user = { username: options.email };

    return {
      user: newUser,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ username: options.email });

    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "Incorrect Credentials",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, options.password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect Credentials",
          },
        ],
      };
    }

    // store user id session
    // set a cookie in the browser for the user
    // keeps them logged in
    req.session.user = { username: options.email };

    return {
      user,
    };
  }
}
