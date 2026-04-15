import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/auth.js';
import exerciseRoutes from './routes/exercise.js';
import planRoutes from './routes/plan.js';
import executionRoutes from './routes/execution.js';
import statsRoutes from './routes/stats.js';
import settingsRoutes from './routes/settings.js';
import seedExerciseTypes from './seeders/exerciseTypes.js';

// Import all models to ensure they are registered with Sequelize
import './models/index.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exercise', exerciseRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/execution', executionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingsRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Sync database models and seed data
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
    await seedExerciseTypes();
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

syncDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;