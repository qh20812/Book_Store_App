'use client';

import React, { useState } from 'react';
import Textarea from '../../components/ui/textarea';
import DateInput from '../../components/ui/date-input';
import Button from '../../components/ui/button';

export default function TextareaDateExamplePage() {
  const [bio, setBio] = useState('');
  const [description, setDescription] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [joinDate, setJoinDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ bio, description, birthDate, joinDate });
    alert('Form submitted! Check console for details.');
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-6">Textarea & Date Input Examples</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Textarea */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Textarea</h2>
                <Textarea
                  label="Your bio"
                  placeholder="Bio"
                  helperText="Optional"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="divider"></div>

              {/* Textarea with rows */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Textarea with Custom Height</h2>
                <Textarea
                  label="Book description"
                  placeholder="Enter a detailed description..."
                  helperText="Provide as much detail as possible"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="h-40"
                />
              </div>

              <div className="divider"></div>

              {/* Required Textarea */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Required Textarea</h2>
                <Textarea
                  label="Author biography"
                  placeholder="Write a brief biography..."
                  required
                  helperText="* Required field"
                />
              </div>

              <div className="divider"></div>

              {/* Textarea with Error */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Textarea with Error</h2>
                <Textarea
                  label="Comment"
                  placeholder="Your comment..."
                  error="This field cannot be empty"
                />
              </div>

              <div className="divider"></div>

              {/* Date Inputs */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Date Inputs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DateInput
                    label="Birth date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                  <DateInput
                    label="Join date"
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="divider"></div>

              {/* Date Input with Error */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Date Input with Error</h2>
                <DateInput
                  label="Publication date"
                  error="Please select a valid date"
                />
              </div>

              <div className="divider"></div>

              {/* Author Form Example */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Complete Author Form Example</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">First Name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Last Name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>

                  <DateInput
                    label="Date of birth"
                    helperText="Optional"
                  />

                  <Textarea
                    label="Biography"
                    placeholder="Write a brief biography about the author..."
                    helperText="Minimum 50 characters"
                    rows={4}
                  />

                  <div>
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="author@example.com"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Country</span>
                    </label>
                    <input
                      type="text"
                      placeholder="USA"
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Submit Form
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
