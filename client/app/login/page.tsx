/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import Alert from '../components/ui/alert';
import { EmailIcon, PasswordIcon } from '../components/ui/icons';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3226/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // Validate and store JWT token in localStorage
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirect to home page
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Thông tin đăng nhập không hợp lệ');
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
              Chào mừng bạn trở lại
            </h2>

            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Địa chỉ email"
                icon={<EmailIcon />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                validationHint="Vui lòng nhập địa chỉ email hợp lệ"
              />

              <Input
                type="password"
                placeholder="Mật khẩu"
                icon={<PasswordIcon />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                validationHint="Vui lòng nhập mật khẩu"
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                className="mt-6"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            <div className="divider">HOẶC</div>

            <p className="text-center text-sm">
              Chưa có tài khoản?{' '}
              <a href="/register" className="link link-primary">
                Đăng ký tại đây
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}