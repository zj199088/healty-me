import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/stats', {
          headers: {
            'x-auth-token': token
          }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err.message);
        setError('获取统计数据失败');
      }
    };

    fetchStats();
  }, [navigate]);

  if (!stats) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  // Prepare data for pie chart
  const pieData = {
    labels: stats.statsByType.map(item => item.ExerciseType.name),
    datasets: [
      {
        data: stats.statsByType.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 1
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">数据统计</h1>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">总记录数</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalRecords}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">总时长</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalDuration} 分钟</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">总卡路里</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalCalories} 千卡</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">总距离</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalDistance} 公里</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">运动类型分布</h3>
                  <div className="h-64">
                    <Pie data={pieData} options={pieOptions} />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">最近记录</h3>
                  <div className="space-y-4">
                    {stats.recentRecords.length > 0 ? (
                      stats.recentRecords.map(record => (
                        <div key={record.id} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900">{record.ExerciseType.name}</h4>
                            <span className="text-sm text-gray-500">{record.date}</span>
                          </div>
                          <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-600">时长: {record.duration} 分钟</div>
                            <div className="text-gray-600">卡路里: {record.calories} 千卡</div>
                            {record.distance && (
                              <div className="text-gray-600">距离: {record.distance} 公里</div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        暂无运动记录
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;