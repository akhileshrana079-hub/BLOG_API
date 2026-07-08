'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-slate-900">
          📝 Blog API
        </Link>

        <div className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Link
                href="/blogs/new"
                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 font-medium text-white shadow-sm transition hover:bg-indigo-500"
              >
                + New Post
              </Link>
              <Link
                href="/profile"
                className="rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 font-medium text-white shadow-sm transition hover:bg-indigo-500"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
