import bcrypt from 'bcryptjs';
import { UserModel } from '../users/user.model';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { config } from '../../config';
import { sendResetEmail } from '../../utils/email';

const refreshTokenStore = new Map<string, string>();

export class AuthService {
  static async register(payload: { email: string; password: string; name: string }) {
    const existing = await UserModel.findOne({ email: payload.email });
    if (existing) throw new Error('Email already registered');

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = await UserModel.create({ ...payload, password: passwordHash, roles: ['customer'] });

    const accessToken = signAccessToken({ userId: user.id, roles: user.roles });
    const refreshToken = signRefreshToken({ userId: user.id });
    refreshTokenStore.set(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  static async authenticate(payload: { email: string; password: string }) {
    const user = await UserModel.findOne({ email: payload.email }).select('+password');
    if (!user) throw new Error('Invalid credentials');

     if (!user.password) {
    throw new Error('Password not found')
  }

    const match = await bcrypt.compare(payload.password, user.password);
    if (!match) throw new Error('Invalid credentials');

    const accessToken = signAccessToken({ userId: user.id, roles: user.roles });
    const refreshToken = signRefreshToken({ userId: user.id });
    refreshTokenStore.set(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  static async refresh(token: string) {
    const payload = verifyRefreshToken<{ userId: string }>(token);
    const user = await UserModel.findById(payload.userId);
    if (!user) throw new Error('Invalid refresh token');

    const accessToken = signAccessToken({ userId: user.id, roles: user.roles });
    const refreshToken = signRefreshToken({ userId: user.id });
    refreshTokenStore.set(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  static async revokeTokens(token: string) {
    const payload = verifyRefreshToken<{ userId: string }>(token);
    refreshTokenStore.delete(payload.userId);
  }

  static async verifyOtp(email: string, code: string) {
    // placeholder for OTP validation with a dedicated store
    return true;
  }

  static async requestPasswordReset(email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) return;

    const token = signRefreshToken({ userId: user.id });
    await sendResetEmail(email, token);
  }

  static async resetPassword(token: string, password: string) {
    const payload = verifyRefreshToken<{ userId: string }>(token);
    const passwordHash = await bcrypt.hash(password, 12);
    await UserModel.findByIdAndUpdate(payload.userId, { password: passwordHash });
  }
}
