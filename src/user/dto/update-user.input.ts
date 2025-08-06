import { InputType, Field } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@InputType()
export class UpdateUserInput {
  // This input type is used to update user details, including their role and active status.

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field({ nullable: true })
  isActive?: boolean;
}