// Authentication Modal
// Login, Signup, Password Reset

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../card';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, Loader2, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [role, setRole] = useState<'teacher' | 'parent'>('teacher');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { signIn, signUp, isConfigured } = useAuth();

  if (!isOpen) return null;
  if (!isConfigured) {
    return <SupabaseNotConfiguredMessage onClose={onClose} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        onClose();
      } else if (mode === 'signup') {
        await signUp(email, password, {
          full_name: fullName,
          role,
          school: role === 'teacher' ? school : undefined,
        });
        setSuccess('Account created! Check your email to verify.');
        setTimeout(() => {
          setMode('signin');
          setSuccess('');
        }, 3000);
      } else if (mode === 'reset') {
        const { resetPassword } = await import('../../lib/supabase');
        await resetPassword(email);
        setSuccess('Password reset email sent! Check your inbox.');
        setTimeout(() => {
          setMode('signin');
          setSuccess('');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <span className="text-sm text-green-800">{success}</span>
              </div>
            )}

            {/* Signup Fields */}
            {mode === 'signup' && (
              <>
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label>I am a</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      type="button"
                      variant={role === 'teacher' ? 'default' : 'outline'}
                      onClick={() => setRole('teacher')}
                      disabled={loading}
                    >
                      Teacher
                    </Button>
                    <Button
                      type="button"
                      variant={role === 'parent' ? 'default' : 'outline'}
                      onClick={() => setRole('parent')}
                      disabled={loading}
                    >
                      Parent
                    </Button>
                  </div>
                </div>

                {role === 'teacher' && (
                  <div>
                    <Label htmlFor="school">School Name</Label>
                    <Input
                      id="school"
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                )}
              </>
            )}

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            {mode !== 'reset' && (
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
                {mode === 'signup' && (
                  <p className="text-xs text-gray-600 mt-1">
                    Minimum 6 characters
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Send Reset Link'}
            </Button>

            {/* Mode Switchers */}
            <div className="text-center space-y-2">
              {mode === 'signin' && (
                <>
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-sm text-blue-600 hover:underline"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                  <div className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-blue-600 hover:underline"
                      disabled={loading}
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}

              {(mode === 'signup' || mode === 'reset') && (
                <div className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-blue-600 hover:underline"
                    disabled={loading}
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SupabaseNotConfiguredMessage({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Backend Not Configured</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Supabase backend is not configured. To enable authentication and real-time data:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Create a free Supabase project at <a href="https://supabase.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">supabase.com</a></li>
            <li>Run the SQL schema from <code className="bg-gray-100 px-1 rounded">supabase-schema.sql</code></li>
            <li>Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file with your credentials</li>
            <li>Restart the development server</li>
          </ol>
          <p className="text-sm text-gray-600">
            See <code className="bg-gray-100 px-1 rounded">ENV_SETUP.md</code> for detailed instructions.
          </p>
          <div className="pt-4">
            <Button onClick={onClose} variant="default" className="w-full">
              Continue in Demo Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

