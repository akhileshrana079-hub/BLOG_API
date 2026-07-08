'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { userApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

function ProfileInner() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    userApi
      .profile()
      .then(setProfile)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Your profile</h1>

      <div className="rounded-md border border-slate-200 bg-white p-4 text-sm">
        <p>
          <span className="text-slate-500">User ID:</span>{' '}
          <code className="text-xs">{user?.id}</code>
        </p>
        {profile && (
          <pre className="mt-2 overflow-auto rounded bg-slate-50 p-2 text-xs">
            {JSON.stringify(profile, null, 2)}
          </pre>
        )}
        {error && <p className="text-red-600">{error}</p>}
      </div>

      <button
        onClick={logout}
        className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
      >
        Logout
      </button>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileInner />
    </ProtectedRoute>
  );
}
