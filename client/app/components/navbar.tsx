'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Button from "./ui/button";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const loadUser = () => {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');
      if (token && userData && userData !== 'undefined') {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    const handleStorage = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (token && userData && userData !== 'undefined') {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [pathname, mounted]);

  // Prevent hydration mismatch by not rendering user-specific UI until mounted
  if (!mounted) {
    return (
      <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4">
        <div className="flex-1 min-w-0">
          <Link href="/" className="btn btn-ghost text-xl font-bold whitespace-nowrap">
            📚 Hiệu Sách
          </Link>
        </div>
        <div className="flex-none flex items-center gap-2">
          <form className="form-control">
            <input
              type="text"
              placeholder="Tìm sách..."
              className="input input-bordered w-32 sm:w-48 md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.full_name || user?.email || 'Người dùng';

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4">
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <Link href="/" className="btn btn-ghost text-xl font-bold whitespace-nowrap">
          📚 Hiệu Sách
        </Link>
        
        {user && user.role === 'admin' && (
          <div className="hidden lg:flex gap-1 ml-4">
            <Link 
              href="/admin/authors" 
              className={pathname === '/admin/authors' || pathname?.startsWith('/admin/authors/') 
                ? 'btn btn-sm btn-primary' 
                : 'btn btn-sm btn-ghost'}
            >
              Tác giả
            </Link>
            <Link 
              href="/admin/books" 
              className={pathname === '/admin/books' || pathname?.startsWith('/admin/books/') 
                ? 'btn btn-sm btn-primary' 
                : 'btn btn-sm btn-ghost'}
            >
              Sách
            </Link>
          </div>
        )}
      </div>

      <div className="flex-none flex items-center gap-2">
        <form onSubmit={handleSearch} className="form-control">
          <input
            type="text"
            placeholder="Tìm sách..."
            className="input input-bordered w-32 sm:w-48 md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar placeholder"
            >
              <div className="bg-neutral text-neutral-content rounded-full w-10">
                <span className="text-sm">{getInitials(displayName)}</span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-60 p-2 shadow-lg"
            >
              <li className="menu-title">
                <span>{displayName}</span>
                <span className="text-xs opacity-60">{user.email}</span>
              </li>
              <li>
                <a>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Hồ sơ
                </a>
              </li>
              <li>
                <a>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Cài đặt
                </a>
              </li>
              <li>
                <a>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  Yêu thích
                  <span className="badge badge-sm">0</span>
                </a>
              </li>
              <div className="divider my-1"></div>
              <li>
                <a onClick={handleLogout} className="text-error">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Đăng xuất
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2 flex-nowrap">
            <button className="btn btn-ghost btn-sm whitespace-nowrap" onClick={() => router.push('/login')}>
              Đăng nhập
            </button>
            <Button variant="primary" size="sm" onClick={() => router.push('/register')} className="whitespace-nowrap hidden sm:flex">
              Đăng ký
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
