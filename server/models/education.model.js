import mongoose from 'mongoose';
import { portfolioFields } from './fields.js';
export default mongoose.model('Education', new mongoose.Schema(portfolioFields, { collection: 'qualifications' }));
