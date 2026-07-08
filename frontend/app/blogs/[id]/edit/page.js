'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import BlogForm from '@/components/BlogForm';
import { blogApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

function EditBlogInner() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [initial, setInitial] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    blogApi
      .get(id)
      .then((blog) => {
        if (user && blog.author?.toString() !== user.id) {
          setError('You are not the author of this post.');
          return;
        }
        setInitial(blog);
      })
      .catch((err) => setError(err.message));
  }, [id, user]);

  if (error)
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );

  if (!initial) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-64 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Edit post</h1>
      <p className="mt-1 text-sm text-slate-600">Update your story.</p>
      <div className="mt-8">
        <BlogForm
          initial={initial}
          submitLabel="Update"
          onSubmit={async (payload) => {
            await blogApi.update(id, payload);
            router.push(`/blogs/${id}`);
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}

export default function EditBlogPage() {
  return (
    <ProtectedRoute>
      <EditBlogInner />
    </ProtectedRoute>
  );
}
