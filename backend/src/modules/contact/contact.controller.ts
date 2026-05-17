import { Request, Response, NextFunction } from 'express';
import { ContactService } from './contact.service';

export class ContactController {
  static async send(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required.' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address.' });
      }

      await ContactService.sendContactMessage({ name, email, subject, message });

      res.status(200).json({ message: 'Message sent successfully.' });
    } catch (error) {
      next(error);
    }
  }
}
