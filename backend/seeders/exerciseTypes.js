import { ExerciseType } from '../models/index.js';

const exerciseTypes = [
  {
    name: 'Running',
    description: 'Running or jogging at a steady pace',
    icon: '🏃',
    caloriesPerMinute: 10
  },
  {
    name: 'Cycling',
    description: 'Biking on a road or stationary bike',
    icon: '🚴',
    caloriesPerMinute: 8
  },
  {
    name: 'Swimming',
    description: 'Swimming laps in a pool',
    icon: '🏊',
    caloriesPerMinute: 9
  },
  {
    name: 'Walking',
    description: 'Brisk walking for exercise',
    icon: '🚶',
    caloriesPerMinute: 5
  },
  {
    name: 'Yoga',
    description: 'Gentle stretching and meditation',
    icon: '🧘',
    caloriesPerMinute: 3
  },
  {
    name: 'Strength Training',
    description: 'Weight lifting or bodyweight exercises',
    icon: '🏋️',
    caloriesPerMinute: 6
  },
  {
    name: 'HIIT',
    description: 'High-intensity interval training',
    icon: '💪',
    caloriesPerMinute: 12
  },
  {
    name: 'Dancing',
    description: 'Dance-based workouts',
    icon: '💃',
    caloriesPerMinute: 7
  }
];

const seedExerciseTypes = async () => {
  try {
    for (const type of exerciseTypes) {
      await ExerciseType.findOrCreate({
        where: { name: type.name },
        defaults: type
      });
    }
    console.log('Exercise types seeded successfully');
  } catch (error) {
    console.error('Error seeding exercise types:', error);
  }
};

export default seedExerciseTypes;