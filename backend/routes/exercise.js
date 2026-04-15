import express from 'express';
import { Op } from 'sequelize';
import { ExerciseType, Record } from '../models/index.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get all exercise types
router.get('/types', async (req, res) => {
  try {
    const exerciseTypes = await ExerciseType.findAll();
    res.json(exerciseTypes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercise types' });
  }
});

// Create a new exercise record
router.post('/records', authMiddleware, async (req, res) => {
  try {
    const { exerciseTypeId, duration, calories, distance, notes } = req.body;
    
    const record = await Record.create({
      userId: req.user.id,
      exerciseTypeId,
      date: new Date().toISOString().split('T')[0],
      duration,
      calories,
      distance,
      notes
    });
    
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create exercise record' });
  }
});

// Get user's exercise records
router.get('/records', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    const where = {
      userId: req.user.id
    };
    
    if (startDate) {
      where.date = { ...where.date, [Op.gte]: startDate };
    }
    
    if (endDate) {
      where.date = { ...where.date, [Op.lte]: endDate };
    }
    
    const records = await Record.findAll({
      where,
      include: [{ model: ExerciseType }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    const total = await Record.count({ where });
    
    res.json({
      records,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercise records' });
  }
});

// Get a single exercise record
router.get('/records/:id', authMiddleware, async (req, res) => {
  try {
    const record = await Record.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [{ model: ExerciseType }]
    });
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercise record' });
  }
});

// Update an exercise record
router.put('/records/:id', authMiddleware, async (req, res) => {
  try {
    const { exerciseTypeId, duration, calories, distance, notes } = req.body;
    
    const record = await Record.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    await record.update({
      exerciseTypeId,
      duration,
      calories,
      distance,
      notes
    });
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update exercise record' });
  }
});

// Delete an exercise record
router.delete('/records/:id', authMiddleware, async (req, res) => {
  try {
    const record = await Record.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    await record.destroy();
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete exercise record' });
  }
});

export default router;