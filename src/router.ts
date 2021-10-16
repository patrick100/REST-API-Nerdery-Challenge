import express, { Router } from 'express';
import { usersRoutes } from './routes/users.route';
import { postsRoutes } from './routes/posts.route';
import { authRoutes } from './routes/auth.route';
import { likesRoutes } from './routes/likes.route';
import swaggerUi from 'swagger-ui-express';
import { commentsRoutes } from './routes/comments.route';
import { reportsRoutes } from './routes/reports.route';
const expressRouter = express.Router();
import swaggerSpec from './docs/configuration';

export function router(app: Router): Router {
  app.use('/api/v1', postsRoutes());
  app.use('/api/v1', commentsRoutes());
  app.use('/api/v1/accounts', usersRoutes());
  app.use('/api/v1', authRoutes());
  app.use('/api/v1', likesRoutes());
  app.use('/api/v1', reportsRoutes());
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  return expressRouter;
}
