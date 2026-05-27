import pino from 'pino';
import { env, isProd } from '../config/env.js';

export const logger = pino({
  level: isProd ? 'info' : 'debug',
  base: { env: env.NODE_ENV },
  // Pretty output in dev; JSON in prod for log aggregators.
  transport: isProd
    ? undefined
    : { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss.l' } },
});
