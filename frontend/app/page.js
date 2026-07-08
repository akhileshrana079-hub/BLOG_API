'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import { blogApi } from '@/lib/api';

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    blogApi
      .list()
      .then(setBlogs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-8 py-12 text-white shadow-lg">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]" />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Stories from the Blog API
          </h1>
          <p className="mt-2 max-w-2xl text-white/90">
            Read posts written by our community. Sign in to share your own.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Latest posts</h2>
          <span className="text-sm text-slate-500">
            {loading ? '…' : `${blogs.length} ${blogs.length === 1 ? 'post' : 'posts'}`}
          </span>
        </div>

        {loading && (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-lg border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Failed to load posts: {error}
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-600">No posts yet.</p>
            <Link
              href="/blogs/new"
              className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Write the first one →
            </Link>
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
