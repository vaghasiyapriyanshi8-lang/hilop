import { z } from 'zod';

export const authSchemas = {
  signup: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
  }),
  login: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
  verifyOtp: z.object({
    email: z.string().email(),
    code: z.string().length(6),
  }),
  forgotPassword: z.object({ email: z.string().email() }),
  resetPassword: z.object({ token: z.string(), password: z.string().min(8) }),
};
