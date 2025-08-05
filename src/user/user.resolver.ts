import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { User } from './dto/user.object';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

// This file defines the GraphQL resolver for user-related operations, including fetching users, deactivating a user, and promoting a user to admin.
// It uses guards to ensure that only authorized users can perform these actions.
//  This query retrieves all users from the database, accessible only to admin users.
  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getUsers() {
    return this.userService.getUsers  ();
  }

  @Mutation(() => Boolean, { name: 'deactivateUser' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deactivateUser(
    @Args('userId') userId: number,
    @Context() context
  ) {
    await this.userService.deactivateUser(userId, context.req.user);
    return true;
  }

  @Mutation(() => User, { name: 'promoteToAdmin' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async promoteToAdmin(
    @Args('userId') userId: number,
    @Context() context
  ) {
    return this.userService.promoteToAdmin(userId, context.req.user);
  }
}