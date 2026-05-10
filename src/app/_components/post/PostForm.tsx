'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PostStyles.module.scss';

export interface PostImageData {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

export interface PostFormData {
  id?: string;
  title: string;
  content: string;
  type: 'news' | 'post';
  image?: PostImageData | null;
  imageUrl: string;
  youtubeUrl: string;
  linkUrl: string;
  tags: string;
}

interface PostFormProps {
  initialData?: PostFormData;
  userRole?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const defaultData: PostFormData = {
  title: '',
  content: '',
  type: 'post',
  image: null,
  imageUrl: '',
  youtubeUrl: '',
  linkUrl: '',
  tags: '',
};

export default function PostForm({ initialData, userRole, onSuccess, onCancel }: PostFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<PostFormData>(initialData || defaultData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.image?.url || initialData?.imageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormState(initialData);
      setPreviewUrl(initialData.image?.url || initialData.imageUrl || '');
      setSelectedFile(null);
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const setField = (field: keyof PostFormData, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleImageFile = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(formState.image?.url || formState.imageUrl || '');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }

    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadSelectedImage = async () => {
    if (!selectedFile) return formState.image || null;

    const uploadData = new FormData();
    uploadData.append('file', selectedFile);

    const response = await fetch('/api/upload', { method: 'POST', body: uploadData });
    const data = await response.json();

    if (!response.ok) throw new Error(data?.error || 'Image upload failed.');
    return data.image as PostImageData;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formState.title.trim() || !formState.content.trim()) {
      setError('Title and content are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const uploadedImage = await uploadSelectedImage();
      const payload = {
        title: formState.title,
        content: formState.content,
        type: formState.type,
        image: uploadedImage,
        imageUrl: formState.imageUrl,
        youtubeUrl: formState.youtubeUrl,
        linkUrl: formState.linkUrl,
        tags: formState.tags,
      };

      const url = initialData?.id ? `/api/posts/${initialData.id}` : '/api/posts';
      const method = initialData?.id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || 'Failed to save post.');
        setIsSubmitting(false);
        return;
      }

      setFormState(defaultData);
      setSelectedFile(null);
      setPreviewUrl('');
      onSuccess?.();
      router.refresh();
    } catch (submitError) {
      console.error(submitError);
      setError(submitError instanceof Error ? submitError.message : 'Could not save the post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canChooseNews = userRole === 'admin';

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Title
          <input className={styles.input} value={formState.title} onChange={(event) => setField('title', event.target.value)} placeholder='Post title' required />
        </label>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Featured image URL
          <input className={styles.input} value={formState.imageUrl} onChange={(event) => setField('imageUrl', event.target.value)} placeholder='Optional external image URL' />
        </label>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Upload image from device
          <input className={styles.input} type='file' accept='image/*' onChange={(event) => handleImageFile(event.target.files?.[0] || null)} />
        </label>
        {previewUrl ? <img className={styles.imagePreview} src={previewUrl} alt='Selected preview' /> : null}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          YouTube URL
          <input className={styles.input} value={formState.youtubeUrl} onChange={(event) => setField('youtubeUrl', event.target.value)} placeholder='https://www.youtube.com/watch?v=...' />
        </label>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Link URL
          <input className={styles.input} value={formState.linkUrl} onChange={(event) => setField('linkUrl', event.target.value)} placeholder='Optional external link URL' />
        </label>
      </div>

      {canChooseNews ? (
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Post type
            <select className={styles.input} value={formState.type} onChange={(event) => setField('type', event.target.value)}>
              <option value='post'>Community post</option>
              <option value='news'>News post</option>
            </select>
          </label>
        </div>
      ) : <input type='hidden' value='post' />}

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Content
          <textarea className={styles.textarea} value={formState.content} onChange={(event) => setField('content', event.target.value)} placeholder='Write your post content here...' rows={10} required />
        </label>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Tags (comma separated)
          <input className={styles.input} value={formState.tags} onChange={(event) => setField('tags', event.target.value)} placeholder='news, camp, music' />
        </label>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type='submit' className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update post' : 'Publish post'}
        </button>
        {onCancel && <button type='button' className={styles.cancelButton} onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
