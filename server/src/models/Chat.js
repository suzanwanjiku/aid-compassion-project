import mongoose from 'mongoose';
const chatSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String },
  created_at: { type: Date, default: Date.now }
});
const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
