import type { Request, Response, NextFunction } from 'express';
import * as taskService from './task.service.js';
import type { CreateTaskInput, UpdateTaskInput, ListTasksQuery } from './task.schema.js';

export async function listTasksHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await taskService.listTasks(
      req.params.projectId as string,
      req.user!.id,
      req.query as unknown as ListTasksQuery,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function createTaskHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const task = await taskService.createTask(
      req.params.projectId as string,
      req.user!.id,
      req.body as CreateTaskInput,
    );
    res.status(201).json({ data: task });
  } catch (err) {
    next(err);
  }
}

export async function getTaskHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const task = await taskService.getTask(req.params.projectId as string, req.params.id as string, req.user!.id);
    res.json({ data: task });
  } catch (err) {
    next(err);
  }
}

export async function updateTaskHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const task = await taskService.updateTask(
      req.params.projectId as string,
      req.params.id as string,
      req.user!.id,
      req.body as UpdateTaskInput,
    );
    res.json({ data: task });
  } catch (err) {
    next(err);
  }
}

export async function deleteTaskHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await taskService.deleteTask(req.params.projectId as string, req.params.id as string, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
