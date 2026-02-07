'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import Alert from '../components/ui/alert';
import { EmailIcon, PasswordIcon, UserIcon } from '../components/ui/icons';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3226/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl font-bold text-center mb-6">
              Create Account
            </h2>

            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="mb-4">
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Full Name"
                icon={<UserIcon />}
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                minLength={2}
                validationHint="Please enter your full name (at least 2 characters)"
              />

              <Input
                type="email"
                placeholder="Email"
                icon={<EmailIcon />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                validationHint="Please enter a valid email address"
              />

              <Input
                type="password"
                placeholder="Password"
                icon={<PasswordIcon />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                validationHint="Password must be at least 6 characters long"
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                className="mt-6"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </form>

            <div className="divider">OR</div>

            <p className="text-center text-sm">
              Already have an account?{' '}
              <a href="/login" className="link link-primary">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}