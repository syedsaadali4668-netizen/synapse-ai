import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({ title: String, done: { type: Boolean, default: false } });
const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['active','paused','completed'], default: 'active' },
  tasks: [taskSchema]
}, { timestamps: true });
export default mongoose.model('Project', projectSchema);
