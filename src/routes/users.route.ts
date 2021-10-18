import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { me, findOne, updatePublicInfo } from '../controllers/users.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = express.Router();

export function usersRoutes(): Router {
  router.route('/me').get(verifyToken, asyncHandler(me));
  router.route('/:uuid').get(asyncHandler(findOne));
  router.route('/').patch(verifyToken, asyncHandler(updatePublicInfo));

  return router;
}
