'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/navbar';
import Input from '../../../components/ui/input';
import DateInput from '../../../components/ui/date-input';
import Textarea from '../../../components/ui/textarea';
import Button from '../../../components/ui/button';
import Alert from '../../../components/ui/alert';
import { UserIcon, EmailIcon } from '../../../components/ui/icons';

function EditAuthor() {
  const params = useParams();
  const router = useRouter();
  const authorId = params.id as string;
  const isNewAuthor = authorId === 'new';

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    bio: '',
    birth_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!isNewAuthor);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isNewAuthor) {
      loadAuthor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorId]);

  const loadAuthor = async () => {
    setLoadingData(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3226/authors/${authorId}`);
      if (!response.ok) {
        throw new Error('Tải dữ liệu tác giả thất bại');
      }
      const data = await response.json();
      
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        country: data.country || '',
        bio: data.bio || '',
        birth_date: data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : '',
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Tải dữ liệu tác giả thất bại');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const url = isNewAuthor
        ? 'http://localhost:3226/authors'
        : `http://localhost:3226/authors/${authorId}`;
      
      const method = isNewAuthor ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save author');
      }

      setSuccess(
        isNewAuthor
          ? 'Author created successfully!'
          : 'Author updated successfully!'
      );

      setTimeout(() => {
        router.push('/admin/authors');
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save author');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/admin/authors')}
                >
                  ← Quay lại
                </Button>
                <h1 className="text-3xl font-bold">
                  {isNewAuthor ? 'Thêm tác giả mới' : 'Chỉnh sửa tác giả'}
                </h1>
              </div>

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

              {loadingData ? (
                <div className="text-center text-sm text-base-content/60 py-8">
                  Đang tải dữ liệu tác giả...
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Họ"
                      placeholder="Nguyễn"
                      icon={<UserIcon />}
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      required
                      validationHint="Họ là bắt buộc"
                    />
                    <Input
                      label="Tên"
                      placeholder="An"
                      icon={<UserIcon />}
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      required
                      validationHint="Tên là bắt buộc"
                    />
                  </div>

                  <Input
                    label="Email"
                    type="email"
                    placeholder="tacgia@example.com"
                    icon={<EmailIcon />}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />

                  <Input
                    label="Quốc gia"
                    placeholder="Việt Nam"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                  />

                  <DateInput
                    label="Ngày sinh"
                    value={formData.birth_date}
                    onChange={(e) =>
                      setFormData({ ...formData, birth_date: e.target.value })
                    }
                  />

                  <Textarea
                    label="Tiểu sử"
                    placeholder="Viết mô tả ngắn về tác giả..."
                    helperText="Tùy chọn - Mô tả ngắn về lý lịch và thành tựu"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={6}
                    className="h-40"
                  />

                  <div className="divider"></div>

                  <div className="flex justify-end gap-4">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => router.push('/admin/authors')}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading
                        ? 'Đang lưu...'
                        : isNewAuthor
                        ? 'Tạo tác giả'
                        : 'Cập nhật tác giả'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAuthor;