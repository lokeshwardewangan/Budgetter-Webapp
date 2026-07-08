import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import { logger } from '../lib/logger.js';
import { env } from '../config/env.js';
import { SOCIAL_LINKS } from '../lib/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_DIR = path.join(__dirname, '../../../public/email-template');

const readTemplate = (filename: string): string =>
  fs.readFileSync(path.join(TEMPLATE_DIR, filename), 'utf-8');

export type EmailType = 'RESET_PASSWORD' | 'VERIFY_ACCOUNT' | 'DELETE_ACCOUNT' | 'NEWSLETTER';

const resend = new Resend(env.RESEND_API_KEY);

const sendMessageToUser = async (
  userName: string,
  type: EmailType,
  userEmail: string | string[],
  subject: string,
  token: string,
  html: string | null = null,
): Promise<boolean> => {
  if (env.NODE_ENV === 'test') {
    logger.info({ to: userEmail, type }, 'email sending mocked in test environment');
    return true;
  }

  const serverURL = env.SERVER_URL;

  let customizedHTML: string;
  if (type === 'RESET_PASSWORD') {
    const tpl = readTemplate('reset-password-template.html');
    const link = `${serverURL}/api/auth/password-reset/validate?token=${token}`;
    customizedHTML = tpl.replace('{link}', link).replace('{userName}', userName);
  } else if (type === 'VERIFY_ACCOUNT') {
    const tpl = readTemplate('account-verification.html');
    const link = `${serverURL}/api/auth/account-verification?token=${token}`;
    customizedHTML = tpl.replace('{link}', link).replace('{userName}', userName);
  } else if (type === 'DELETE_ACCOUNT') {
    const tpl = readTemplate('account-delete.html');
    customizedHTML = tpl.replace('{userName}', userName);
  } else if (type === 'NEWSLETTER') {
    customizedHTML = html ?? '';
  } else {
    logger.warn({ type }, 'invalid email type');
    return false;
  }

  customizedHTML = customizedHTML
    .replaceAll('https://x.com/@LokeshwarPras17', SOCIAL_LINKS.twitter)
    .replaceAll('https://www.linkedin.com/in/lokeshwar-dewangan-7b2163211/', SOCIAL_LINKS.linkedin)
    .replaceAll('https://www.instagram.com/lokeshwarprasad1', SOCIAL_LINKS.instagram);

  try {
    const to = Array.isArray(userEmail) ? userEmail : [userEmail];
    const bcc = env.ADMIN_GMAIL ? [env.ADMIN_GMAIL] : undefined;

    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to,
      subject: `${subject} 🚀`,
      bcc,
      html: customizedHTML,
    });

    if (error) {
      logger.error({ error, to: userEmail, type }, 'Resend SDK error sending email');
      return false;
    }

    logger.info({ to: userEmail, type, resendId: data?.id }, 'email sent via Resend SDK');
    return true;
  } catch (err) {
    logger.error({ err, to: userEmail, type }, 'email send failed via Resend SDK');
    return false;
  }
};

export { sendMessageToUser };
