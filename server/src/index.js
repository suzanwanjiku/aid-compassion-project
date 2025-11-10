import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());

connectDB();

app.use('/api/users', userRoutes);
import donationRoutes from './routes/donationRoutes.js';
import childrenRoutes from './routes/childrenRoutes.js';
import distributionRoutes from './routes/distributionRoutes.js';
import userRoleRoutes from './routes/userRoleRoutes.js';
app.use('/api/donations', donationRoutes);
app.use('/api/children_homes', childrenRoutes);
app.use('/api/distributions', distributionRoutes);
app.use('/api/user_roles', userRoleRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Aid Compassion Hub API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
app.use(notFound);
app.use(errorHandler);

import mpesaRoutes from './routes/mpesaRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/chat', chatRoutes);
