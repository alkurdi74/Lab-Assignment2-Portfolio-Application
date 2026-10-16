import mongoose from 'mongoose';
import { text, email } from './fields.js';
export default mongoose.model('Contact', new mongoose.Schema({
  firstname: text, lastname: text, email,
  phone: { type: String, trim: true, maxlength: 30 },
  message: { type: String, trim: true, maxlength: 2000 }
}, { collection: 'contacts' }));
