import Link from 'next/link';

export default function BlogCard({ blog }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <Link href={`/blogs/${blog._id}`} className="block">
        <h2 className="line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
          {blog.title}
        </h2>
      </Link>
      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{blog.content}</p>
      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-400">
        <span>by {blog.author?.toString().slice(-6) || 'unknown'}</span>
        <Link
          href={`/blogs/${blog._id}`}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}
