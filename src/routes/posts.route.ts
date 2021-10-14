import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
  find,
  create,
  findOne,
  findUserPosts,
  update,
  deletePost,
  findMyPosts,
} from '../controllers/posts.controller';

const router = express.Router();

export function postsRoutes(): Router {
  router.route('/posts').get(asyncHandler(find)).post(create);
  router.route('/posts/:uuid').get(asyncHandler(findOne)).patch(update);
  router.route('/accounts/me/posts').get(asyncHandler(findMyPosts));
  router.route('/accounts/:accountUuid/posts').get(asyncHandler(findUserPosts));
  router.route('/accounts/:accountUuid/posts/:uuid').delete(asyncHandler(deletePost));
  router.route('/accounts/me/posts/:uuid').delete(asyncHandler(deletePost));

  return router;
}
