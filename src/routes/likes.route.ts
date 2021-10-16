import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
  giveLikeComment,
  giveLikePost,
  removeLikePost,
  removeLikeComment,
} from '../controllers/likes.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = express.Router();

export function likesRoutes(): Router {
  router
    .route('/posts/:postId/likes')
    .patch(verifyToken, asyncHandler(giveLikePost))
    .delete(verifyToken, asyncHandler(removeLikePost));
  router
    .route('/posts/:postId/comments/:commentId/likes')
    .patch(verifyToken, asyncHandler(giveLikeComment))
    .delete(verifyToken, asyncHandler(removeLikeComment));

  return router;
}
