import express from 'express';
import Memory from '../models/Memory.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  const q = req.query.q;
  const filter = q ? { user: req.user._id, $text: { $search: q } } : { user: req.user._id };
  const memories = await Memory.find(filter).sort({ createdAt: -1 }).limit(80);
  res.json(memories);
});
router.post('/', async (req, res) => {
  const memory = await Memory.create({ ...req.body, user: req.user._id });
  res.status(201).json(memory);
});
router.put('/:id', async (req, res) => {
  const memory = await Memory.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
  res.json(memory);
});
router.delete('/:id', async (req, res) => {
  await Memory.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ ok: true });
});
export default router;
