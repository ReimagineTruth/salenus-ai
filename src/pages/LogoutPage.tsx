import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const LogoutPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-teal-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <img src="/logo.png" alt="Salenus A.I Logo" className="h-12 w-12 mx-auto mb-2 rounded-full" />
        <h1 className="text-2xl font-bold text-indigo-700 mb-2">You have been logged out</h1>
        <p className="mb-4 text-slate-600">Thank you for using <span className="font-semibold">Salenus A.I Personal Coach</span> by <span className="font-semibold">mrwain organization</span>.</p>
        <div className="text-xs text-slate-500 mb-4">Need help? <a href="mailto:support@salenus.ai" className="text-indigo-600 underline">support@salenus.ai</a></div>
        <div className="flex flex-col gap-2">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate('/login')}>Log In Again</Button>
          <Button variant="outline" className="w-full" onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage; 