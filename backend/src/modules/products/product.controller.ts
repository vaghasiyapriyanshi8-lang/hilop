import { Request, Response } from 'express';
import { ProductService } from './product.service';

export class ProductController {
  static async list(req: Request, res: Response) {
    const payload = await ProductService.list({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 24),
      search: String(req.query.search || ''),
      category: String(req.query.category || ''),
      sort: String(req.query.sort || ''),
    });
    res.status(200).json(payload);
  }

  static async search(req: Request, res: Response) {
    const payload = await ProductService.list({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 24),
      search: String(req.query.q || ''),
      sort: String(req.query.sort || ''),
    });
    res.status(200).json(payload);
  }

  static async getProduct(req: Request, res: Response) {
    const product = await ProductService.getBySlug(req.params.slug);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ data: product });
  }

  static async createProduct(req: Request, res: Response) {
    const product = await ProductService.create(req.body);
    res.status(201).json({ data: product });
  }

  static async updateProduct(req: Request, res: Response) {
    const product = await ProductService.update(req.params.id, req.body);
    res.status(200).json({ data: product });
  }

  static async deleteProduct(req: Request, res: Response) {
    await ProductService.delete(req.params.id);
    res.status(204).send();
  }

  static async getCategories(req: Request, res: Response) {
    const categories = await ProductService.getCategories();
    res.status(200).json({ data: categories });
  }
}
