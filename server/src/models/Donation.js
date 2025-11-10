import mongoose from 'mongoose';
const donationSchema = mongoose.Schema({
  amount: { type: Number, required: true },
  donor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  children_home_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildrenHome' },
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now },
  notes: { type: String }
});
const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
