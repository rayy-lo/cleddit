import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entity/User";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("options") options: UsernamePasswordInput
  ): Promise<User> {
    const user = await User.findOne({ username: options.username });

    if (user) throw new Error("Username in use");

    const hashedPassword = await argon2.hash(options.password);
    return User.create({
      username: options.username,
      password: hashedPassword,
    }).save();
  }
}
