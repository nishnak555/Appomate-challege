import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Task } from '../entities/Task';

const router = Router();

// GET /api/tasks - Get all tasks
router.get('/', async (req: Request, res: Response) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const tasks = await taskRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
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
    const { title, description, completed } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const taskRepository = AppDataSource.getRepository(Task);
    const task = taskRepository.create({
      title: title.trim(),
      description: description?.trim(),
      completed: completed ?? false,
    });

    const savedTask = await taskRepository.save(task);
    return res.status(201).json(savedTask);
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

    const { title, description, completed } = req.body;

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

    const updatedTask = await taskRepository.save(task);
    return res.json(updatedTask);
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
