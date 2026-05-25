import { z } from 'zod';
import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// Reusable Bearer-auth scheme — endpoints reference this by name.
export const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// Wraps a payload schema in the ApiResponse envelope used by every endpoint.
export const apiResponse = (dataSchema, statusCode = 200) =>
  z.object({
    statusCode: z.number().openapi({ example: statusCode }),
    success: z.boolean().openapi({ example: true }),
    message: z.string(),
    data: dataSchema,
  });

export const emptyData = z.null().openapi({ example: null });
