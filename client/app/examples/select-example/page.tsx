'use client';

import React, { useState } from 'react';
import Select from '../../components/ui/select';

export default function SelectExamplePage() {
  const [color, setColor] = useState('');
  const [category, setCategory] = useState('technology');
  const [size, setSize] = useState('');
  const [status, setStatus] = useState('');

  const colorOptions = [
    { value: 'crimson', label: 'Crimson' },
    { value: 'amber', label: 'Amber' },
    { value: 'velvet', label: 'Velvet' },
    { value: 'navy', label: 'Navy' },
    { value: 'forest', label: 'Forest' },
  ];

  const categoryOptions = [
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'technology', label: 'Technology' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' },
    { value: 'biography', label: 'Biography' },
  ];

  const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Extra Large' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'archived', label: 'Archived', disabled: true },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-6">Select Component Examples</h1>

            {/* Basic Select with Placeholder */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Basic Select with Placeholder</h2>
              <Select
                options={colorOptions}
                placeholder="Pick a color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                label="Choose your favorite color"
              />
              {color && <p className="text-sm">Selected: {color}</p>}
            </div>

            <div className="divider"></div>

            {/* Select with Default Value */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Select with Default Value</h2>
              <Select
                options={categoryOptions}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Book Category"
              />
              <p className="text-sm">Selected: {category}</p>
            </div>

            <div className="divider"></div>

            {/* Different Sizes */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Different Sizes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  options={colorOptions}
                  placeholder="Extra Small"
                  size="xs"
                  label="XS Size"
                />
                <Select
                  options={colorOptions}
                  placeholder="Small"
                  size="sm"
                  label="SM Size"
                />
                <Select
                  options={colorOptions}
                  placeholder="Medium"
                  size="md"
                  label="MD Size"
                />
                <Select
                  options={colorOptions}
                  placeholder="Large"
                  size="lg"
                  label="LG Size"
                />
              </div>
            </div>

            <div className="divider"></div>

            {/* Different Variants */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Different Variants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  options={categoryOptions}
                  placeholder="Primary"
                  variant="primary"
                  label="Primary Variant"
                />
                <Select
                  options={categoryOptions}
                  placeholder="Secondary"
                  variant="secondary"
                  label="Secondary Variant"
                />
                <Select
                  options={categoryOptions}
                  placeholder="Success"
                  variant="success"
                  label="Success Variant"
                />
                <Select
                  options={categoryOptions}
                  placeholder="Warning"
                  variant="warning"
                  label="Warning Variant"
                />
                <Select
                  options={categoryOptions}
                  placeholder="Error"
                  variant="error"
                  label="Error Variant"
                  error="This field has an error"
                />
                <Select
                  options={categoryOptions}
                  placeholder="Info"
                  variant="info"
                  label="Info Variant"
                />
              </div>
            </div>

            <div className="divider"></div>

            {/* With Disabled Options */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">With Disabled Options</h2>
              <Select
                options={statusOptions}
                placeholder="Select status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status (Archived is disabled)"
              />
            </div>

            <div className="divider"></div>

            {/* Filter Use Case Example */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Filter Use Case Example</h2>
              <div className="flex gap-4 flex-wrap">
                <Select
                  options={categoryOptions}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Filter by Category"
                  size="sm"
                />
                <Select
                  options={sizeOptions}
                  placeholder="Filter by Size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  label="Filter by Size"
                  size="sm"
                />
                <Select
                  options={statusOptions}
                  placeholder="Filter by Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Filter by Status"
                  size="sm"
                />
              </div>
              <div className="alert alert-info mt-4">
                <span>
                  Filters: Category={category || 'none'}, Size={size || 'none'}, Status={status || 'none'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
