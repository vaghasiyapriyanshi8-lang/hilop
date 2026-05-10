import jwt from 'jsonwebtoken';
import { config } from '../config';

export const signAccessToken = (payload: object) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

export const signRefreshToken = (payload: object) =>
  jwt.sign(payload, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiresIn });

export const verifyAccessToken = <T>(token: string): T =>
  jwt.verify(token, config.jwtSecret) as T;

export const verifyRefreshToken = <T>(token: string): T =>
  jwt.verify(token, config.refreshTokenSecret) as T;
