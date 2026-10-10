import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['note','email','meeting','research','task','idea'], default: 'note' },
  content: { type: String, required: true },
  tags: [{ type: String }],
  importance: { type: Number, default: 3 },
  source: { type: String, default: 'manual' }
}, { timestamps: true });

memorySchema.index({ title: 'text', content: 'text', tags: 'text' });
export default mongoose.model('Memory', memorySchema);
