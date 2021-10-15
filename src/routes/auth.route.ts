import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
  signUp,
  signIn,
  signOut,
  verifyEmail,
  passwordReset,
  verifyPasswordReset,
} from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = express.Router();

export function authRoutes(): Router {
  router.route('/sign-up').post(asyncHandler(signUp));
  router.route('/sign-in').post(asyncHandler(signIn));
  router.route('/sign-out').delete([verifyToken], asyncHandler(signOut));
  router.route('/verify-email/:uuid/:token').patch(asyncHandler(verifyEmail));
  router.route('/password-reset').patch(asyncHandler(passwordReset));
  router.route('/password-reset/:uuid/:token').patch(asyncHandler(verifyPasswordReset));

  return router;
}
