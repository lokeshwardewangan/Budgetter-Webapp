import { nanoid } from 'nanoid';

// Honors an inbound `x-request-id` (from gateway/LB) or mints a new one.
// Available as req.id; surfaced in response headers for client-side correlation.
export const requestId = (req, res, next) => {
  const id = req.header('x-request-id') || nanoid(12);
  req.id = id;
  res.setHeader('x-request-id', id);
  next();
};
