import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
  static async listUsers(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.limit || 20);
    const search = String(req.query.search || '');
    const role = String(req.query.role || '');
    const isBlocked = req.query.isBlocked === 'true' ? true : req.query.isBlocked === 'false' ? false : undefined;
    
    const users = await UserService.list(page, pageSize, search, role, isBlocked);
    res.status(200).json({ data: users });
  }

  static async getCurrentUser(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const user = await UserService.findById(userId);
    res.status(200).json({ data: user });
  }

  static async updateProfile(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const user = await UserService.updateProfile(userId, req.body);
    res.status(200).json({ data: user });
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new password are required' });
      }
      await UserService.changePassword(userId, currentPassword, newPassword);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async blockUser(req: Request, res: Response) {
    const { blocked } = req.body;
    const user = await UserService.setBlocked(req.params.id, blocked);
    res.status(200).json({ data: user });
  }

  static async deleteUser(req: Request, res: Response) {
    await UserService.remove(req.params.id);
    res.status(204).send();
  }

  static async sendEmail(req: Request, res: Response) {
    const { subject, message } = req.body;
    await UserService.sendUserEmail(req.params.id, subject, message);
    res.status(200).json({ message: 'Email sent successfully' });
  }
}
