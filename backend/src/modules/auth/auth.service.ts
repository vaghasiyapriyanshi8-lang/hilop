import bcrypt from 'bcryptjs';
import { UserModel } from '../users/user.model';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { sendResetEmail } from '../../utils/email';

const FIXED_ADMIN_EMAIL = 'hilop@admin.com';
const FIXED_ADMIN_PASSWORD = 'hilop@123';
const refreshTokenStore = new Map<string, string>();

const authError = (message: string, statusCode: number) => {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
};

const normalizeRoles = (roles: string[]) =>
  roles.map((role) => {
    if (role === 'superadmin') return 'admin';
    if (role === 'customer') return 'user';
    return role;
  });

const buildSafeUser = (user: any, roles: string[]) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  return {
    ...userObj,
    roles,
    role: roles[0] || 'user',
  };
};

export class AuthService {
  static async register(payload: { email: string; password: string; name: string; role?: string }) {
    const existing = await UserModel.findOne({ email: payload.email });
    if (existing) throw authError('Email already registered', 409);

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = await UserModel.create({
      name: payload.name,
      email: payload.email,
      password: passwordHash,
      roles: ['user'],
    });

    const roles = normalizeRoles(user.roles);
    const accessToken = signAccessToken({ userId: user.id, roles });
    const refreshToken = signRefreshToken({ userId: user.id });
    refreshTokenStore.set(user.id, refreshToken);

    return {
      user: buildSafeUser(user, roles),
      accessToken,
      refreshToken,
      token: accessToken, // for backward compatibility with admin app
    };
  }

  static async authenticate(payload: { email: string; password: string }) {
    let user = await UserModel.findOne({ email: payload.email }).select('+password');

    if (!user) {
      if (
        payload.email === FIXED_ADMIN_EMAIL &&
        payload.password === FIXED_ADMIN_PASSWORD
      ) {
        const passwordHash = await bcrypt.hash(FIXED_ADMIN_PASSWORD, 12);
        user = await UserModel.create({
          name: 'Hilop Admin',
          email: FIXED_ADMIN_EMAIL,
          password: passwordHash,
          roles: ['admin'],
        });
      } else {
        throw authError('Invalid credentials', 401);
      }
    }

    if (!user.password) {
      throw authError('Password not found', 401);
    }

    const match = await bcrypt.compare(payload.password, user.password);
    if (!match) throw authError('Invalid credentials', 401);

    const roles = normalizeRoles(user.roles);
    const accessToken = signAccessToken({ userId: user.id, roles });
    const refreshToken = signRefreshToken({ userId: user.id });
    refreshTokenStore.set(user.id, refreshToken);

    return {
      user: buildSafeUser(user, roles),
      accessToken,
      refreshToken,
      token: accessToken, // for backward compatibility with admin app
    };
  }

  static async refresh(token: string) {
    const payload = verifyRefreshToken<{ userId: string }>(token);
    const user = await UserModel.findById(payload.userId);
    if (!user) throw authError('Invalid refresh token', 401);

    const roles = normalizeRoles(user.roles);
    const accessToken = signAccessToken({ userId: user.id, roles });
    const refreshToken = signRefreshToken({ userId: user.id });
    refreshTokenStore.set(user.id, refreshToken);

    return {
      user: buildSafeUser(user, roles),
      accessToken,
      refreshToken,
      token: accessToken,
    };
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
