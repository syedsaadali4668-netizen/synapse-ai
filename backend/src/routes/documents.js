import express from 'express';
import multer from 'multer';
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import Document from '../models/Document.js';
import Memory from '../models/Memory.js';
import { protect } from '../middleware/auth.js';
import { summarizeText } from '../services/gemini.js';

const router = express.Router();
const upload = multer({ dest: 'src/uploads/', limits: { fileSize: 10 * 1024 * 1024 } });
router.use(protect);

router.get('/', async (req, res) => {
  const docs = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(docs);
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    let text = '';
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(fs.readFileSync(req.file.path));
      text = data.text;
    } else {
      text = fs.readFileSync(req.file.path, 'utf8').slice(0, 200000);
    }
    const summary = await summarizeText(text || req.file.originalname);
    const doc = await Document.create({ user: req.user._id, name: req.file.originalname, originalName: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size, path: req.file.path, text, summary });
    await Memory.create({ user: req.user._id, title: `Document: ${req.file.originalname}`, type: 'research', content: summary, source: 'document', tags: ['document','ai-summary'] });
    res.status(201).json(doc);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  const doc = await Document.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (doc?.path && fs.existsSync(doc.path)) fs.unlinkSync(doc.path);
  res.json({ ok: true });
});
export default router;
