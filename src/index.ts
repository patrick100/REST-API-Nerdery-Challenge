import dotenv from 'dotenv-safe';
import add from './math/calc';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

const swaggerSpec = require('./docs/configuration');

//dotenv.config();

//console.log(add(1, 2));
//console.log(process.env.MY_NAME);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/sign-in', (req, res) => {
  res.status(201).json({ token: 'mytoken' });
});

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT: string = process.env.PORT || '3000';

app.listen(PORT, () => {
  console.log(`'Listening on port '${PORT}`);
});
