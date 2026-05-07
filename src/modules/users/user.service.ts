import argon2 from 'argon2';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../errors/AppError.js';
import type { UserDTO } from '../auth/auth.service.js';
import type { UpdateMeInput } from './user.schema.js';

function toUserDTO(user: {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}): UserDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function getMe(userId: string): Promise<UserDTO> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new AppError(404, 'User not found');

  return toUserDTO(user);
}

export async function updateMe(userId: string, input: UpdateMeInput): Promise<UserDTO> {
  const data: { name?: string; password?: string } = {};

  if (input.name !== undefined) data.name = input.name;
  if (input.password !== undefined) data.password = await argon2.hash(input.password);

  const user = await prisma.user.update({ where: { id: userId }, data });

  return toUserDTO(user);
}

export async function deleteMe(userId: string): Promise<void> {
  // Wrapped in a transaction — cascade deletes (projects → tasks) fire atomically
  await prisma.$transaction(async (tx) => {
    await tx.user.delete({ where: { id: userId } });
  });
}
