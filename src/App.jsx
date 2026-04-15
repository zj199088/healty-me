import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import ExerciseTypeSelection from './components/ExerciseTypeSelection';
import ExerciseRecord from './components/ExerciseRecord';
import ExerciseHistory from './components/ExerciseHistory';
import PlanCreation from './components/PlanCreation';
import PlanDetail from './components/PlanDetail';
import PlanExecution from './components/PlanExecution';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Stats from './components/Stats';
import Exercise3D from './components/Exercise3D';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/select-exercise" element={
            <ProtectedRoute>
              <ExerciseTypeSelection />
            </ProtectedRoute>
          } />
          <Route path="/record" element={
            <ProtectedRoute>
              <ExerciseRecord />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <ExerciseHistory />
            </ProtectedRoute>
          } />
          <Route path="/plans" element={
            <ProtectedRoute>
              <PlanCreation />
            </ProtectedRoute>
          } />
          <Route path="/plans/:id" element={
            <ProtectedRoute>
              <PlanDetail />
            </ProtectedRoute>
          } />
          <Route path="/plans/:id/execution" element={
            <ProtectedRoute>
              <PlanExecution />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/stats" element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          } />
          <Route path="/exercise-3d" element={
            <ProtectedRoute>
              <Exercise3D />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;