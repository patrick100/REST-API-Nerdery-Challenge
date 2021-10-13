import express, { Router } from 'express';
import { usersRoutes } from './routes/users.route';
import { postsRoutes } from './routes/posts.route';
import swaggerUi from 'swagger-ui-express';
const expressRouter = express.Router();
const swaggerSpec = require('../docs/configuration');

export function router(app: Router): Router {
  app.use('/api/v1/users', usersRoutes());
  app.use('/api/v1', postsRoutes());
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  return expressRouter;
}
