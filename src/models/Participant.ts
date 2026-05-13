import { Document, model, models, Schema } from 'mongoose';

export interface IParticipant extends Document {
  name: string;
  email?: string;
  paid: boolean;
  paymentInfo?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const participantSchema = new Schema<IParticipant>(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    email: { type: String, trim: true, lowercase: true, default: '' },
    paid: { type: Boolean, default: false },
    paymentInfo: { type: String, trim: true, default: '', maxlength: 2000 },
    note: { type: String, trim: true, default: '', maxlength: 4000 },
  },
  { timestamps: true },
);

const Participant = models.Participant || model<IParticipant>('Participant', participantSchema);
export default Participant;
