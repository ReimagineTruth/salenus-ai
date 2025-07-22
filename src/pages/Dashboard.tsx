import React from 'react';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  // This is a placeholder component that redirects to the main dashboard
  // The actual dashboard functionality is handled by PlanBasedDashboard component
  return <Navigate to="/dashboard" replace />;
};

export default Dashboard; 