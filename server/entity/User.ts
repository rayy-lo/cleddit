import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn({ type: "date" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "date" })
  updatedAt: Date;

  @Field(() => String)
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
