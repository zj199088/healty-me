import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExerciseHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalStats, setTotalStats] = useState({
    totalDuration: 0,
    totalCalories: 0,
    totalDistance: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/exercise/records', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const recordsData = response.data.records;
        setRecords(recordsData);

        // Calculate total stats
        const stats = recordsData.reduce((acc, record) => {
          return {
            totalDuration: acc.totalDuration + record.duration,
            totalCalories: acc.totalCalories + record.calories,
            totalDistance: acc.totalDistance + (record.distance || 0)
          };
        }, { totalDuration: 0, totalCalories: 0, totalDistance: 0 });

        setTotalStats(stats);
      } catch (err) {
        setError('Failed to fetch exercise records');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStartNewRecord = () => {
    navigate('/select-exercise');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exercise history...</p>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Exercise History</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleStartNewRecord}
          >
            Start New Record
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Total Duration</h3>
            <p className="text-3xl font-bold text-gray-800">{formatTime(totalStats.totalDuration)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Total Calories</h3>
            <p className="text-3xl font-bold text-gray-800">{totalStats.totalCalories} kcal</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Total Distance</h3>
            <p className="text-3xl font-bold text-gray-800">{totalStats.totalDistance.toFixed(1)} km</p>
          </div>
        </div>

        {/* Exercise Records */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-100 border-b">
            <h3 className="font-semibold text-gray-700">Exercise Records</h3>
          </div>
          <div className="divide-y">
            {records.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">No exercise records found</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleStartNewRecord}
                >
                  Start Your First Record
                </button>
              </div>
            ) : (
              records.map((record) => (
                <div key={record.id} className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{record.ExerciseType.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{record.ExerciseType.name}</h4>
                        <p className="text-gray-600">{formatDate(record.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{formatTime(record.duration)}</p>
                      <p className="text-gray-600">{record.calories} kcal</p>
                      {record.distance && (
                        <p className="text-gray-600">{record.distance.toFixed(1)} km</p>
                      )}
                    </div>
                  </div>
                  {record.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <p className="text-gray-700">{record.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseHistory;