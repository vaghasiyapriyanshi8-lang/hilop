export class AnalyticsService {
  static async overview() {
    return {
      revenue: 1450000,
      orders: 6200,
      activeUsers: 2900,
      conversionRate: 7.4,
      topSellingCategories: ['Chronograph', 'Dress', 'Sport'],
    };
  }
}
