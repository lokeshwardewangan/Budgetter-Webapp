// Must come first — validates env before any module reads process.env.
import { env, isProd } from './shared/config/env.js';
import express from 'express';
import pinoHttp from 'pino-http';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import apiRouter from './routes.js';
import { errorHandler, notFoundHandler } from './shared/middleware/error.middleware.js';
import { globalLimiter } from './shared/middleware/rateLimit.middleware.js';
import { requestId } from './shared/middleware/requestId.middleware.js';
import { logger } from './shared/lib/logger.js';

const app = express();

app.set('trust proxy', env.TRUST_PROXY_HOPS);

app.use(requestId);
app.use(
  pinoHttp({
    logger,
    customProps: (req) => ({ requestId: req.id }),
    autoLogging: { ignore: (req) => req.url === '/healthz' },
  }),
);
app.use(helmet());

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
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(mongoSanitize());
app.use(express.static('public'));
app.use(cookieParser());
app.use(globalLimiter);

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to Budgetter API' });
});

app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app, isProd };
