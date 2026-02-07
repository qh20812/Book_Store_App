'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../components/navbar';
import Button from '../../components/ui/button';
import Alert from '../../components/ui/alert';

interface Book {
  _id: string;
  title: string;
  author_first_name?: string;
  author_last_name?: string;
  category: string;
  publishing_year: number;
  image_url?: string;
}

function BookManagement() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3226/books');
      if (!response.ok) {
        throw new Error('Tải sách thất bại');
      }
      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Tải sách thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa "${title}" không?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3226/books/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Xóa sách thất bại');
      }

      setSuccess(`Đã xóa sách "${title}" thành công`);
      loadBooks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Xóa sách thất bại');
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
              <h1 className="text-3xl font-bold">Quản lý Sách</h1>
              <Button
                variant="primary"
                onClick={() => router.push('/admin/books/new')}
              >
                + Thêm sách mới
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
                Đang tải sách...
              </div>
            )}

            {!loading && books.length === 0 && (
              <div className="text-center text-sm text-base-content/60">
                Không tìm thấy sách. Tạo sách đầu tiên của bạn!
              </div>
            )}

            {!loading && books.length > 0 && (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Tiêu đề</th>
                      <th>Tác giả</th>
                      <th>Thể loại</th>
                      <th>Năm</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book._id}>
                        <td>
                          <div className="avatar">
                            <div className="w-12 h-16 rounded">
                              {book.image_url ? (
                                <Image
                                  src={book.image_url}
                                  alt={book.title}
                                  width={48}
                                  height={64}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="bg-base-300 flex items-center justify-center text-xs">
                                  Không có ảnh
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="font-semibold">{book.title}</td>
                        <td>
                          {book.author_first_name && book.author_last_name
                            ? `${book.author_first_name} ${book.author_last_name}`
                            : '-'}
                        </td>
                        <td>{book.category}</td>
                        <td>{book.publishing_year}</td>
                        <td>
                          <div className="flex gap-2">
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() =>
                                router.push(`/admin/books/${book._id}`)
                              }
                            >
                              Chỉnh sửa
                            </Button>
                            <Button
                              variant="error"
                              size="sm"
                              onClick={() =>
                                handleDelete(book._id, book.title)
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

export default BookManagement;