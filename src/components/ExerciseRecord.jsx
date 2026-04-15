import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ExerciseRecord = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [distance, setDistance] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const intervalRef = useRef(null);

  const exerciseType = location.state?.exerciseType;

  if (!exerciseType) {
    navigate('/select-exercise');
    return null;
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSeconds(0);
    setDistance('');
    setNotes('');
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateCalories = () => {
    const minutes = seconds / 60;
    return Math.round(minutes * exerciseType.caloriesPerMinute);
  };

  const handleSaveRecord = async () => {
    if (seconds < 60) {
      setError('Please record at least 1 minute of exercise');
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post('http://localhost:5000/api/exercise/records', {
        exerciseTypeId: exerciseType.id,
        duration: seconds,
        calories: calculateCalories(),
        distance: distance ? parseFloat(distance) : null,
        notes
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      resetTimer();
      navigate('/history');
    } catch (err) {
      setError('Failed to save exercise record');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => navigate('/select-exercise')}
          >
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Recording Exercise</h1>
          <div className="w-16"></div> {/* Spacer */}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">{exerciseType.icon}</div>
            <h2 className="text-2xl font-bold text-gray-800">{exerciseType.name}</h2>
            <p className="text-gray-600">{exerciseType.description}</p>
          </div>

          <div className="text-center mb-8">
            <div className="text-5xl font-mono font-bold text-gray-800 mb-4">
              {formatTime(seconds)}
            </div>
            <div className="text-xl text-gray-600 mb-2">
              Calories: {calculateCalories()}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <button
              className="px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={toggleTimer}
              disabled={saving}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              className="px-4 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={resetTimer}
              disabled={saving || isRunning}
            >
              Reset
            </button>
            <button
              className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleSaveRecord}
              disabled={saving || isRunning || seconds === 0}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Distance (km)</label>
              <input
                type="number"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                rows="3"
                disabled={isRunning}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseRecord;