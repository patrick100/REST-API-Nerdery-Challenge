import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { signUp, signIn, verifyEmail } from '../controllers/auth.controller';

const router = express.Router();

export function authRoutes(): Router {
  router.route('/sign-up').post(asyncHandler(signUp));
  router.route('/sign-in').post(asyncHandler(signIn));
  router.route('/verify-email/:uuid/:token').post(asyncHandler(verifyEmail));
  return router;
}
