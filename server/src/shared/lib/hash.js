import crypto from 'crypto';

export const sha256 = (input) => crypto.createHash('sha256').update(input).digest('hex');
