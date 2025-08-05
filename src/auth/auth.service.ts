import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

async register(input: RegisterInput, requestingUser?: any) {
  // TEMPORARY: Comment out the admin check for initial setup
  if (input.role === Role.ADMIN) {
    if (!requestingUser || requestingUser.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admins can create admin accounts');
    }
  }
  // }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  
  const user = await this.prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      role: input.role || Role.USER,
    },
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async login(input: LoginInput) {
  const user = await this.prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Add this check
  if (!user.isActive) {
    throw new UnauthorizedException('Account is disabled');
  }

  const payload = { 
    sub: user.id, 
    email: user.email, 
    role: user.role 
  };

  const { password, ...userWithoutPassword } = user;

  return {
    accessToken: this.jwtService.sign(payload),
    user: userWithoutPassword,
  };
}

  async validateUser(userId: number) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}