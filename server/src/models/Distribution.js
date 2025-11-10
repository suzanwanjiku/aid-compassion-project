import mongoose from 'mongoose';
const distributionSchema = mongoose.Schema({
  donation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  children_home_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildrenHome', required: true },
  distributed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String }
}, { timestamps: true });
const Distribution = mongoose.model('Distribution', distributionSchema);
export default Distribution;
