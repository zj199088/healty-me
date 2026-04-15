import Record from '../models/Record.js';
import ExerciseType from '../models/ExerciseType.js';
import { Op } from 'sequelize';

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total records
    const totalRecords = await Record.count({ where: { userId } });
    
    // Get total duration
    const totalDuration = await Record.sum('duration', { where: { userId } });
    
    // Get total calories
    const totalCalories = await Record.sum('calories', { where: { userId } });
    
    // Get total distance
    const totalDistance = await Record.sum('distance', { where: { userId } }) || 0;
    
    // Get stats by exercise type
    const statsByType = await Record.findAll({
      attributes: [
        'exerciseTypeId',
        [Record.sequelize.fn('COUNT', Record.sequelize.col('id')), 'count'],
        [Record.sequelize.fn('SUM', Record.sequelize.col('duration')), 'duration'],
        [Record.sequelize.fn('SUM', Record.sequelize.col('calories')), 'calories']
      ],
      include: [{
        model: ExerciseType,
        attributes: ['name']
      }],
      where: { userId },
      group: ['exerciseTypeId', 'ExerciseType.id']
    });
    
    // Get recent records
    const recentRecords = await Record.findAll({
      include: [{
        model: ExerciseType,
        attributes: ['name']
      }],
      where: { userId },
      order: [['date', 'DESC']],
      limit: 5
    });
    
    res.json({
      totalRecords,
      totalDuration,
      totalCalories,
      totalDistance,
      statsByType,
      recentRecords
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user stats by date range
export const getStatsByDateRange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    
    const where = { userId };
    if (startDate) where.date = { ...where.date, [Op.gte]: startDate };
    if (endDate) where.date = { ...where.date, [Op.lte]: endDate };
    
    // Get stats
    const totalRecords = await Record.count({ where });
    const totalDuration = await Record.sum('duration', { where });
    const totalCalories = await Record.sum('calories', { where });
    const totalDistance = await Record.sum('distance', { where }) || 0;
    
    res.json({
      totalRecords,
      totalDuration,
      totalCalories,
      totalDistance
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};