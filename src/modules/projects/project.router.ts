import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createProjectSchema,
  updateProjectSchema,
  listProjectsSchema,
  projectParamSchema,
} from './project.schema.js';
import {
  listProjectsHandler,
  createProjectHandler,
  getProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from './project.controller.js';

export const projectRouter = Router();

projectRouter.use(requireAuth);

projectRouter.get('/', validate(listProjectsSchema, 'query'), listProjectsHandler);
projectRouter.post('/', validate(createProjectSchema), createProjectHandler);
projectRouter.get('/:id', validate(projectParamSchema, 'params'), getProjectHandler);
projectRouter.patch(
  '/:id',
  validate(projectParamSchema, 'params'),
  validate(updateProjectSchema),
  updateProjectHandler,
);
projectRouter.delete('/:id', validate(projectParamSchema, 'params'), deleteProjectHandler);
