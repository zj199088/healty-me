import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExerciseTypeSelection = () => {
  const [exerciseTypes, setExerciseTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExerciseTypes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/exercise/types');
        setExerciseTypes(response.data);
      } catch (err) {
        setError('Failed to fetch exercise types');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseTypes();
  }, []);

  const handleSelectExercise = (exerciseType) => {
    navigate('/record', { state: { exerciseType } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exercise types...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Select Exercise Type</h1>
          <p className="text-gray-600 mt-2">Choose the type of exercise you want to record</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {exerciseTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSelectExercise(type)}
            >
              <div className="text-4xl mb-4">{type.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{type.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{type.description}</p>
              <div className="text-sm text-gray-500">
                {type.caloriesPerMinute} calories/min
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseTypeSelection;