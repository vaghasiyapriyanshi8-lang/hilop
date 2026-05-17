import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  static async signup(req: Request, res: Response) {
    const payload = await AuthService.register(req.body);
    res.status(201).json(payload);
  }

  static async login(req: Request, res: Response) {
    const payload = await AuthService.authenticate(req.body);
    res.status(200).json(payload);
  }

  static async googleLogin(req: Request, res: Response) {
    const payload = await AuthService.googleLogin(req.body);
    res.status(200).json(payload);
  }

  static async refreshToken(req: Request, res: Response) {
    const payload = await AuthService.refresh(req.body.refreshToken);
    res.status(200).json(payload);
  }

  static async logout(req: Request, res: Response) {
    await AuthService.revokeTokens(req.body.refreshToken);
    res.status(204).send();
  }

  static async verifyOtp(req: Request, res: Response) {
    await AuthService.verifyOtp(req.body.email, req.body.code);
    res.status(200).json({ message: 'OTP verified' });
  }

  static async forgotPassword(req: Request, res: Response) {
    await AuthService.requestPasswordReset(req.body.email);
    res.status(200).json({ message: 'Password reset link sent' });
  }

  static async resetPassword(req: Request, res: Response) {
    await AuthService.resetPassword(req.body.token, req.body.password);
    res.status(200).json({ message: 'Password updated successfully' });
  }
}
