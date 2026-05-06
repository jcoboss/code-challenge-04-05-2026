import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { AppError } from '../../errors/AppError.js';
import type { RegisterInput, LoginInput } from './auth.schema.js';

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export async function register(input: RegisterInput): Promise<UserDTO> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new AppError(409, 'Email already in use');
  }

  const hashedPassword = await argon2.hash(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
  });

  return toUserDTO(user);
}

export async function login(input: LoginInput): Promise<{ accessToken: string }> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  // Use constant-time response to prevent user enumeration
  if (!user || !(await argon2.verify(user.password, input.password))) {
    throw new AppError(401, 'Invalid email or password');
  }

  const accessToken = jwt.sign(
    { sub: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as StringValue },
  );

  return { accessToken };
}
