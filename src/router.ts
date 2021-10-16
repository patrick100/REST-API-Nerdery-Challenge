import express, { Router } from 'express';
import { usersRoutes } from './routes/users.route';
import { authRoutes } from './routes/auth.route';
import { likesRoutes } from './routes/likes.route';
import swaggerUi from 'swagger-ui-express';
const expressRouter = express.Router();
import swaggerSpec from './docs/configuration';

export function router(app: Router): Router {
  app.use('/api/v1/accounts', usersRoutes());
  app.use('/', authRoutes());
  app.use('/api/v1', likesRoutes());
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  return expressRouter;
}
