import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Record from './Record.js';
import Exercise from './Exercise.js';

const Execution = sequelize.define('Execution', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recordId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Record,
      key: 'id'
    },
    index: true
  },
  exerciseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Exercise,
      key: 'id'
    },
    index: true
  },
  sets: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'executions'
});

// Relationships
Record.hasMany(Execution, { foreignKey: 'recordId' });
Execution.belongsTo(Record, { foreignKey: 'recordId' });

Exercise.hasMany(Execution, { foreignKey: 'exerciseId' });
Execution.belongsTo(Exercise, { foreignKey: 'exerciseId' });

export default Execution;