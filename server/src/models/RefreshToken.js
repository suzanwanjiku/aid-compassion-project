import mongoose from 'mongoose';
const refreshTokenSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  revoked: { type: Boolean, default: false },
  expiresAt: { type: Date }
}, { timestamps: true });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken;
