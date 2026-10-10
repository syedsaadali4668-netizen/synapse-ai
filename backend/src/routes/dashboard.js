import express from 'express';
import Memory from '../models/Memory.js';
import Document from '../models/Document.js';
import Project from '../models/Project.js';
import Conversation from '../models/Conversation.js';
import { protect } from '../middleware/auth.js';
const router = express.Router(); router.use(protect);
router.get('/', async (req,res)=>{
  const user=req.user._id;
  const [memories,documents,projects,conversations,recentMemories,recentDocs]=await Promise.all([
    Memory.countDocuments({user}),Document.countDocuments({user}),Project.countDocuments({user}),Conversation.countDocuments({user}),Memory.find({user}).sort({createdAt:-1}).limit(5),Document.find({user}).sort({createdAt:-1}).limit(5)
  ]);
  res.json({stats:{memories,documents,projects,conversations},recentMemories,recentDocs});
});
export default router;
