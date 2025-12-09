import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Category } from '../entities/Category';

const router = Router();

// GET /api/categories - list all categories
router.get('/', async (_req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Category);
    const categories = await repo.find({ order: { name: 'ASC' } });
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories - create a category
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body as { name?: string };
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const repo = AppDataSource.getRepository(Category);
    const existing = await repo.findOne({ where: { name: name.trim() } });
    if (existing) {
      return res.status(409).json({ error: 'Category already exists' });
    }

    const category = repo.create({ name: name.trim() });
    const saved = await repo.save(category);
    return res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ error: 'Failed to create category' });
  }
});

export default router;



