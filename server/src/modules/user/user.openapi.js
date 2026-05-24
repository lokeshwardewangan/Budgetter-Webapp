import { z } from 'zod';
import { registry, apiResponse, emptyData, bearerAuth } from '../../shared/openapi/init.js';
import { updateProfileSchema, deleteAccountSchema } from './user.validator.js';

const meDto = z.object({
  _id: z.string(),
  username: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string(),
  isVerified: z.boolean(),
  currentPocketMoney: z.number(),
  profession: z.string(),
  dob: z.string().nullable(),
  instagramLink: z.string(),
  facebookLink: z.string(),
  createdAt: z.string().openapi({ format: 'date-time' }),
  lastLogin: z.string().openapi({ format: 'date-time' }),
  currentSession: z.array(z.any()),
});

const tag = 'User';

registry.registerPath({
  method: 'get',
  path: '/users/me',
  tags: [tag],
  summary: 'Get the current user profile',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Current user',
      content: { 'application/json': { schema: apiResponse(meDto) } },
    },
    401: { description: 'Unauthorized' },
    404: { description: 'User not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/users/me',
  tags: [tag],
  summary: 'Update the current user profile',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: updateProfileSchema } } } },
  responses: {
    200: {
      description: 'Profile updated',
      content: { 'application/json': { schema: apiResponse(meDto) } },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
    404: { description: 'User not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/users/me/avatar',
  tags: [tag],
  summary: 'Upload a new avatar image',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            avatar: z.string().openapi({ type: 'string', format: 'binary' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Avatar updated',
      content: {
        'application/json': { schema: apiResponse(z.object({ avatar: z.string() })) },
      },
    },
    400: { description: 'Missing or invalid file' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/users/me',
  tags: [tag],
  summary: 'Delete the current account',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: deleteAccountSchema } } } },
  responses: {
    200: {
      description: 'Account deleted',
      content: { 'application/json': { schema: apiResponse(emptyData) } },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized or wrong password' },
    404: { description: 'User not found' },
  },
});
