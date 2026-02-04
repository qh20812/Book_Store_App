# Loading Component Usage

## Loading Component

### Basic Usage
```tsx
import Loading from '@/app/components/ui/loading';

// Default (spinner, md)
<Loading />

// Different types
<Loading type="spinner" size="xl" />
<Loading type="dots" size="lg" />
<Loading type="ring" size="md" />
<Loading type="ball" size="sm" />
<Loading type="bars" size="xs" />
<Loading type="infinity" size="lg" />
```

### Props
- `type`: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `className`: Additional CSS classes

---

## Loading Context (Global Loading)

### Setup
Already wrapped in `layout.tsx` with `LoadingProvider`.

### Usage in Components

```tsx
'use client';

import { useLoading } from '@/app/contexts/LoadingContext';

export default function MyComponent() {
  const { showLoading, hideLoading, isLoading } = useLoading();

  const handleClick = async () => {
    showLoading();
    try {
      await fetch('/api/data');
    } finally {
      hideLoading();
    }
  };

  return (
    <button onClick={handleClick}>
      {isLoading ? 'Loading...' : 'Fetch Data'}
    </button>
  );
}
```

### API
- `showLoading()` - Show global loading overlay
- `hideLoading()` - Hide global loading overlay
- `setLoading(boolean)` - Set loading state directly
- `isLoading` - Current loading state

---

## Examples

### Inline Loading
```tsx
<div className="flex items-center gap-2">
  <Loading type="spinner" size="sm" />
  <span>Processing...</span>
</div>
```

### Button with Loading
```tsx
<Button disabled={isLoading}>
  {isLoading && <Loading type="spinner" size="sm" className="mr-2" />}
  Submit
</Button>
```

### Full Page Loading
```tsx
const { showLoading, hideLoading } = useLoading();

useEffect(() => {
  showLoading();
  fetchData().finally(() => hideLoading());
}, []);
```
