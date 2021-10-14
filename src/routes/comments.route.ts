import express, { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { find, create, update, deleteComment } from '../controllers/comments.controller';

const router = express.Router();

export function commentsRoutes(): Router {
  router.route('/posts/:postuuid/comments').get(find);
  router.route('/posts/:postuuid/comments').post(create);
  router.route('/posts/:postuuid/comments/:uuid').patch(update);
  router.route('/accounts/me/posts/:postuuid/comments/:uuid').delete(deleteComment);
  router.route('/accounts/:accountuuid/posts/:postuuid/comments/:uuid').delete(deleteComment);

  return router;
}
