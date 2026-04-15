import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PlanDetail = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const handleStatusToggle = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/plan/${id}/status`, {
        isActive: !plan.isActive
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPlan({ ...plan, isActive: !plan.isActive });
      setSuccess(`计划已${!plan.isActive ? '激活' : '停用'}`);
    } catch (err) {
      setError('更新计划状态失败');
      console.error('Failed to update plan status:', err);
    }
  };

  const handleDeletePlan = async () => {
    if (window.confirm('确定要删除这个计划吗？')) {
      try {
        await axios.delete(`http://localhost:5000/api/plan/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        navigate('/plans');
      } catch (err) {
        setError('删除计划失败');
        console.error('Failed to delete plan:', err);
      }
    }
  };

  const handleStartExecution = () => {
    navigate(`/plans/${id}/execution`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || '计划不存在'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">计划详情</h1>
          <button
            onClick={() => navigate('/plans')}
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

        {/* Plan Info */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
              {plan.description && (
                <p className="mt-2 text-gray-600">{plan.description}</p>
              )}
              <p className="mt-4 text-sm text-gray-500">创建于：{new Date(plan.createdAt).toLocaleString()}</p>
              <p className="text-sm text-gray-500">更新于：{new Date(plan.updatedAt).toLocaleString()}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleStatusToggle}
                className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  plan.isActive
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500'
                    : 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
                }`}
              >
                {plan.isActive ? '停用' : '激活'}
              </button>
              <button
                onClick={handleDeletePlan}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                删除
              </button>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">锻炼项目</h2>
            <button
              onClick={handleStartExecution}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              开始执行
            </button>
          </div>
          
          {plan.Exercises && plan.Exercises.length > 0 ? (
            <div className="space-y-4">
              {plan.Exercises.map((exercise, index) => (
                <div key={exercise.id} className="p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{index + 1}. {exercise.name}</h3>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">组数:</span>
                          <span className="ml-2 font-medium">{exercise.sets}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">次数:</span>
                          <span className="ml-2 font-medium">{exercise.reps}</span>
                        </div>
                        {exercise.weight && (
                          <div>
                            <span className="text-sm text-gray-500">重量:</span>
                            <span className="ml-2 font-medium">{exercise.weight} kg</span>
                          </div>
                        )}
                        {exercise.duration && (
                          <div>
                            <span className="text-sm text-gray-500">时长:</span>
                            <span className="ml-2 font-medium">{exercise.duration} 秒</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                      顺序 {exercise.order}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">该计划暂无锻炼项目</p>
          )}
        </div>

        {/* Execution History */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">执行记录</h2>
          <p className="text-gray-500">执行记录功能正在开发中...</p>
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;