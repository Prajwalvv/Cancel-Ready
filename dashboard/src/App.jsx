import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import './index.css';

function App() {
  const [session, setSession] = useState(null);

  const handleAuthenticated = (session) => {
    setSession(session);
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!session) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={
          !session ? (
            <div className="flex items-center justify-center min-h-screen">
              <Auth onAuthenticated={handleAuthenticated} />
            </div>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard session={session} />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
