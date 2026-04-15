import React from 'react';
import { Link } from 'react-router-dom';
import { FaRunning, FaHeartbeat, FaDumbbell, FaUser, FaCalendar, FaHistory } from 'react-icons/fa';

const QuickAccess = () => {
  const quickAccessItems = [
    {
      title: '运动记录',
      icon: <FaRunning className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-50',
      href: '/select-exercise'
    },
    {
      title: '历史记录',
      icon: <FaHistory className="h-8 w-8 text-indigo-500" />,
      color: 'bg-indigo-50',
      href: '/history'
    },
    {
      title: '心率监测',
      icon: <FaHeartbeat className="h-8 w-8 text-red-500" />,
      color: 'bg-red-50',
      href: '#'
    },
    {
      title: '力量训练',
      icon: <FaDumbbell className="h-8 w-8 text-green-500" />,
      color: 'bg-green-50',
      href: '#'
    },
    {
      title: '个人资料',
      icon: <FaUser className="h-8 w-8 text-purple-500" />,
      color: 'bg-purple-50',
      href: '#'
    },
    {
      title: '日程安排',
      icon: <FaCalendar className="h-8 w-8 text-amber-500" />,
      color: 'bg-amber-50',
      href: '#'
    }
  ];

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">快速访问</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickAccessItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`${item.color} p-4 rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer`}
            >
              {item.icon}
              <span className="mt-2 text-sm font-medium text-gray-700">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickAccess;