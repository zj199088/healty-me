import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import ExerciseType from './ExerciseType.js';

const Record = sequelize.define('Record', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    index: true
  },
  exerciseTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ExerciseType,
      key: 'id'
    },
    index: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    index: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  distance: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'records'
});

// Relationships
User.hasMany(Record, { foreignKey: 'userId' });
Record.belongsTo(User, { foreignKey: 'userId' });
Record.belongsTo(ExerciseType, { foreignKey: 'exerciseTypeId' });

export default Record;