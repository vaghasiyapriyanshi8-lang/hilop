import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../logger';

const logger = createLogger('http');

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  logger.info('%s %s %s', req.method, req.originalUrl, req.ip);
  next();
};
