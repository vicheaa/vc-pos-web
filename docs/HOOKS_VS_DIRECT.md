# Hooks vs Direct API Calls

## You DON'T Need Hooks!

Hooks are **optional** - they're just a convenient pattern. You can absolutely call API functions directly.

## Two Approaches

### ❌ Without Hooks (Manual Approach)

```tsx
"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await api.getProducts({ page: 1, per_page: 20 });
        setProducts(data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return <div>{/* render products */}</div>;
}
```

**Problems with this approach:**

- ❌ No caching (refetches every time)
- ❌ Manual loading/error state management
- ❌ Need to handle refetching manually
- ❌ More boilerplate code
- ❌ Can cause duplicate requests if component re-renders

### ✅ With Hooks (React Query)

```tsx
"use client";
import { useProducts } from "@/hooks/useProductQueries";

function ProductsPage() {
  const { data, isLoading, error } = useProducts({ page: 1, perPage: 20 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return <div>{/* render products */}</div>;
}
```

**Benefits:**

- ✅ Automatic caching (no duplicate requests)
- ✅ Built-in loading/error states
- ✅ Automatic refetching on focus/reconnect
- ✅ Less code
- ✅ Optimistic updates
- ✅ Background updates

## When to Use Each

### Use Hooks When:

- 📊 Data fetching that needs caching
- 🔄 Lists/tables that might refetch
- 👥 Shared data across components
- ⚡ Need performance optimization

### Use Direct Calls When:

- 🚀 One-time actions (like form submissions)
- 🎯 Simple operations that don't need caching
- 📝 You prefer explicit control

## Example: Direct API Call

```tsx
// Simple form submission - no hook needed!
async function handleSubmit(formData) {
  try {
    await api.login(email, password);
    // Success!
  } catch (error) {
    // Handle error
  }
}
```

## Bottom Line

**Hooks are a convenience tool, not a requirement.** Use them when they help, skip them when they don't!
