import express from 'express';
import { Execution, Record, Exercise } from '../models/index.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Create a new execution record
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { recordId, exerciseId, sets, reps, weight, duration, calories } = req.body;
    
    // Verify record belongs to user
    const record = await Record.findOne({ where: { id: recordId, userId: req.user.id } });
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    // Verify exercise exists
    const exercise = await Exercise.findOne({ where: { id: exerciseId } });
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    
    const execution = await Execution.create({
      recordId,
      exerciseId,
      sets,
      reps,
      weight,
      duration,
      calories
    });
    
    res.status(201).json(execution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create execution record' });
  }
});

// Get executions for a record
router.get('/record/:recordId', authMiddleware, async (req, res) => {
  try {
    const { recordId } = req.params;
    
    // Verify record belongs to user
    const record = await Record.findOne({ where: { id: recordId, userId: req.user.id } });
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    const executions = await Execution.findAll({
      where: { recordId },
      include: [{ model: Exercise }]
    });
    
    res.json(executions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch executions' });
  }
});

// Get a single execution
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const execution = await Execution.findOne({
      where: { id },
      include: [{ model: Record }, { model: Exercise }]
    });
    
    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' });
    }
    
    // Verify record belongs to user
    if (execution.Record.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(execution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch execution' });
  }
});

// Update an execution
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { sets, reps, weight, duration, calories } = req.body;
    
    const execution = await Execution.findOne({
      where: { id },
      include: [{ model: Record }]
    });
    
    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' });
    }
    
    // Verify record belongs to user
    if (execution.Record.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await execution.update({
      sets,
      reps,
      weight,
      duration,
      calories
    });
    
    res.json(execution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update execution' });
  }
});

// Delete an execution
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const execution = await Execution.findOne({
      where: { id },
      include: [{ model: Record }]
    });
    
    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' });
    }
    
    // Verify record belongs to user
    if (execution.Record.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await execution.destroy();
    
    res.json({ message: 'Execution deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete execution' });
  }
});

export default router;