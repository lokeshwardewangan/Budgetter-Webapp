import { z } from 'zod';
import { registry, apiResponse, emptyData, bearerAuth } from '../../shared/openapi/init.js';
import { newsletterSchema } from './admin.validator.js';

const adminUser = z.object({
  _id: z.string(),
  username: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string(),
  isVerified: z.boolean(),
  role: z.string(),
  createdAt: z.string().openapi({ format: 'date-time' }),
  lastLogin: z.string().openapi({ format: 'date-time' }).nullable(),
});

const tag = 'Admin';

registry.registerPath({
  method: 'get',
  path: '/admin/users',
  tags: [tag],
  summary: 'List all users (admin only)',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'All users',
      content: { 'application/json': { schema: apiResponse(z.array(adminUser)) } },
    },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden — admin role required' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/admin/newsletter',
  tags: [tag],
  summary: 'Send a newsletter email to a list of recipients (admin only)',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: newsletterSchema } } } },
  responses: {
    200: {
      description: 'Newsletter dispatched',
      content: { 'application/json': { schema: apiResponse(emptyData) } },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden — admin role required' },
  },
});
