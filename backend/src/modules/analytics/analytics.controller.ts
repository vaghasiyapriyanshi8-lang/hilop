import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

export class AnalyticsController {
  static async overview(_req: Request, res: Response) {
    const metrics = await AnalyticsService.overview();
    res.status(200).json({ data: metrics });
  }
}
