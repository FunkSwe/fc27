import mongoose, { Document, model, models, Schema, Types } from 'mongoose';

export interface IPost extends Document {
  author: Types.ObjectId;
  title: string;
  content: string;
  type: 'news' | 'post';
  imageUrl?: string;
  youtubeUrl?: string;
  linkUrl?: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['news', 'post'],
      default: 'post',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    youtubeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    linkUrl: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = models.Post || model<IPost>('Post', postSchema);
export default Post;
