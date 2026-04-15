import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PlanExecution = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentSet, setCurrentSet] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/plan/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPlan(response.data);
      setLoading(false);
    } catch (err) {
      setError('获取计划详情失败');
      setLoading(false);
      console.error('Failed to fetch plan:', err);
    }
  };

  const handleNextSet = () => {
    const currentExercise = plan.Exercises[currentExerciseIndex];
    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);
    } else {
      // Mark exercise as completed
      setCompletedExercises([...completedExercises, currentExerciseIndex]);
      if (currentExerciseIndex < plan.Exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
      } else {
        // All exercises completed
        setSuccess('计划执行完成！');
      }
    }
  };

  const handlePreviousSet = () => {
    if (currentSet > 1) {
      setCurrentSet(currentSet - 1);
    } else if (currentExerciseIndex > 0) {
      // Move to previous exercise
      setCompletedExercises(completedExercises.slice(0, -1));
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setCurrentSet(plan.Exercises[currentExerciseIndex - 1].sets);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleCompletePlan = async () => {
    try {
      // Create a record for the plan execution
      const record = await axios.post('http://localhost:5000/api/exercise/records', {
        exerciseTypeId: 1, // Assuming general exercise type
        duration: 30, // Default duration
        calories: 300, // Default calories
        notes: `完成了计划：${plan.name}`
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Create executions for each completed exercise
      for (const exercise of plan.Exercises) {
        await axios.post('http://localhost:5000/api/execution', {
          recordId: record.data.id,
          exerciseId: exercise.id,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          duration: exercise.duration,
          calories: 50 // Default calories per exercise
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }

      setSuccess('计划执行完成并已记录！');
      setTimeout(() => {
        navigate(`/plans/${id}`);
      }, 2000);
    } catch (err) {
      setError('记录执行结果失败');
      console.error('Failed to record execution:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error || !plan || !plan.Exercises || plan.Exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || '计划不存在或无锻炼项目'}</div>
      </div>
    );
  }

  const currentExercise = plan.Exercises[currentExerciseIndex];
  const isExerciseCompleted = completedExercises.includes(currentExerciseIndex);
  const allExercisesCompleted = completedExercises.length === plan.Exercises.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">执行计划: {plan.name}</h1>
          <button
            onClick={() => navigate(`/plans/${id}`)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            返回
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 px-4 py-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Exercise Progress */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">锻炼进度</h2>
          <div className="space-y-2">
            {plan.Exercises.map((exercise, index) => (
              <div key={exercise.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  completedExercises.includes(index)
                    ? 'bg-green-500 text-white'
                    : index === currentExerciseIndex
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {completedExercises.includes(index) ? '✓' : index + 1}
                </div>
                <div className={`flex-1 ${completedExercises.includes(index) ? 'text-gray-500 line-through' : ''}`}>
                  {exercise.name}
                </div>
                <div className="text-sm text-gray-500">
                  {exercise.sets} 组 × {exercise.reps} 次
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Exercise */}
        {!allExercisesCompleted && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">当前锻炼</h2>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentExercise.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-500">总组数:</span>
                  <span className="ml-2 font-medium">{currentExercise.sets}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">每组次数:</span>
                  <span className="ml-2 font-medium">{currentExercise.reps}</span>
                </div>
                {currentExercise.weight && (
                  <div>
                    <span className="text-sm text-gray-500">重量:</span>
                    <span className="ml-2 font-medium">{currentExercise.weight} kg</span>
                  </div>
                )}
                {currentExercise.duration && (
                  <div>
                    <span className="text-sm text-gray-500">时长:</span>
                    <span className="ml-2 font-medium">{currentExercise.duration} 秒</span>
                  </div>
                )}
              </div>
            </div>

            {/* Set Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-800">当前组: {currentSet} / {currentExercise.sets}</h4>
                <button
                  onClick={handlePause}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  {isPaused ? '继续' : '暂停'}
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(currentSet / currentExercise.sets) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePreviousSet}
                disabled={currentExerciseIndex === 0 && currentSet === 1}
                className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  currentExerciseIndex === 0 && currentSet === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500'
                }`}
              >
                上一组
              </button>
              <button
                onClick={handleNextSet}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {currentSet < currentExercise.sets ? '下一组' : '完成项目'}
              </button>
            </div>
          </div>
        )}

        {/* Completion Section */}
        {allExercisesCompleted && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 计划执行完成！</h2>
            <p className="text-gray-600 mb-6">恭喜您完成了所有锻炼项目！</p>
            <button
              onClick={handleCompletePlan}
              className="px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              记录执行结果
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">锻炼提示</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>确保正确的动作姿势，避免受伤</li>
            <li>根据自身能力调整重量和次数</li>
            <li>每组之间适当休息</li>
            <li>保持呼吸均匀</li>
            <li>锻炼后记得拉伸放松</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlanExecution;