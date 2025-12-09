import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Task } from '../entities/Task';
import { Category } from '../entities/Category';

const router = Router();

// GET /api/tasks - Get all tasks
router.get('/', async (req: Request, res: Response) => {
  try {
    const { categoryId, search } = req.query as { categoryId?: string; search?: string };
    const taskRepository = AppDataSource.getRepository(Task);

    const queryBuilder = taskRepository.createQueryBuilder('task').leftJoinAndSelect('task.category', 'category').orderBy('task.createdAt', 'DESC');

    if (categoryId && typeof categoryId === 'string' && categoryId.trim().length > 0 && categoryId.toLowerCase() !== 'all') {
      queryBuilder.andWhere('task.categoryId = :categoryId', { categoryId: parseInt(categoryId, 10) });
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const like = `%${search.trim()}%`;
      queryBuilder.andWhere('(task.title LIKE :like OR task.description LIKE :like OR category.name LIKE :like)', { like });
    }

    const tasks = await queryBuilder.getMany();
    return res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /api/tasks/:id - Get a single task
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOne({
      where: { id: parseInt(req.params.id, 10) },
      relations: ['category'],
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, completed, categoryId } = req.body as {
      title?: string;
      description?: string | null;
      completed?: boolean;
      categoryId?: number | null;
    };

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const taskRepository = AppDataSource.getRepository(Task);
    let category: Category | null = null;
    if (categoryId !== undefined) {
      if (categoryId === null) {
        category = null;
      } else if (Number.isFinite(categoryId)) {
        const repo = AppDataSource.getRepository(Category);
        category = await repo.findOne({ where: { id: categoryId } });
        if (!category) {
          return res.status(400).json({ error: 'Category not found' });
        }
      } else {
        return res.status(400).json({ error: 'Category must be a number' });
      }
    }
    const task = taskRepository.create({
      title: title.trim(),
      description: description?.trim(),
      category: category ?? null,
      completed: completed ?? false,
    });

    const savedTask = await taskRepository.save(task);
    // Reload with relations to return complete data
    const taskWithRelations = await taskRepository.findOne({
      where: { id: savedTask.id },
      relations: ['category'],
    });
    return res.status(201).json(taskWithRelations || savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOne({
      where: { id: parseInt(req.params.id, 10) },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, completed, categoryId } = req.body as {
      title?: string;
      description?: string | null;
      completed?: boolean;
      categoryId?: number | null;
    };

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'Title must be a non-empty string' });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description === null || description === '' ? null : description.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean' });
      }
      task.completed = completed;
    }

    if (categoryId !== undefined) {
      if (categoryId === null) {
        task.category = null;
      } else if (Number.isFinite(categoryId)) {
        const repo = AppDataSource.getRepository(Category);
        const category = await repo.findOne({ where: { id: categoryId } });
        if (!category) {
          return res.status(400).json({ error: 'Category not found' });
        }
        task.category = category;
      } else {
        return res.status(400).json({ error: 'Category must be a number' });
      }
    }

    const updatedTask = await taskRepository.save(task);
    // Reload with relations to return complete data
    const taskWithRelations = await taskRepository.findOne({
      where: { id: updatedTask.id },
      relations: ['category'],
    });
    return res.json(taskWithRelations || updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOne({
      where: { id: parseInt(req.params.id, 10) },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await taskRepository.remove(task);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
