import { Request, Response } from 'express';
import os from 'os';
import { unlink } from 'fs/promises';
import { ProductService } from './product.service';
import { uploadImage } from '../../utils/cloudinary';

function normalizeSlug(value: string) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseVariants(raw: any): any[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return [];
}

function parseSpecs(raw: any): Array<{ key: string; value: string }> {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

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

  static async adminList(req: Request, res: Response) {
    const payload = await ProductService.adminList({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 24),
      search: String(req.query.search || ''),
      category: String(req.query.category || ''),
      sort: String(req.query.sort || ''),
    });
    res.status(200).json(payload);
  }

  static async getProductById(req: Request, res: Response) {
    const product = await ProductService.getById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ data: product });
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
    const body = req.body as any;
    const files = (req as any).files as Express.Multer.File[] | undefined;

    const productPayload: any = {
      name: body.name,
      slug: body.name ? normalizeSlug(body.name) : undefined,
      description: body.description,
      price: Number(body.price) || 0,
      oldPrice: body.oldPrice ? Number(body.oldPrice) : undefined,
      sku: body.sku,
      category: body.category,
      status: body.status || 'active',
      stock: Number(body.stock ?? 0),
      inventory: Number(body.stock ?? 0),
      variants: parseVariants(body.variants),
      specs: parseSpecs(body.specs ?? body.specifications),
    };

    if (files?.length) {
      const imageUrls: string[] = [];
      for (const file of files) {
        const uploadResult = await uploadImage(file.path, 'hilop/products');
        if (uploadResult.secure_url) imageUrls.push(uploadResult.secure_url);
        await unlink(file.path).catch(() => null);
      }
      productPayload.images = imageUrls;
    }

    const product = await ProductService.create(productPayload);
    if (!product) return res.status(400).json({ message: 'Failed to create product' });
    res.status(201).json({ data: product });
  }

  static async updateProduct(req: Request, res: Response) {
    const body = req.body as any;
    const files = (req as any).files as Express.Multer.File[] | undefined;

    const updatePayload: any = {
      name: body.name,
      slug: body.name ? normalizeSlug(body.name) : undefined,
      description: body.description,
      price: body.price !== undefined ? Number(body.price) : undefined,
      oldPrice: body.oldPrice ? Number(body.oldPrice) : undefined,
      sku: body.sku,
      category: body.category,
      status: body.status,
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
      inventory: body.stock !== undefined ? Number(body.stock) : undefined,
      variants: parseVariants(body.variants),
      specs: parseSpecs(body.specs ?? body.specifications),
    };

    // Handle images: upload new files, then merge with kept existing images
    let existingImages: string[] = [];
    if (body.existingImages) {
      existingImages = Array.isArray(body.existingImages)
        ? body.existingImages
        : [body.existingImages];
    } else if (Array.isArray(body.images)) {
      existingImages = body.images;
    }

    if (files?.length) {
      const newUrls: string[] = [];
      for (const file of files) {
        const uploadResult = await uploadImage(file.path, 'hilop/products');
        if (uploadResult.secure_url) newUrls.push(uploadResult.secure_url);
        await unlink(file.path).catch(() => null);
      }
      updatePayload.images = [...existingImages, ...newUrls];
    } else {
      updatePayload.images = existingImages;
    }

    // Remove undefined keys so mongoose doesn't overwrite with undefined
    Object.keys(updatePayload).forEach((k) => updatePayload[k] === undefined && delete updatePayload[k]);

    const product = await ProductService.update(req.params.id, updatePayload);
    if (!product) return res.status(404).json({ message: 'Product not found' });
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
  // Featured-related controller methods removed
}
