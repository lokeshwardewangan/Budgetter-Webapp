import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './init.js';
// Side-effect imports — each module registers its paths when loaded.
import '../../modules/auth/auth.openapi.js';
import '../../modules/user/user.openapi.js';
import '../../modules/session/session.openapi.js';
import '../../modules/expense/expense.openapi.js';
import '../../modules/pocketMoney/pocketMoney.openapi.js';
import '../../modules/lentMoney/lentMoney.openapi.js';
import '../../modules/report/report.openapi.js';
import '../../modules/admin/admin.openapi.js';

export const buildOpenApiDocument = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Budgetter API',
      version: '2.0.0',
      description: 'Personal-finance tracking API. JWT auth via `Authorization: Bearer <token>`.',
    },
    servers: [{ url: '/api', description: 'Current host' }],
  });
};
