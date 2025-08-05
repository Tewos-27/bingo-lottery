import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@ObjectType('User')
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field(() => Role)
  role: Role;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}