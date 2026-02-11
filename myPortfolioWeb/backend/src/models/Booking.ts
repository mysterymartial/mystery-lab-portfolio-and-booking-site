import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  eventDate?: string;
  eventLocation?: string;
  budget?: string;
  additionalInfo?: string;
  status: string;
  deleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    serviceType: { type: String, required: true },
    eventDate: { type: String },
    eventLocation: { type: String },
    budget: { type: String },
    additionalInfo: { type: String },
    status: { type: String, default: 'pending' },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
