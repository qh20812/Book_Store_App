'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navbar';
import Button from '../../components/ui/button';
import Alert from '../../components/ui/alert';

interface Author {
  _id: string;
  first_name: string;
  last_name: string;
  email?: string;
  country?: string;
  bio?: string;
  birth_date?: string;
}

function AuthorManagement() {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3226/authors');
      if (!response.ok) {
        throw new Error('Tải tác giả thất bại');
      }
      const data = await response.json();
      setAuthors(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Tải tác giả thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa "${name}" không?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3226/authors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Xóa tác giả thất bại');
      }

      setSuccess(`Đã xóa tác giả "${name}" thành công`);
      loadAuthors();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Xóa tác giả thất bại');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto p-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Quản lý Tác giả</h1>
              <Button
                variant="primary"
                onClick={() => router.push('/admin/authors/new')}
              >
                + Thêm tác giả mới
              </Button>
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

            {loading && (
              <div className="text-center text-sm text-base-content/60">
                Đang tải tác giả...
              </div>
            )}

            {!loading && authors.length === 0 && (
              <div className="text-center text-sm text-base-content/60">
                Không tìm thấy tác giả. Tạo tác giả đầu tiên của bạn!
              </div>
            )}

            {!loading && authors.length > 0 && (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Tên</th>
                      <th>Email</th>
                      <th>Quốc gia</th>
                      <th>Tiểu sử</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authors.map((author) => (
                      <tr key={author._id}>
                        <td className="font-semibold">
                          {author.first_name} {author.last_name}
                        </td>
                        <td>{author.email || '-'}</td>
                        <td>{author.country || '-'}</td>
                        <td>
                          <div className="max-w-xs truncate">
                            {author.bio || '-'}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() =>
                                router.push(`/admin/authors/${author._id}`)
                              }
                            >
                              Chỉnh sửa
                            </Button>
                            <Button
                              variant="error"
                              size="sm"
                              onClick={() =>
                                handleDelete(
                                  author._id,
                                  `${author.first_name} ${author.last_name}`
                                )
                              }
                            >
                              Xóa
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthorManagement;