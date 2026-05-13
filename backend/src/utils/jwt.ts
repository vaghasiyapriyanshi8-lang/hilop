import jwt, { Secret } from 'jsonwebtoken';
import { config } from '../config';

export const signAccessToken = (payload: object): string =>
  jwt.sign(payload, config.jwtSecret as Secret, { expiresIn: config.jwtExpiresIn } as any) as string;

export const signRefreshToken = (payload: object): string =>
  jwt.sign(payload, config.refreshTokenSecret as Secret, { expiresIn: config.refreshTokenExpiresIn } as any) as string;

export const verifyAccessToken = <T>(token: string): T =>
  jwt.verify(token, config.jwtSecret as Secret) as T;

export const verifyRefreshToken = <T>(token: string): T =>
  jwt.verify(token, config.refreshTokenSecret as Secret) as T;
