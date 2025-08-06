import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { User as PrismaUser } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
// This service handles user-related operations such as fetching users, deactivating a user, and promoting a user to admin.
  // It interacts with the Prisma service to perform database operations and applies necessary business logic.
  async getUsers(): Promise<PrismaUser[]> {
    return this.prisma.user.findMany();
  }

  async deactivateUser(userId: number, requestingUser: any) {
    if (requestingUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can deactivate users');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    if (targetUser.role === Role.ADMIN) {
      const activeAdmins = await this.prisma.user.count({
        where: { 
          role: Role.ADMIN,
          isActive: true,
          NOT: { id: userId }
        }
      });

      if (activeAdmins === 0) {
        throw new ForbiddenException('Cannot deactivate last active admin');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  async promoteToAdmin(userId: number, requestingUser: any): Promise<PrismaUser> {
    if (requestingUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can promote users');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: Role.ADMIN },
    });
  }
}