import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
  static async listUsers(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.limit || 20);
    const users = await UserService.list(page, pageSize);
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

  static async blockUser(req: Request, res: Response) {
    const user = await UserService.setBlocked(req.params.id, true);
    res.status(200).json({ data: user });
  }

  static async deleteUser(req: Request, res: Response) {
    await UserService.remove(req.params.id);
    res.status(204).send();
  }
}
