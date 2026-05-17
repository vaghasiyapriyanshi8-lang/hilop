import bcrypt from 'bcryptjs';
import { UserDocument, UserModel } from './user.model';
import { sendEmail } from '../../utils/email';

export class UserService {
  static async findById(id: string) {
    const user = await UserModel.findById(id).lean();
    if (!user) return null;
    return { ...user, id: user._id.toString() };
  }

  static async list(page = 1, pageSize = 20, search = '', role = '', isBlocked?: boolean) {
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      filter.roles = role;
    }

    if (isBlocked !== undefined) {
      filter.isBlocked = isBlocked;
    }

    return UserModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();
  }

  static async updateProfile(userId: string, payload: Partial<UserDocument>) {
    const user = await UserModel.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }).lean();
    if (!user) return null;
    return { ...user, id: user._id.toString() };
  }

  static async setBlocked(userId: string, blocked: boolean) {
    return UserModel.findByIdAndUpdate(userId, { isBlocked: blocked }, { new: true });
  }

  static async remove(userId: string) {
    return UserModel.findByIdAndDelete(userId);
  }

  static async sendUserEmail(userId: string, subject: string, message: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error('User not found');
    await sendEmail(user.email, subject, message);
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await UserModel.findById(userId).select('+password');
    if (!user) throw new Error('User not found');
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error('Current password is incorrect');
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
  }
}
