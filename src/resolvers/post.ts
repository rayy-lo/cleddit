import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
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
  async createPost(@Arg("title") title: string): Promise<Post> {
    return Post.create({
      title,
    }).save();
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post> {
    const post = await Post.findOne({ id });

    if (!post) throw new Error("No Post Found with ID");
    if (typeof title !== undefined) {
      post.title = title;
      post.save();
    }

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id).catch((err) => {
      return false;
    });

    return true;
  }
}
