import UserModel from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { sendMessageToUser } from '../utils/EmailSend.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function listAllUsers() {
  return UserModel.find().select('-password').lean();
}

export async function sendNewsletter({ emails, subject, html }) {
  if (!Array.isArray(emails) || emails.length === 0) {
    throw new ApiError(400, 'emails must be a non-empty array');
  }
  const invalid = emails.filter((e) => !EMAIL_REGEX.test(e));
  if (invalid.length) {
    throw new ApiError(400, `Invalid email format: ${invalid.join(', ')}`);
  }
  if (typeof subject !== 'string' || subject.trim().length === 0) {
    throw new ApiError(400, 'subject must be a non-empty string');
  }
  if (subject.length > 50) {
    throw new ApiError(400, 'subject cannot exceed 50 characters');
  }
  if (typeof html !== 'string' || html.trim().length === 0) {
    throw new ApiError(400, 'html must be a non-empty string');
  }
  const lower = html.toLowerCase();
  if (!lower.includes('<!doctype html>') && !lower.startsWith('<html')) {
    throw new ApiError(400, 'html must start with <!doctype html> or <html');
  }

  const ok = await sendMessageToUser(null, 'NEWSLETTER', emails, subject, null, html);
  if (!ok) throw new ApiError(500, 'Failed to send newsletter emails');
  return { recipients: emails.length };
}
