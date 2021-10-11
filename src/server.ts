import 'reflect-metadata';
import dotenv from 'dotenv-safe';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors, { CorsOptions } from 'cors';
import createHttpError, { HttpError } from 'http-errors';
import { PrismaClient } from '@prisma/client';
import { router } from './router';

dotenv.config();

export const prisma = new PrismaClient({
  rejectOnNotFound: error => new createHttpError.NotFound(error.message),
});

const app = express();
const PORT: string = process.env.PORT || '3000';
const ENVIROMENT = process.env.NODE_ENV || 'development';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const whiteList = ['http://localhost:3000'];
const corsOptionsDelegate = function handler(
  req: Request,
  callback: (err: Error | null, options?: CorsOptions) => void
) {
  const corsOptions: { origin: boolean } = { origin: false };

  if (whiteList.indexOf(req.header('Origin') ?? '') !== -1) {
    corsOptions.origin = true;
  }

  callback(null, corsOptions);
};

function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  if (ENVIROMENT !== 'development') {
    // eslint-disable-next-line no-console
    console.error(err.message);
    // eslint-disable-next-line no-console
    console.error(err.stack || '');
  }

  res.status(err.status ?? 500);
  res.json(err);
}

app.use(cors(corsOptionsDelegate));
app.use('/', router(app));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
