import dotenv from 'dotenv';
dotenv.config();

const production = 'https://blog-api-challenge-ravn.herokuapp.com';
const development = 'http://localhost:3000';
export const ENVIROMENT = process.env.NODE_ENV || 'development';
export const URL_BASE = process.env.NODE_ENV === 'development' ? development : production;
export const PORT = process.env.PORT || '3000';
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const SENDER_EMAIL = process.env.SENDER_EMAIL || '';
