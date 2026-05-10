import mongoose, { Document, model, models, Schema, Types } from 'mongoose';

export interface IPostImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

export interface IPost extends Document {
  author: Types.ObjectId;
  title: string;
  content: string;
  type: 'news' | 'post';
  image?: IPostImage | null;
  imageUrl?: string;
  youtubeUrl?: string;
  linkUrl?: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const postImageSchema = new Schema<IPostImage>(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    width: Number,
    height: Number,
  },
  { _id: false },
);

const postSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['news', 'post'], default: 'post', index: true },
    image: { type: postImageSchema, default: null },
    imageUrl: { type: String, trim: true, default: '' },
    youtubeUrl: { type: String, trim: true, default: '' },
    linkUrl: { type: String, trim: true, default: '' },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Post = models.Post || model<IPost>('Post', postSchema);
export default Post;
