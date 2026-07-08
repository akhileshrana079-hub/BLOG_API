'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { blogApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    blogApi
      .get(id)
      .then(setBlog)
      .catch((err) => setError(err.message));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await blogApi.remove(id);
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (error)
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );

  if (!blog) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="h-40 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  const isOwner = user && blog.author?.toString() === user.id;

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
        ← All posts
      </Link>

      <header className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {blog.title}
        </h1>
        <p className="text-sm text-slate-500">
          by <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{blog.author}</code>
        </p>
      </header>

      <div className="whitespace-pre-wrap text-lg leading-relaxed text-slate-800">
        {blog.content}
      </div>

      {isOwner && (
        <div className="flex gap-2 border-t border-slate-200 pt-6">
          <Link
            href={`/blogs/${blog._id}/edit`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      )}
    </article>
  );
}
