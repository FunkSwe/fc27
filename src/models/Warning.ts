import mongoose, { Document, model, models, Schema, Types } from 'mongoose';

export interface IWarning extends Document {
  user: Types.ObjectId;
  post?: Types.ObjectId | null;
  issuedBy: Types.ObjectId;
  message: string;
  status: 'open' | 'read' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const warningSchema = new Schema<IWarning>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
    issuedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['open', 'read', 'resolved'], default: 'open', index: true },
  },
  { timestamps: true },
);

const Warning = models.Warning || model<IWarning>('Warning', warningSchema);
export default Warning;
