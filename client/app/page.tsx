'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './components/ui/button';
import Navbar from './components/navbar';
import Footer from './components/footer';

const HomePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-1 container mx-auto p-8'>
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <h1 className='text-4xl font-bold mb-4'>
              📚 Welcome to the Book Store
            </h1>
            
            {user ? (
              <div className='space-y-4'>
                <div className='alert alert-success'>
                  <span>✓ Welcome back, {user.full_name}!</span>
                </div>
                
                <div className='stats shadow'>
                  <div className='stat'>
                    <div className='stat-title'>Logged in as</div>
                    <div className='stat-value text-2xl'>{user.email}</div>
                    <div className='stat-desc'>Role: {user.roles?.join(', ') || 'User'}</div>
                  </div>
                </div>

                <div className='flex gap-4 flex-wrap'>
                  <Button variant='primary' size='lg'>
                    Browse Books
                  </Button>
                  <Button variant='secondary' size='lg'>
                    View Authors
                  </Button>
                  <Button variant='error' onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className='space-y-4'>
                <div className='alert alert-info'>
                  <span>Please login to access the book store</span>
                </div>
                
                <div className='flex gap-4 flex-wrap'>
                  <Button variant='primary' size='lg' onClick={() => router.push('/login')}>
                    Login
                  </Button>
                  <Button variant='secondary' size='lg' onClick={() => router.push('/register')}>
                    Register
                  </Button>
                  <Button variant='accent' size='lg'>
                    Shop Now
                  </Button>
                </div>
              </div>
            )}

            <div className='divider'></div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='card bg-base-200'>
                <div className='card-body'>
                  <h2 className='card-title'>📖 Books Collection</h2>
                  <p>Browse and manage our extensive collection of books</p>
                </div>
              </div>
              
              <div className='card bg-base-200'>
                <div className='card-body'>
                  <h2 className='card-title'>✍️ Authors</h2>
                  <p>Discover authors and their published works</p>
                </div>
              </div>
              
              <div className='card bg-base-200'>
                <div className='card-body'>
                  <h2 className='card-title'>👤 Your Account</h2>
                  <p>Manage your profile and preferences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;