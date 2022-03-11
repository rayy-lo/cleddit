import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection, InsertResult } from "typeorm";
import { Post } from "../entity/Post";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  async createPost(@Arg("title") title: string): Promise<InsertResult> {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values({
        title,
      })
      .execute();

    return result.raw[0];
  }
}
