'use client';

import { type ReactNode } from 'react';
import styles from './PostStyles.module.scss';
import PostForm, { type PostFormData } from './PostForm';

interface PostModalProps {
  isOpen: boolean;
  title: string;
  role?: string;
  initialData?: PostFormData;
  onClose: () => void;
  onSaved: () => void;
}

export default function PostModal({
  isOpen,
  title,
  role,
  initialData,
  onClose,
  onSaved,
}: PostModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} role='dialog' aria-modal='true'>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button type='button' className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
        <div className={styles.modalBody}>
          <PostForm
            initialData={initialData}
            userRole={role}
            onCancel={onClose}
            onSuccess={() => {
              onSaved();
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
