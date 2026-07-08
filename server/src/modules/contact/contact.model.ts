import mongoose, { Schema } from 'mongoose';

export interface IContact {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

ContactSchema.index({ createdAt: -1 });

const Contact = mongoose.model<IContact>('Contact', ContactSchema);
export default Contact;
