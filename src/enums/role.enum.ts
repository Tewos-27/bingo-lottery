// src/enums/role.enum.ts
import { Role } from '@prisma/client';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(Role, {
  name: 'Role',
  description: 'User role types',
});

// Export the Prisma Role enum
export { Role };