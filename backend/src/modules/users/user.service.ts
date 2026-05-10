import { UserDocument, UserModel } from './user.model';

export class UserService {
  static async findById(id: string) {
    return UserModel.findById(id).lean();
  }

  static async list(page = 1, pageSize = 20) {
    return UserModel.find()
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
}
