'use client';

import React from 'react';
import Input from '../../components/ui/input';
import { EmailIcon, PasswordIcon } from '../../components/ui/icons';
import Button from '../../components/ui/button';

export default function ExamplePage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Input Component Examples</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <Input
              type="email"
              placeholder="mail@site.com"
              icon={<EmailIcon />}
              validationHint="Enter valid email address"
              required
            />

            {/* Password Field */}
            <Input
              type="password"
              placeholder="Password"
              icon={<PasswordIcon />}
              required
              minLength={8}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              validationHint={
                <>
                  Must be more than 8 characters, including
                  <br />
                  At least one number <br />
                  At least one lowercase letter <br />
                  At least one uppercase letter
                </>
              }
            />

            {/* Simple Text Input */}
            <Input
              type="text"
              placeholder="Enter your name"
              label="Full Name"
              required
            />

            {/* Input with Error */}
            <Input
              type="text"
              placeholder="Username"
              label="Username"
              error="This username is already taken"
            />

            {/* Submit Button */}
            <Button variant="primary" fullWidth type="submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
