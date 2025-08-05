import { InputType, Field } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@InputType()
export class UpdateUserInput {
  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field({ nullable: true })
  isActive?: boolean;
}