import type { Request, Response, NextFunction } from 'express';
import * as userService from './user.service.js';
import type { UpdateMeInput } from './user.schema.js';

export async function getMeHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await userService.getMe(req.user!.id);
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateMeHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await userService.updateMe(req.user!.id, req.body as UpdateMeInput);
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
}

export async function deleteMeHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await userService.deleteMe(req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
