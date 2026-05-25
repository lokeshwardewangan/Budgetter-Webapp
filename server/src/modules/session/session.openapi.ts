import { z } from 'zod';
import { registry, apiResponse, emptyData, bearerAuth } from '../../shared/openapi/init.js';

const sessionShape = z.object({
  _id: z.string(),
  ip: z.string(),
  userAgent: z.string(),
  lastUsedAt: z.string().openapi({ format: 'date-time' }),
  createdAt: z.string().openapi({ format: 'date-time' }),
});

const tag = 'Sessions';

registry.registerPath({
  method: 'get',
  path: '/sessions',
  tags: [tag],
  summary: 'List active sessions for the current user',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Active sessions',
      content: { 'application/json': { schema: apiResponse(z.array(sessionShape)) } },
    },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/sessions',
  tags: [tag],
  summary: 'Revoke all sessions except the current one',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Other sessions removed',
      content: { 'application/json': { schema: apiResponse(emptyData) } },
    },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/sessions/{sessionId}',
  tags: [tag],
  summary: 'Revoke a specific session by id',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({
      sessionId: z.string().openapi({ example: '507f1f77bcf86cd799439011' }),
    }),
  },
  responses: {
    200: {
      description: 'Session removed',
      content: { 'application/json': { schema: apiResponse(emptyData) } },
    },
    400: { description: 'Invalid session id' },
    401: { description: 'Unauthorized' },
    404: { description: 'Session not found' },
  },
});
