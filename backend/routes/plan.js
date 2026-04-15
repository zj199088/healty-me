import express from 'express';
import { Plan, Exercise, Execution, Record } from '../models/index.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Create a new plan
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, exercises } = req.body;
    
    const plan = await Plan.create({
      userId: req.user.id,
      name,
      description
    });
    
    // Create exercises for the plan
    if (exercises && exercises.length > 0) {
      for (let i = 0; i < exercises.length; i++) {
        await Exercise.create({
          planId: plan.id,
          name: exercises[i].name,
          sets: exercises[i].sets,
          reps: exercises[i].reps,
          weight: exercises[i].weight,
          duration: exercises[i].duration,
          order: i + 1
        });
      }
    }
    
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

// Get user's plans
router.get('/', authMiddleware, async (req, res) => {
  try {
    const plans = await Plan.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get a single plan with exercises
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const plan = await Plan.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [{ model: Exercise, order: [['order', 'ASC']] }]
    });
    
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

// Update a plan
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, exercises } = req.body;
    
    const plan = await Plan.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    await plan.update({ name, description });
    
    // Update exercises
    if (exercises && exercises.length > 0) {
      // Delete existing exercises
      await Exercise.destroy({ where: { planId: plan.id } });
      
      // Create new exercises
      for (let i = 0; i < exercises.length; i++) {
        await Exercise.create({
          planId: plan.id,
          name: exercises[i].name,
          sets: exercises[i].sets,
          reps: exercises[i].reps,
          weight: exercises[i].weight,
          duration: exercises[i].duration,
          order: i + 1
        });
      }
    }
    
    // Fetch updated plan with exercises
    const updatedPlan = await Plan.findOne({
      where: { id: plan.id },
      include: [{ model: Exercise, order: [['order', 'ASC']] }]
    });
    
    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// Delete a plan
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const plan = await Plan.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    // Delete associated exercises
    await Exercise.destroy({ where: { planId: plan.id } });
    
    // Delete the plan
    await plan.destroy();
    
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

// Mark plan as active/inactive
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const plan = await Plan.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    await plan.update({ isActive });
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update plan status' });
  }
});

export default router;