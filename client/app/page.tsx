/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';
import BookCard from './components/ui/book-card';
import Select from './components/ui/select';

interface Book {
  _id: string;
  title: string;
  author_first_name?: string;
  author_last_name?: string;
  publishing_year?: number;
  category?: string;
  image_url?: string;
}

interface Category {
  value: string;
  label: string;
  key: string;
}

const HomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    year: '',
    author: '',
  });

  useEffect(() => {
    let active = true;

    const loadBooks = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('http://localhost:3226/books');
        if (!response.ok) {
          throw new Error('Tải sách thất bại');
        }
        const data = await response.json();
        if (active) {
          setBooks(Array.isArray(data) ? data : []);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Tải sách thất bại');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const loadCategories = async () => {
      try {
        const response = await fetch('http://localhost:3226/books/categories');
        if (response.ok) {
          const data = await response.json();
          if (active) {
            setCategories(Array.isArray(data) ? data : []);
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    loadBooks();
    loadCategories();
    return () => {
      active = false;
    };
  }, []);

  const yearOptions = useMemo(() => {
    const values = new Set<string>();
    books.forEach((book) => {
      if (book.publishing_year) values.add(String(book.publishing_year));
    });
    return Array.from(values)
      .sort()
      .map((value) => ({ value, label: value }));
  }, [books]);

  const authorOptions = useMemo(() => {
    const values = new Set<string>();
    books.forEach((book) => {
      const first = book.author_first_name || '';
      const last = book.author_last_name || '';
      const full = `${first} ${last}`.trim();
      if (full) values.add(full);
    });
    return Array.from(values)
      .sort()
      .map((value) => ({ value, label: value }));
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const categoryOk = filters.category
        ? book.category === filters.category
        : true;
      const yearOk = filters.year
        ? String(book.publishing_year || '') === filters.year
        : true;
      const authorFull = `${book.author_first_name || ''} ${book.author_last_name || ''}`.trim();
      const authorOk = filters.author ? authorFull === filters.author : true;
      return categoryOk && yearOk && authorOk;
    });
  }, [books, filters]);

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-1 container mx-auto p-6'>
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body space-y-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              <Select
                options={categories}
                placeholder='Tất cả thể loại'
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                label='Thể loại'
                size='sm'
              />
              <Select
                options={yearOptions}
                placeholder='Tất cả năm'
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                label='Năm xuất bản'
                size='sm'
              />
              <Select
                options={authorOptions}
                placeholder='Tất cả tác giả'
                value={filters.author}
                onChange={(e) => setFilters({ ...filters, author: e.target.value })}
                label='Tác giả'
                size='sm'
              />
            </div>

            {loading && (
              <div className='text-center text-sm text-base-content/60'>Đang tải sách...</div>
            )}

            {error && (
              <div className='alert alert-error'>
                <span>{error}</span>
              </div>
            )}

            {!loading && !error && filteredBooks.length === 0 && (
              <div className='text-center text-sm text-base-content/60'>No books found.</div>
            )}

            {!loading && !error && filteredBooks.length > 0 && (
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {filteredBooks.map((book) => {
                  const authorFull = `${book.author_first_name || ''} ${book.author_last_name || ''}`.trim();
                  return (
                    <BookCard
                      key={book._id}
                      title={book.title}
                      author={authorFull || 'Không rõ tác giả'}
                      imageUrl={book.image_url}
                      size='a5'
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;