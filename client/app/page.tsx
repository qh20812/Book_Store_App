import React from 'react'
import Button from './components/ui/button'
import Navbar from './components/navbar'
import Footer from './components/footer'

const HomePage = () => {
  return (
    <div className='h-screen w-screen '>
      <Navbar />
      <h1 className='text-3xl font-bold'>Welcome to the Book Store</h1>
      <Button variant='secondary' size='lg' >Shop Now</Button>
      <Footer />
    </div>
  )
}

export default HomePage