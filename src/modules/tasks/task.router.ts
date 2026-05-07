import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  listTasksSchema,
  taskParamSchema,
  projectIdParamSchema,
} from './task.schema.js';
import {
  listTasksHandler,
  createTaskHandler,
  getTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from './task.controller.js';

// mergeParams: true gives access to :projectId from the parent route
export const taskRouter = Router({ mergeParams: true });

taskRouter.use(requireAuth);

taskRouter.get(
  '/',
  validate(projectIdParamSchema, 'params'),
  validate(listTasksSchema, 'query'),
  listTasksHandler,
);
taskRouter.post(
  '/',
  validate(projectIdParamSchema, 'params'),
  validate(createTaskSchema),
  createTaskHandler,
);
taskRouter.get('/:id', validate(taskParamSchema, 'params'), getTaskHandler);
taskRouter.patch(
  '/:id',
  validate(taskParamSchema, 'params'),
  validate(updateTaskSchema),
  updateTaskHandler,
);
taskRouter.delete('/:id', validate(taskParamSchema, 'params'), deleteTaskHandler);
