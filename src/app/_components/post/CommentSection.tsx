'use client';

import { useState } from 'react';
import styles from './PostStyles.module.scss';

interface CommentEntry {
  _id: string;
  content: string;
  author: { username: string } | string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  initialComments: CommentEntry[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentEntry[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!commentText.trim()) {
      setError('Enter a comment before sending.');
      return;
    }

    setLoading(true);

    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content: commentText }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data?.error || 'Could not save your comment.');
      setLoading(false);
      return;
    }

    setComments((current) => [...current, data]);
    setCommentText('');
    setLoading(false);
  };

  return (
    <section className={styles.commentSection}>
      <h4>Comments</h4>
      <div className={styles.commentList}>
        {comments.map((comment) => (
          <div key={comment._id} className={styles.commentItem}>
            <div className={styles.commentHeader}>
              <span>{typeof comment.author === 'string' ? comment.author : comment.author.username}</span>
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>

      <form className={styles.commentForm} onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder='Write a comment...'
          rows={4}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type='submit' className={styles.submitButton} disabled={loading}>
          {loading ? 'Posting...' : 'Post comment'}
        </button>
      </form>
    </section>
  );
}
