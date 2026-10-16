import mongoose from 'mongoose';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { text, email } from './fields.js';
const schema = new mongoose.Schema({
  name: text, email: { ...email, unique: true },
  password: { type: String, required: true, select: false },
  sessionVersion: { type: Number, default: 0, select: false }
}, { collection: 'users', timestamps: { createdAt: 'created', updatedAt: 'updated' },
  toJSON: { transform(_doc, ret) { delete ret.password; delete ret.sessionVersion; delete ret.__v; return ret; } }
});
schema.pre('validate', function() {
  if (this.isModified('password') && (typeof this.password !== 'string' || this.password.length < 8 || this.password.length > 128)) {
    this.invalidate('password', 'Password must contain 8 to 128 characters.');
  }
});
schema.pre('save', function() {
  if (!this.isModified('password')) return;
  const salt = randomBytes(16).toString('hex');
  this.password = salt + ':' + scryptSync(this.password, salt, 64).toString('hex');
  if (!this.isNew) this.sessionVersion += 1;
});
schema.methods.authenticate = function(password) {
  if (typeof password !== 'string' || password.length > 128) return false;
  const [salt, hash] = this.password.split(':');
  return timingSafeEqual(Buffer.from(hash, 'hex'), scryptSync(password, salt, 64));
};
export default mongoose.model('User', schema);
