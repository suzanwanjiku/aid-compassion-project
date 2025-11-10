import mongoose from 'mongoose';
const childrenHomeSchema = mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  contact: { type: String },
  description: { type: String }
}, { timestamps: true });
const ChildrenHome = mongoose.model('ChildrenHome', childrenHomeSchema);
export default ChildrenHome;
