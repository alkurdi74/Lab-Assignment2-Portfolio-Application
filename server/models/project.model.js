import mongoose from 'mongoose';
import { portfolioFields } from './fields.js';
export default mongoose.model('Project', new mongoose.Schema(portfolioFields, { collection: 'projects' }));
