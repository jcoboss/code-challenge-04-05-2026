// This empty export makes the file a module, so the block below
// augments express-serve-static-core instead of replacing it.
export {};

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; email: string };
  }
}
