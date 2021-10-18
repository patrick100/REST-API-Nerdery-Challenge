import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { reportPost, reportComment } from '../controllers/reports.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = express.Router();

export function reportsRoutes(): Router {
  router.route('/posts/:postId/reports').post(verifyToken, asyncHandler(reportPost));
  router
    .route('/posts/:postId/comments/:commentId/reports')
    .post(verifyToken, asyncHandler(reportComment));

  return router;
}
