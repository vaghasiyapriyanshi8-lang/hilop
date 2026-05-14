import { OrderModel } from '../orders/order.model';
import { UserModel } from '../users/user.model';
import { ProductModel } from '../products/product.model';

export class AnalyticsService {
  static async overview() {
    const totalOrders = await OrderModel.countDocuments();
    const totalUsers = await UserModel.countDocuments();
    const totalProducts = await ProductModel.countDocuments();

    const revenueResult = await OrderModel.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);
    const revenue = revenueResult[0]?.totalRevenue || 0;
    const conversionRate = totalUsers ? Number(((totalOrders / totalUsers) * 100).toFixed(2)) : 0;

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);

    const revenueDataPipeline = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', revenue: 1 } },
    ]);

    const revenueData = [] as Array<{ date: string; revenue: number }>;
    for (let i = 0; i < 7; i += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().slice(0, 10);
      const bucket = revenueDataPipeline.find((item) => item.date === dateString);
      revenueData.push({ date: dateString, revenue: bucket?.revenue || 0 });
    }

    const categorySalesPipeline = await OrderModel.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          quantity: { $sum: '$items.quantity' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, category: '$_id', revenue: 1, quantity: 1 } },
    ]);

    return {
      revenue,
      orders: totalOrders,
      activeUsers: totalUsers,
      totalProducts,
      conversionRate,
      revenueData,
      topSellingCategories: categorySalesPipeline.map((item) => item.category),
      categorySales: categorySalesPipeline.map((item) => ({ category: item.category, sales: item.revenue })),
    };
  }
}
