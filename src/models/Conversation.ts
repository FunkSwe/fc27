import mongoose, { Document, model, models, Schema, Types } from 'mongoose';

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  isGroup: boolean;
  name?: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      trim: true,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = models.Conversation || model<IConversation>('Conversation', conversationSchema);
export default Conversation;
