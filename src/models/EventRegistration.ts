import mongoose, { Schema, models, model } from 'mongoose';

const eventRegistrationSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },

    country: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },

    message: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },

    hasAttended2025: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['registered', 'contacted', 'booking_fee_paid', 'confirmed'],
      default: 'registered',
    },
  },
  { timestamps: true },
);

eventRegistrationSchema.index({ email: 1, createdAt: -1 });

export default models.EventRegistration ||
  model('EventRegistration', eventRegistrationSchema);