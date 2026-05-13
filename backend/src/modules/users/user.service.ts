import { UserDocument, UserModel } from './user.model';
import { sendEmail } from '../../utils/email';

export class UserService {
  static async findById(id: string) {
    return UserModel.findById(id).lean();
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
    return UserModel.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }).lean();
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
}
