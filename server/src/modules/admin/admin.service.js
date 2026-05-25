import { StatusCodes } from 'http-status-codes';
import UserModel from '../user/user.model.js';
import { ApiError } from '../../shared/lib/ApiError.js';
import { sendMessageToUser } from '../../shared/email/email.service.js';

export async function listAllUsers() {
  return UserModel.find().select('-password').lean();
}

export async function sendNewsletter({ emails, subject, html }) {
  const ok = await sendMessageToUser(null, 'NEWSLETTER', emails, subject, null, html);
  if (!ok)
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send newsletter emails');
  return { recipients: emails.length };
}
