'use client';

import Link from 'next/link';

export default function DashboardPostsPage() {
  return (
    <main style={{ padding: '3rem', maxWidth: 960, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <p style={{ margin: 0, color: '#666' }}>Your Post Workspace</p>
          <h1>My Posts</h1>
        </div>
        <Link
          href='/dashboard/posts/new'
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 12,
            textDecoration: 'none',
          }}
        >
          Create post
        </Link>
      </div>

      <p style={{ marginTop: '1.5rem' }}>
        This page will show your posts and allow you to edit or delete them.
      </p>
    </main>
  );
}
