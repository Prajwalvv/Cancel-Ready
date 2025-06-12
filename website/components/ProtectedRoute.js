import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../pages/_app';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : null;
};

export default ProtectedRoute;
