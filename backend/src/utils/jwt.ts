import jwt from 'jsonwebtoken';
import { config } from '../config';

export const signAccessToken = (payload: object): string =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn }) as string;

export const signRefreshToken = (payload: object): string =>
  jwt.sign(payload, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiresIn }) as string;

export const verifyAccessToken = <T>(token: string): T =>
  jwt.verify(token, config.jwtSecret) as T;

export const verifyRefreshToken = <T>(token: string): T =>
  jwt.verify(token, config.refreshTokenSecret) as T;
