// Implemented in Phase 3.2 — Tasks CRUD
import { Router } from 'express';

// mergeParams: true gives access to :projectId from the parent route
export const taskRouter = Router({ mergeParams: true });
