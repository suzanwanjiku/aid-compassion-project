import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['monetary', 'non_monetary'],
      required: true,
    },
    amount: Number,
    itemName: String,
    itemDescription: String,
    quantity: Number,
    quantityUnit: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'supplied', 'rejected'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Donation', DonationSchema);
