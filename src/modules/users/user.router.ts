import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { updateMeSchema } from './user.schema.js';
import {
  getMeHandler,
  updateMeHandler,
  deleteMeHandler,
} from './user.controller.js';

export const userRouter = Router();

userRouter.use(requireAuth);

userRouter.get('/me', getMeHandler);
userRouter.patch('/me', validate(updateMeSchema), updateMeHandler);
userRouter.delete('/me', deleteMeHandler);
