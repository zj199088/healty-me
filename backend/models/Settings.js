import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  theme: {
    type: DataTypes.STRING,
    defaultValue: 'light'
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'zh-CN'
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
  tableName: 'settings'
});

// Relationships
User.hasOne(Settings, { foreignKey: 'userId' });
Settings.belongsTo(User, { foreignKey: 'userId' });

export default Settings;