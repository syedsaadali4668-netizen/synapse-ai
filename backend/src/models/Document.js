import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  originalName: String,
  mimeType: String,
  size: Number,
  text: String,
  summary: String,
  path: String,
  tags: [{ type: String }]
}, { timestamps: true });

documentSchema.index({ name: 'text', text: 'text', summary: 'text', tags: 'text' });
export default mongoose.model('Document', documentSchema);
