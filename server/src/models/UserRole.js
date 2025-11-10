import mongoose from 'mongoose';
const userRoleSchema = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin','donor'], required: true },
}, { timestamps: true });
userRoleSchema.index({ user_id: 1, role: 1 }, { unique: true });
const UserRole = mongoose.model('UserRole', userRoleSchema);
export default UserRole;
