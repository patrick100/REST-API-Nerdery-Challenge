import dotenv from 'dotenv-safe';
import add from './math/calc';

dotenv.config();

console.log(add(1, 2));
console.log(process.env.MY_NAME);
