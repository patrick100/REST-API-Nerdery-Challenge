import { verifyToken } from './../middlewares/auth.middleware';
import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
  find,
  create,
  findOne,
  findUserPosts,
  update,
  deletePostByMod,
  findMyPosts,
  deleteMyPost,
} from '../controllers/posts.controller';

const router = express.Router();

export function postsRoutes(): Router {
  router.route('/posts').get(asyncHandler(find)).post(verifyToken, asyncHandler(create));
  router.route('/posts/:id').get(asyncHandler(findOne)).patch(update);
  router.route('/accounts/me/posts').get(verifyToken, asyncHandler(findMyPosts));
  router.route('/accounts/:accountId/posts').get(asyncHandler(findUserPosts));
  router.route('/accounts/me/posts/:id').delete(verifyToken, asyncHandler(deleteMyPost));
  router.route('/accounts/:accountId/posts/:id').delete(asyncHandler(deletePostByMod));

  return router;
}
