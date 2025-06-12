import { useState, useEffect } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { onAuthStateChange, signIn, signUp, signInWithGoogle, resetPassword } from '../lib/firebase';

const Auth = ({ onAuthenticated }) => {
  const [user, setUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        onAuthenticated(firebaseUser);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [onAuthenticated]);

  if (user) {
    return null; // Don't render anything if already authenticated
  }

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        // Handle password reset
        if (!email) {
          throw new Error('Please enter your email address');
        }
        await resetPassword(email);
        setMessage('Password reset email sent. Check your inbox.');
      } else if (isSignUp) {
        // Handle sign up
        if (!email || !password) {
          throw new Error('Please enter both email and password');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await signUp(email, password);
        setMessage('Account created! Please verify your email.');
      } else {
        // Handle sign in
        if (!email || !password) {
          throw new Error('Please enter both email and password');
        }
        await signIn(email, password);
        // No need to set message as user will be redirected
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      // No need to set message as user will be redirected
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
    setError('');
    setMessage('');
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsSignUp(false);
    setError('');
    setMessage('');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-center">CancelReady {isForgotPassword ? 'Reset Password' : isSignUp ? 'Sign Up' : 'Login'}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Your email address"
            required
          />
        </div>
        
        {!isForgotPassword && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {isSignUp ? 'Create a Password' : 'Your Password'}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Your password"
              required={!isForgotPassword}
            />
          </div>
        )}
        
        {isSignUp && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Confirm your password"
              required={isSignUp}
            />
          </div>
        )}
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isForgotPassword ? 'Reset Password' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
          
          {!isSignUp && !isForgotPassword && (
            <button
              type="button"
              onClick={toggleForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </button>
          )}
          
          {isForgotPassword && (
            <button
              type="button"
              onClick={toggleForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Back to login
            </button>
          )}
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <FaGoogle className="mr-2" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
