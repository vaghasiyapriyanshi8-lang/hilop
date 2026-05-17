import bcrypt from 'bcryptjs';
import axios from 'axios';
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
    id: userObj._id.toString(),
    roles,
    role: roles[0] || 'user',
  };
};

export class AuthService {
  static async register(payload: { email: string; password: string; name: string; phone?: string; role?: string }) {
    const existing = await UserModel.findOne({ email: payload.email });
    if (existing) throw authError('Email already registered', 409);

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = await UserModel.create({
      name: payload.name,
      email: payload.email,
      password: passwordHash,
      phone: payload.phone,
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

  static async googleLogin(payload: { idToken?: string; accessToken?: string }) {
    let email: string;
    let name: string;
    let googleId: string;
    let avatar: string | undefined;

    if (payload.idToken) {
      // Verify ID Token with Google
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${payload.idToken}`);
      const data = response.data;
      email = data.email;
      name = data.name;
      googleId = data.sub;
      avatar = data.picture;
    } else if (payload.accessToken) {
      // Get user info from Google using access token
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${payload.accessToken}` },
      });
      const data = response.data;
      email = data.email;
      name = data.name;
      googleId = data.sub;
      avatar = data.picture;
    } else {
      throw authError('Google token required', 400);
    }

    let user = await UserModel.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        googleId,
        avatar,
        roles: ['user'],
      });
    } else if (!user.googleId) {
      // Link Google account to existing email account
      user.googleId = googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    }

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
      throw authError('This account was created with Google. Please use "Continue with Google" to login.', 401);
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

// Function to create an admin user
export async function createAdminUser() {
  const adminEmail = 'hilop@admin.com';
  const adminPassword = 'Hilop@123';

  // Check if the admin user already exists
  const existingAdmin = await UserModel.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log('Admin user already exists.');
    return;
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // Create the admin user
  const adminUser = await UserModel.create({
    name: 'Admin User',
    email: adminEmail,
    password: passwordHash,
    roles: ['admin'],
  });

  console.log('Admin user created:', adminUser);
}
