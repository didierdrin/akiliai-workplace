'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [signupMode, setSignupMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { login, resetPassword, createUser } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setResetMode(false);
    } catch (error: any) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await createUser(email, password, { displayName });
      router.push('/dashboard');
    } catch (error: any) {
      // Error handled in auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-emerald-admin flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="h-8 w-8 text-emerald-700" />
          </div>
          <h2 className="mt-6 text-3xl font-display font-bold text-white">
            {resetMode ? 'Reset Password' : 'Admin Dashboard'}
          </h2>
          <p className="mt-2 text-sm text-emerald-100">
            {resetMode 
              ? 'Enter your email to receive reset instructions'
              : 'Sign in to manage your Akiliai news platform'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form className="space-y-6" onSubmit={resetMode ? handleResetPassword : (signupMode ? handleSignup : handleLogin)}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input w-full pl-10 pr-4 py-3"
                  placeholder="admin@akiliai.com"
                />
              </div>
            </div>

            {/* Display Name - only show in signup mode */}
            {signupMode && !resetMode && (
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="admin-input w-full px-4 py-3"
                  placeholder="Jane Doe"
                />
              </div>
            )}

            {/* Password - only show if not in reset mode */}
            {!resetMode && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-input w-full pl-10 pr-12 py-3"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password - only show in signup mode */}
            {signupMode && !resetMode && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="admin-input w-full pl-10 pr-12 py-3"
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>
            )}

            {/* Remember me and forgot password */}
            {!resetMode && !signupMode && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => { setResetMode(true); setSignupMode(false); }}
                  className="text-sm text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                admin-button-primary w-full py-3 px-4 text-base font-medium
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {resetMode ? 'Sending...' : (signupMode ? 'Creating account...' : 'Signing in...')}
                </div>
              ) : (
                resetMode ? 'Send Reset Email' : (signupMode ? 'Create Account' : 'Sign In')
              )}
            </button>

            {/* Back to login */}
            {resetMode && (
              <button
                type="button"
                onClick={() => setResetMode(false)}
                className="w-full text-center text-sm text-gray-600 hover:text-emerald-700 font-medium"
              >
                Back to login
              </button>
            )}

            {/* Toggle Sign In / Sign Up */}
            {!resetMode && (
              <div className="w-full text-center text-sm text-gray-600">
                {signupMode ? (
                  <>
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => setSignupMode(false)}
                      className="text-emerald-700 hover:text-emerald-800 font-medium"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    <span>Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => { setSignupMode(true); setResetMode(false); }}
                      className="text-emerald-700 hover:text-emerald-800 font-medium"
                    >
                      Create one
                    </button>
                  </>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-emerald-100">
            Secured by Firebase Authentication
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-emerald-200">
            <span>© 2025 Akiliai</span>
            <span>•</span>
            <a href="#" className="hover:text-white">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
