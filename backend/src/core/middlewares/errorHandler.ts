import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { createLogger } from '../logger';

const logger = createLogger('error-handler');

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error', { error: err });

  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Validation error', details: err.flatten().fieldErrors });
  }

  if (err instanceof Error) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }

  return res.status(500).json({ message: 'Internal server error' });
};
