import { Request, Response } from 'express';
import { CategoryService } from './category.service';

export class CategoryController {
  static async list(req: Request, res: Response) {
    try {
      const payload = await CategoryService.list({
        page: Number(req.query.page ?? 1),
        limit: Number(req.query.limit ?? 50),
        search: String(req.query.search || ''),
        parent: String(req.query.parent || ''),
      });
      res.status(200).json(payload);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const category = await CategoryService.getById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ data: category });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, description, icon, image, parent, order } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Category name is required' });
      }

      const category = await CategoryService.create({
        name: name.trim(),
        description: description || '',
        icon,
        image,
        parent,
        order: order || 0,
        isActive: true,
      });

      res.status(201).json({ data: category });
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { name, description, icon, image, parent, order, isActive } = req.body;

      const updatePayload: any = {};
      if (name !== undefined) updatePayload.name = name;
      if (description !== undefined) updatePayload.description = description;
      if (icon !== undefined) updatePayload.icon = icon;
      if (image !== undefined) updatePayload.image = image;
      if (parent !== undefined) updatePayload.parent = parent;
      if (order !== undefined) updatePayload.order = order;
      if (isActive !== undefined) updatePayload.isActive = isActive;

      const category = await CategoryService.update(req.params.id, updatePayload);

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.status(200).json({ data: category });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const category = await CategoryService.delete(req.params.id);

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({ data: categories });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
