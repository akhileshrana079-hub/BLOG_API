'use client';

import Link from 'next/link';

// Split-screen layout: form on the left, brand/quote on the right.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-[calc(100vh-65px)] -mt-8 -mx-4 grid grid-cols-1 lg:grid-cols-2">
      {/* Left side — form */}
      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 text-sm text-slate-600">{footer}</div>}
        </div>
      </div>

      {/* Right side — brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 lg:flex">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            📝 Blog API
          </Link>

          <div className="space-y-6">
            <blockquote className="text-2xl font-medium leading-snug">
              &ldquo;A simple place to write, share, and read — built on a tiny
              Express + MongoDB API.&rdquo;
            </blockquote>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">✓</span>
                JWT auth, password hashing via bcrypt
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">✓</span>
                Owner-only edit and delete
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">✓</span>
                Public read for all visitors
              </li>
            </ul>
          </div>

          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Blog API. Built with Next.js 14.
          </p>
        </div>
      </div>
    </div>
  );
}
