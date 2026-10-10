import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({ role: String, content: String, createdAt: { type: Date, default: Date.now } });
const conversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Conversation' },
  messages: [messageSchema]
}, { timestamps: true });
export default mongoose.model('Conversation', conversationSchema);
