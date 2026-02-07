'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/navbar';
import Input from '../../../components/ui/input';
import Textarea from '../../../components/ui/textarea';
import Select from '../../../components/ui/select';
import Button from '../../../components/ui/button';
import Alert from '../../../components/ui/alert';

interface Author {
  _id: string;
  first_name: string;
  last_name: string;
}

interface Category {
  value: string;
  label: string;
  key: string;
}

function EditBook() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const isNewBook = bookId === 'new';

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    author_first_name: '',
    author_last_name: '',
    category: '',
    publishing_year: new Date().getFullYear(),
    description: '',
    image_url: '',
  });
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!isNewBook);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAuthors();
    loadCategories();
    if (!isNewBook) {
      loadBook();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const loadAuthors = async () => {
    try {
      const response = await fetch('http://localhost:3226/authors');
      if (response.ok) {
        const data = await response.json();
        setAuthors(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load authors:', err);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:3226/books/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadBook = async () => {
    setLoadingData(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3226/books/${bookId}`);
      if (!response.ok) {
        throw new Error('Tải dữ liệu sách thất bại');
      }
      const data = await response.json();

      setFormData({
        title: data.title || '',
        author: data.author || '',
        author_first_name: data.author_first_name || '',
        author_last_name: data.author_last_name || '',
        category: data.category || '',
        publishing_year: data.publishing_year || new Date().getFullYear(),
        description: data.description || '',
        image_url: data.image_url || '',
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Tải dữ liệu sách thất bại');
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
      const url = isNewBook
        ? 'http://localhost:3226/books'
        : `http://localhost:3226/books/${bookId}`;

      const method = isNewBook ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Lưu sách thất bại');
      }

      setSuccess(
        isNewBook ? 'Tạo sách thành công!' : 'Cập nhật sách thành công!'
      );

      setTimeout(() => {
        router.push('/admin/books');
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu sách thất bại');
    } finally {
      setLoading(false);
    }
  };

  const authorOptions = authors.map((author) => ({
    value: author._id,
    label: `${author.first_name} ${author.last_name}`,
  }));

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
                  onClick={() => router.push('/admin/books')}
                >
                  ← Quay lại
                </Button>
                <h1 className="text-3xl font-bold">
                  {isNewBook ? 'Thêm sách mới' : 'Chỉnh sửa sách'}
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
                  Đang tải dữ liệu sách...
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Tiêu đề"
                    placeholder="Tiêu đề sách"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    validationHint="Tiêu đề là bắt buộc"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Tác giả"
                      options={authorOptions}
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      placeholder="Chọn tác giả"
                    />

                    <Select
                      label="Thể loại"
                      options={categories}
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                      placeholder="Chọn thể loại"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Năm xuất bản"
                      type="number"
                      value={formData.publishing_year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publishing_year: parseInt(e.target.value),
                        })
                      }
                      required
                    />

                    <Input
                      label="URL ảnh"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                    />
                  </div>

                  <Textarea
                    label="Mô tả"
                    placeholder="Viết mô tả ngắn về sách..."
                    helperText="Tùy chọn - Cung cấp tóm tắt hoặc nội dung chính"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={6}
                    className="h-40"
                  />

                  <div className="divider"></div>

                  <div className="flex justify-end gap-4">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => router.push('/admin/books')}
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
                        : isNewBook
                        ? 'Tạo sách'
                        : 'Cập nhật sách'}
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

export default EditBook;