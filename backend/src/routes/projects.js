import express from 'express';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';
const router = express.Router(); router.use(protect);
router.get('/', async (req,res)=>res.json(await Project.find({user:req.user._id}).sort({createdAt:-1})));
router.post('/', async (req,res)=>res.status(201).json(await Project.create({...req.body,user:req.user._id})));
router.put('/:id', async (req,res)=>res.json(await Project.findOneAndUpdate({_id:req.params.id,user:req.user._id},req.body,{new:true})));
router.delete('/:id', async (req,res)=>{await Project.findOneAndDelete({_id:req.params.id,user:req.user._id});res.json({ok:true});});
export default router;
