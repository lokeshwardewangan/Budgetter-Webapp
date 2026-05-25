import { z } from 'zod';
import { registry, apiResponse, emptyData, bearerAuth } from '../../shared/openapi/init.js';
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  tokenQuerySchema,
  passwordResetRequestSchema,
  passwordResetSchema,
} from './auth.validator.js';

const userSummary = z.object({
  _id: z.string(),
  username: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string(),
  isVerified: z.boolean(),
});

const authData = z.object({
  user: userSummary,
  token: z.string(),
  isNewUser: z.boolean().optional(),
});

const tag = 'Auth';

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: [tag],
  summary: 'Register a new local account',
  request: { body: { content: { 'application/json': { schema: registerSchema } } } },
  responses: {
    201: {
      description: 'Account created',
      content: { 'application/json': { schema: apiResponse(authData, 201) } },
    },
    409: { description: 'Username or email already in use' },
    429: { description: 'Too many requests' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: [tag],
  summary: 'Log in with email or username + password',
  request: { body: { content: { 'application/json': { schema: loginSchema } } } },
  responses: {
    200: {
      description: 'Login successful',
      content: { 'application/json': { schema: apiResponse(authData) } },
    },
    401: { description: 'Invalid credentials' },
    404: { description: 'User does not exist' },
    429: { description: 'Too many requests' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/google',
  tags: [tag],
  summary: 'Log in or register via Google ID token',
  request: { body: { content: { 'application/json': { schema: googleLoginSchema } } } },
  responses: {
    200: {
      description: 'Login successful',
      content: { 'application/json': { schema: apiResponse(authData) } },
    },
    201: { description: 'New account created' },
    429: { description: 'Too many requests' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/logout',
  tags: [tag],
  summary: 'Invalidate the current session',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Logged out',
      content: { 'application/json': { schema: apiResponse(emptyData) } },
    },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/auth/me/verified',
  tags: [tag],
  summary: 'Check whether the current account has been email-verified',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Verified status',
      content: { 'application/json': { schema: apiResponse(z.boolean()) } },
    },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/auth/account-verification',
  tags: [tag],
  summary: 'Consume an email-verification token (link target)',
  request: { query: tokenQuerySchema },
  responses: {
    302: { description: 'Redirect to /account-verified or /account-already-verified' },
    400: { description: 'Invalid or expired token' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/password-reset/request',
  tags: [tag],
  summary: 'Email a password-reset link to the account',
  request: { body: { content: { 'application/json': { schema: passwordResetRequestSchema } } } },
  responses: {
    200: {
      description: 'Reset link sent',
      content: { 'application/json': { schema: apiResponse(emptyData) } },
    },
    404: { description: 'No account with that email' },
    429: { description: 'Too many requests' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/auth/password-reset/validate',
  tags: [tag],
  summary: 'Consume a reset link and redirect to the SPA reset form',
  request: { query: tokenQuerySchema },
  responses: {
    302: { description: 'Redirect to /reset-password/:userId' },
    400: { description: 'Invalid or expired token' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/password-reset',
  tags: [tag],
  summary: 'Set a new password (requires a pending reset request)',
  request: { body: { content: { 'application/json': { schema: passwordResetSchema } } } },
  responses: {
    200: {
      description: 'Password updated',
      content: { 'application/json': { schema: apiResponse(emptyData) } },
    },
    400: { description: 'No active reset request' },
    404: { description: 'User not found' },
    429: { description: 'Too many requests' },
  },
});
