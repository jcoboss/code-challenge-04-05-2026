import type { Request, Response, NextFunction } from 'express';
import * as projectService from './project.service.js';
import type { CreateProjectInput, UpdateProjectInput, ListProjectsQuery } from './project.schema.js';

export async function listProjectsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await projectService.listProjects(
      req.user!.id,
      req.query as unknown as ListProjectsQuery,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function createProjectHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const project = await projectService.createProject(
      req.user!.id,
      req.body as CreateProjectInput,
    );
    res.status(201).json({ data: project });
  } catch (err) {
    next(err);
  }
}

export async function getProjectHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const project = await projectService.getProject(req.params.id as string, req.user!.id);
    res.json({ data: project });
  } catch (err) {
    next(err);
  }
}

export async function updateProjectHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const project = await projectService.updateProject(
      req.params.id as string,
      req.user!.id,
      req.body as UpdateProjectInput,
    );
    res.json({ data: project });
  } catch (err) {
    next(err);
  }
}

export async function deleteProjectHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await projectService.deleteProject(req.params.id as string, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
