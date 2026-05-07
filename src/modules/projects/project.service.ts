import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../errors/AppError.js';
import { toSkipTake, toPaginationMeta, type PaginationMeta } from '../../lib/pagination.js';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  ListProjectsQuery,
} from './project.schema.js';

export interface ProjectDTO {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

function toProjectDTO(project: {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}): ProjectDTO {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    ownerId: project.ownerId,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

async function assertOwner(projectId: string, userId: string): Promise<void> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) throw new AppError(404, 'Project not found');
  if (project.ownerId !== userId) throw new AppError(403, 'Forbidden');
}

export async function listProjects(
  userId: string,
  query: ListProjectsQuery,
): Promise<{ data: ProjectDTO[]; meta: PaginationMeta }> {
  const where = { ownerId: userId };
  const { skip, take } = toSkipTake(query);

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
    prisma.project.count({ where }),
  ]);

  return { data: projects.map(toProjectDTO), meta: toPaginationMeta(total, query) };
}

export async function createProject(
  userId: string,
  input: CreateProjectInput,
): Promise<ProjectDTO> {
  const project = await prisma.project.create({
    data: { ...input, ownerId: userId },
  });

  return toProjectDTO(project);
}

export async function getProject(projectId: string, userId: string): Promise<ProjectDTO> {
  await assertOwner(projectId, userId);

  const project = await prisma.project.findUnique({ where: { id: projectId } });

  return toProjectDTO(project!);
}

export async function updateProject(
  projectId: string,
  userId: string,
  input: UpdateProjectInput,
): Promise<ProjectDTO> {
  await assertOwner(projectId, userId);

  const project = await prisma.project.update({
    where: { id: projectId },
    data: input,
  });

  return toProjectDTO(project);
}

export async function deleteProject(projectId: string, userId: string): Promise<void> {
  await assertOwner(projectId, userId);

  await prisma.project.delete({ where: { id: projectId } });
}
