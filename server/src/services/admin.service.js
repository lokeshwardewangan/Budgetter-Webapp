import UserModel from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { sendMessageToUser } from '../utils/EmailSend.js';

export async function listAllUsers() {
  return UserModel.find().select('-password').lean();
}

export async function sendNewsletter({ emails, subject, html }) {
  const ok = await sendMessageToUser(null, 'NEWSLETTER', emails, subject, null, html);
  if (!ok) throw new ApiError(500, 'Failed to send newsletter emails');
  return { recipients: emails.length };
}
