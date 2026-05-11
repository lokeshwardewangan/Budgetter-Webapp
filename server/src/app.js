import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();

app.set('trust proxy', true);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /\.lokeshwardewangan\.in$/.test(origin) || /\.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Budgetter API' });
});

// Liveness probe for container HEALTHCHECK — must stay cheap and unauthenticated.
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
