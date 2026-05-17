import { Router } from 'express';
import { ContactController } from './contact.controller';

export const contactRoutes = Router();

contactRoutes.post('/send', ContactController.send);
