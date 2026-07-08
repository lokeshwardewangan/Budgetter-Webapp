import { z } from 'zod';
import { registry, apiResponse } from '../../shared/openapi/init.js';
import { createContactSchema } from './contact.validator.js';

const tag = 'Contact';

registry.registerPath({
  method: 'post',
  path: '/contacts',
  tags: [tag],
  summary: 'Submit a contact message',
  request: { body: { content: { 'application/json': { schema: createContactSchema } } } },
  responses: {
    201: {
      description: 'Message sent successfully',
      content: {
        'application/json': {
          schema: apiResponse(z.null(), 201),
        },
      },
    },
    400: { description: 'Validation error' },
  },
});
