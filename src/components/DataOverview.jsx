import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DataOverview = () => {
  // 模拟数据
  const todayData = {
    steps: 8542,
    calories: 420,
    distance: 6.2,
    activeTime: 45
  };

  const weeklyData = [
    { day: 'Mon', steps: 7200, calories: 380 },
    { day: 'Tue', steps: 8500, calories: 420 },
    { day: 'Wed', steps: 6800, calories: 350 },
    { day: 'Thu', steps: 9200, calories: 460 },
    { day: 'Fri', steps: 7800, calories: 390 },
    { day: 'Sat', steps: 10500, calories: 520 },
    { day: 'Sun', steps: 8542, calories: 420 }
  ];

  const goalData = [
    { name: 'Completed', value: 75 },
    { name: 'Remaining', value: 25 }
  ];

  const COLORS = ['#3b82f6', '#e5e7eb'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 今日运动数据 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">今日运动数据</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">步数</p>
            <p className="text-2xl font-bold text-gray-900">{todayData.steps}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">卡路里</p>
            <p className="text-2xl font-bold text-gray-900">{todayData.calories} kcal</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">距离</p>
            <p className="text-2xl font-bold text-gray-900">{todayData.distance} km</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">活动时间</p>
            <p className="text-2xl font-bold text-gray-900">{todayData.activeTime} min</p>
          </div>
        </div>
      </div>

      {/* 每周统计 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">每周统计</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="steps" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 目标完成情况 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">目标完成情况</h3>
        <div className="flex items-center justify-center">
          <div className="h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={goalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {goalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="ml-4">
            <p className="text-3xl font-bold text-gray-900">75%</p>
            <p className="text-gray-600">本周目标完成</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataOverview;