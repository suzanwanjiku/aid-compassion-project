import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import donationRoutes from './routes/donations.js';
import childrenHomesRoutes from './routes/childrenHomes.js';
import distributionRoutes from './routes/distributions.js';
import transactionRoutes from './routes/transactions.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/children-homes', childrenHomesRoutes);
app.use('/api/distributions', distributionRoutes);
app.use('/api/transactions', transactionRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
