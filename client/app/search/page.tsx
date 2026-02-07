'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import BookCard from '../components/ui/book-card';

interface Book {
  _id: string;
  title: string;
  author_first_name?: string;
  author_last_name?: string;
  publishing_year?: number;
  category?: string;
  image_url?: string;
}

function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const loadBooks = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3226/books');
      if (!response.ok) {
        throw new Error('Tải sách thất bại');
      }
      const data = await response.json();
      
      // Filter books based on search query
      const filtered = Array.isArray(data)
        ? data.filter((book: Book) => {
            if (!query) return true;
            const searchLower = query.toLowerCase();
            const titleMatch = book.title?.toLowerCase().includes(searchLower);
            const authorMatch = `${book.author_first_name || ''} ${book.author_last_name || ''}`
              .toLowerCase()
              .includes(searchLower);
            const categoryMatch = book.category?.toLowerCase().includes(searchLower);
            return titleMatch || authorMatch || categoryMatch;
          })
        : [];
      
      setBooks(filtered);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Tải sách thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto p-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body space-y-6">
            {/* Search Result Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                {query ? (
                  <>
                    Kết quả tìm kiếm cho:{' '}
                    <span className="text-primary">"{query}"</span>
                  </>
                ) : (
                  'Tìm kiếm sách'
                )}
              </h1>
              {!loading && query && (
                <p className="text-sm text-base-content/60">
                  Tìm thấy {books.length} kết quả
                </p>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center text-sm text-base-content/60 py-8">
                Đang tìm kiếm...
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            {/* Empty Query State */}
            {!loading && !error && !query && (
              <div className="text-center text-sm text-base-content/60 py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 mx-auto mb-4 opacity-30"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                Nhập từ khóa để tìm kiếm sách
              </div>
            )}

            {/* No Results State */}
            {!loading && !error && query && books.length === 0 && (
              <div className="text-center py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 mx-auto mb-4 opacity-30"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <p className="text-base-content/60 mb-2">
                  Không tìm thấy kết quả cho "{query}"
                </p>
                <p className="text-sm text-base-content/50">
                  Thử tìm kiếm với từ khóa khác
                </p>
              </div>
            )}

            {/* Books Grid */}
            {!loading && !error && books.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {books.map((book) => {
                  const authorFull = `${book.author_first_name || ''} ${book.author_last_name || ''}`.trim();
                  return (
                    <BookCard
                      key={book._id}
                      title={book.title}
                      author={authorFull || 'Không rõ tác giả'}
                      imageUrl={book.image_url}
                      size="a5"
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
}

export default Search;