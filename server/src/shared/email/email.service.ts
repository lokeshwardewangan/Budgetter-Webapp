import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { logger } from '../lib/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_DIR = path.join(__dirname, '../../../public/email-template');

const readTemplate = (filename: string): string =>
  fs.readFileSync(path.join(TEMPLATE_DIR, filename), 'utf-8');

export type EmailType = 'RESET_PASSWORD' | 'VERIFY_ACCOUNT' | 'DELETE_ACCOUNT' | 'NEWSLETTER';

const sendMessageToUser = async (
  userName: string,
  type: EmailType,
  userEmail: string | string[],
  subject: string,
  token: string,
  html: string | null = null,
): Promise<boolean> => {
  const serverURL = process.env.SERVER_URL;

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

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'message.reponse.web@gmail.com',
        pass: process.env.GMAIL_PASSKEY,
      },
    });

    const mailOptions = {
      from: 'message.reponse.web@gmail.com',
      to: Array.isArray(userEmail) ? userEmail.join(',') : userEmail,
      subject: `${subject} 🚀`,
      bcc: process.env.ADMIN_GMAIL,
      html: customizedHTML,
    };

    await transporter.sendMail(mailOptions);
    logger.info({ to: userEmail, type }, 'email sent');
    return true;
  } catch (err) {
    logger.error({ err, to: userEmail, type }, 'email send failed');
    return false;
  }
};

export { sendMessageToUser };
