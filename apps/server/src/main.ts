import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { AppDataSource } from './data-source';
import tasksRouter from './routes/tasks';
import categoriesRouter from './routes/categories';

const app = express();

// CORS middleware - allow requests from webapp
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Health check endpoint
app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to server!' });
});

// Tasks API routes
app.use('/api/tasks', tasksRouter);
app.use('/api/categories', categoriesRouter);

const port = process.env.PORT || 3333;

// Initialize TypeORM and start server
async function startServer() {
  try {
    // Initialize TypeORM data source
    await AppDataSource.initialize();
    console.log('Database initialized successfully');

    // Start Express server
    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });

    server.on('error', console.error);

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await AppDataSource.destroy();
        console.log('Database connection closed');
      });
    });
  } catch (error) {
    console.error('Error during server startup:', error);
    process.exit(1);
  }
}

startServer();
