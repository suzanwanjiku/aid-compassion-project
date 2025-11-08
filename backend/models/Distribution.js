import mongoose from 'mongoose';

const DistributionSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      required: true,
    },
    childrenHomeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChildrenHome',
      required: true,
    },
    distributedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Distribution', DistributionSchema);
