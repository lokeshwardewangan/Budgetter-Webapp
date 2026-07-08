import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ContactModel from './contact.model.js';
import { sendMessageToUser } from '../../shared/email/email.service.js';
import { env } from '../../shared/config/env.js';
import { logger } from '../../shared/lib/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, '../../../public/email-template');

interface CreateContactInput {
  name: string;
  email: string;
  message: string;
}

export async function createContact({ name, email, message }: CreateContactInput) {
  const contact = await ContactModel.create({ name, email, message });

  try {
    const tplPath = path.join(TEMPLATE_DIR, 'contact-notification.html');
    const tpl = fs.readFileSync(tplPath, 'utf-8');
    const html = tpl
      .replace('{senderName}', name)
      .replace('{senderEmail}', email)
      .replace('{senderMessage}', message);

    sendMessageToUser(
      name,
      'NEWSLETTER',
      env.ADMIN_GMAIL,
      `New Contact Form Submission from ${name}`,
      '', // token is not needed for NEWSLETTER type
      html,
    ).catch((err) => {
      logger.error({ err }, 'failed to send contact form notification email to admin');
    });
  } catch (err) {
    logger.error({ err }, 'failed to read/send contact notification email template');
  }

  return contact;
}
