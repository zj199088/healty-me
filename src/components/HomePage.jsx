import React from 'react';
import { AuthContext } from '../context/AuthContext';
import DataOverview from './DataOverview';
import QuickAccess from './QuickAccess';
import Recommendation from './Recommendation';

const HomePage = () => {
  const { user, logout } = React.useContext(AuthContext);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">FitTrack</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">Welcome, {user.username}</span>
              <button
                onClick={logout}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>
        
        <DataOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <QuickAccess />
          <Recommendation />
        </div>
      </div>
    </div>
  );
};

export default HomePage;