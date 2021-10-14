import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { signUp, signIn, signOut, verifyEmail } from '../controllers/auth.controller';
import { verifyToken, verifyModerator } from '../middleware/auth.middleware';

const router = express.Router();

export function authRoutes(): Router {
  router.route('/sign-up').post(asyncHandler(signUp));
  router.route('/sign-in').post(asyncHandler(signIn));
  router.route('/sign-out').delete([verifyToken], asyncHandler(signOut));
  router.route('/verify-email/:uuid/:token').post(asyncHandler(verifyEmail));

  return router;
}
