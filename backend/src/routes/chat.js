import express from 'express';
import Conversation from '../models/Conversation.js';
import Memory from '../models/Memory.js';
import Document from '../models/Document.js';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';
import { generateAI } from '../services/gemini.js';
const router = express.Router();
router.use(protect);

router.get('/conversations', async (req, res) => {
  const conversations = await Conversation.find({ user: req.user._id }).sort({ updatedAt: -1 }).limit(30);
  res.json(conversations);
});

router.post('/', async (req, res) => {
  const { message, conversationId } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });
  const [memories, docs, projects] = await Promise.all([
    Memory.find({ user: req.user._id, $text: { $search: message } }).limit(8).catch(() => Memory.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(8)),
    Document.find({ user: req.user._id, $text: { $search: message } }).limit(5).catch(() => Document.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5)),
    Project.find({ user: req.user._id }).limit(8)
  ]);
  const context = `USER MEMORIES:\n${memories.map(m=>`- ${m.title}: ${m.content}`).join('\n')}\n\nDOCUMENTS:\n${docs.map(d=>`- ${d.name}: ${d.summary || d.text?.slice(0,1000)}`).join('\n')}\n\nPROJECTS:\n${projects.map(p=>`- ${p.name}: ${p.description} Tasks:${p.tasks?.map(t=>t.title).join(', ')}`).join('\n')}`;
  const prompt = `You are Synapse AI, a professional personal digital brain and founder-level AI operating assistant. Answer with clear structure, useful action steps, and cite which memory/document/project informed the answer when possible.\n\n${context}\n\nUser question: ${message}`;
  const answer = await generateAI(prompt);
  let convo = conversationId ? await Conversation.findOne({ _id: conversationId, user: req.user._id }) : null;
  if (!convo) convo = await Conversation.create({ user: req.user._id, title: message.slice(0, 60), messages: [] });
  convo.messages.push({ role: 'user', content: message }, { role: 'assistant', content: answer });
  await convo.save();
  res.json({ answer, conversation: convo });
});
export default router;
