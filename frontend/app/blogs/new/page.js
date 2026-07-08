'use client';

import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import BlogForm from '@/components/BlogForm';
import { blogApi } from '@/lib/api';

function NewBlogInner() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Write a new post</h1>
      <p className="mt-1 text-sm text-slate-600">Share something with the community.</p>
      <div className="mt-8">
        <BlogForm
          submitLabel="Publish"
          onSubmit={async (payload) => {
            const blog = await blogApi.create(payload);
            router.push(`/blogs/${blog._id}`);
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}

export default function NewBlogPage() {
  return (
    <ProtectedRoute>
      <NewBlogInner />
    </ProtectedRoute>
  );
}
