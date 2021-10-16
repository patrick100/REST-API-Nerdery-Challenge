import { verifyToken, verifyModerator } from './../middlewares/auth.middleware';
import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
  find,
  create,
  update,
  deleteComment,
  deleteCommentByMod,
} from '../controllers/comments.controller';

const router = express.Router();

export function commentsRoutes(): Router {
  router.route('/posts/:postId/comments').get(asyncHandler(find));
  router.route('/posts/:postId/comments').post(verifyToken, asyncHandler(create));
  router.route('/posts/:postId/comments/:id').patch(verifyToken, asyncHandler(update));
  router
    .route('/accounts/me/posts/:postId/comments/:id')
    .delete(verifyToken, asyncHandler(deleteComment));
  router
    .route('/accounts/:accountuuid/posts/:postuuid/comments/:uuid')
    .delete([verifyToken, verifyModerator], asyncHandler(deleteCommentByMod));

  return router;
}
