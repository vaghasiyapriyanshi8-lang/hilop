import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema<any>) => (req: Request, _res: Response, next: NextFunction) => {
  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    return next(parseResult.error);
  }
  req.body = parseResult.data;
  next();
};
