import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@ObjectType('User')
// This object type represents a user in the system, including their ID, email, role, active status, and timestamps for creation and updates.
// It is used in GraphQL queries and mutations to interact with user data.
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