import Layout from '../components/Layout';
import Auth from '../components/Auth';
import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from './_app';

export default function Login() {
  const { session, loading } = useContext(AuthContext);
  const router = useRouter();
  const { redirect } = router.query;
  const redirectPath = redirect || '/onboard';

  useEffect(() => {
    if (session) {
      router.push(redirectPath);
    }
  }, [session, router, redirectPath]);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Sign in to CancelReady</h1>
            <p className="mt-2 text-sm text-gray-600">
              Access your dashboard and manage your cancellation flow
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : !session && (
            <Auth redirectTo={redirectPath} />
          )}
        </div>
      </div>
    </Layout>
  );
}
