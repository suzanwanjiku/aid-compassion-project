# Supabase to Express.js + MongoDB Migration Guide

This project has been successfully converted from a Supabase backend to an Express.js + MongoDB architecture.

## What Changed

### Backend
- **Removed**: Supabase PostgREST API, authentication, edge functions
- **Added**: Express.js server with MongoDB database and JWT authentication
- **Location**: New `/backend` directory with complete API implementation

### Frontend
- **Removed**: Supabase client library calls and authentication
- **Modified**: All data fetching to use HTTP API calls via `apiClient`
- **Updated**: Authentication flow to use JWT tokens stored in localStorage

## Quick Start

### Backend Setup

1. Install Node.js (v16 or higher)

2. Navigate to backend directory:
```bash
cd backend
```

3. Install dependencies:
```bash
npm install
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Configure `.env`:
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/donation-platform
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_CALLBACK_URL=http://localhost:3001/api/transactions/mpesa-callback
```

6. Set up MongoDB:

**Option A: Local MongoDB** (if installed)
```bash
mongod
```

**Option B: MongoDB Atlas** (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string and update `MONGODB_URI` in `.env`

7. Start backend server:
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Backend runs on `http://localhost:3001`

### Frontend Setup

1. Install dependencies (in project root):
```bash
npm install
```

2. Frontend uses environment variable already set in `.env`:
```
VITE_API_URL=http://localhost:3001/api
```

3. Start frontend dev server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173` by default

## API Endpoints Reference

### Auth Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Donations
```
GET    /api/donations
POST   /api/donations
GET    /api/donations/:id
PUT    /api/donations/:id  (admin only)
```

### Children's Homes
```
GET    /api/children-homes
POST   /api/children-homes  (admin only)
GET    /api/children-homes/:id
PUT    /api/children-homes/:id  (admin only)
DELETE /api/children-homes/:id  (admin only)
```

### Distributions
```
GET    /api/distributions
POST   /api/distributions  (admin only)
GET    /api/distributions/:id
```

### Transactions
```
GET    /api/transactions
POST   /api/transactions
POST   /api/transactions/mpesa-callback
```

## Authentication Flow

1. User registers or logs in via `/api/auth/register` or `/api/auth/login`
2. Backend returns JWT token
3. Token stored in browser's localStorage
4. Token automatically attached to all subsequent API requests
5. Backend validates token on protected endpoints

## Database Schema

### MongoDB Collections

**users**
- _id: ObjectId
- email: string (unique)
- password: string (hashed)
- fullName: string
- phoneNumber: string
- role: string (admin | donor)
- createdAt: Date
- updatedAt: Date

**donations**
- _id: ObjectId
- donorId: ObjectId (ref: users)
- type: string (monetary | non_monetary)
- amount: number
- itemName: string
- itemDescription: string
- quantity: number
- quantityUnit: string
- status: string (pending | accepted | supplied | rejected)
- createdAt: Date
- updatedAt: Date

**childrenhomes**
- _id: ObjectId
- name: string
- location: string
- contactInfo: string
- registeredBy: ObjectId (ref: users)
- createdAt: Date
- updatedAt: Date

**distributions**
- _id: ObjectId
- donationId: ObjectId (ref: donations)
- childrenHomeId: ObjectId (ref: childrenhomes)
- distributedBy: ObjectId (ref: users)
- notes: string
- createdAt: Date

**transactions**
- _id: ObjectId
- donationId: ObjectId (ref: donations)
- mpesaRef: string
- checkoutRequestId: string
- amount: number
- phoneNumber: string
- status: string (pending | completed | failed)
- createdAt: Date
- updatedAt: Date

## File Structure Changes

### New Backend Structure
```
backend/
├── config/database.js
├── middleware/auth.js
├── middleware/errorHandler.js
├── models/User.js
├── models/Donation.js
├── models/ChildrenHome.js
├── models/Distribution.js
├── models/Transaction.js
├── routes/auth.js
├── routes/donations.js
├── routes/childrenHomes.js
├── routes/distributions.js
├── routes/transactions.js
├── .env.example
├── package.json
├── server.js
└── README.md
```

### Modified Frontend Files
```
src/
├── integrations/supabase/client.ts  (replaced with apiClient)
├── hooks/useAuth.tsx  (updated for JWT)
├── pages/Auth.tsx  (updated API calls)
├── pages/DonorDashboard.tsx  (updated API calls)
├── pages/AdminDashboard.tsx  (updated API calls)
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

### Backend (.env)
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/donation-platform
JWT_SECRET=your_secret_key
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_PASSKEY=your_passkey
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_CALLBACK_URL=http://localhost:3001/api/transactions/mpesa-callback
```

## Key Differences from Supabase

| Feature | Supabase | Express + MongoDB |
|---------|----------|-------------------|
| Authentication | Supabase Auth | JWT Tokens |
| Database | PostgreSQL | MongoDB |
| API Type | PostgREST (auto-generated) | Express routes (custom) |
| Real-time | Realtime subscriptions | HTTP polling |
| Edge Functions | Supported | Not needed (Express runs server-side) |
| Session Management | Supabase session | localStorage JWT |
| Authorization | Row Level Security (RLS) | Route middleware + app logic |
| Scalability | Managed service | Self-hosted or cloud VPS |

## Testing the Setup

### Test Backend
```bash
# Test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User","role":"donor"}'

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Frontend
1. Open http://localhost:5173
2. Go to Auth page
3. Register or login
4. Navigate to appropriate dashboard

## Deployment

### Backend Deployment Options

**Option 1: Heroku**
```bash
# Create Heroku app
heroku create donation-platform-api

# Add MongoDB Atlas
heroku addons:create mongolab

# Deploy
git push heroku main
```

**Option 2: AWS EC2**
1. Launch Ubuntu instance
2. Install Node.js and MongoDB
3. Clone repository
4. Run `npm install && npm start`

**Option 3: DigitalOcean App Platform**
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Frontend Deployment
Update `.env` to point to production backend URL:
```
VITE_API_URL=https://your-production-api.com/api
```

Then build and deploy:
```bash
npm run build
# Deploy dist/ folder to Vercel, Netlify, or any static hosting
```

## Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check `.env` file for correct values
- Check port 3001 isn't already in use

### API calls failing
- Verify backend is running on http://localhost:3001
- Check browser console for errors
- Ensure token is in localStorage after login

### MongoDB connection error
- Verify MongoDB URI in `.env`
- Ensure MongoDB service is running
- For Atlas: whitelist your IP address

### CORS errors
- Backend has CORS enabled by default
- Update `cors()` in server.js if needed

## Support Files

- `backend/README.md` - Detailed backend documentation
- `backend/.env.example` - Environment variables template
- This file - General migration guide

## Next Steps

1. **Customize Configuration**: Update M-Pesa credentials and JWT secret
2. **Set Up MongoDB**: Use MongoDB Atlas for production
3. **Configure Email**: Add email notifications for important events
4. **Enhance Security**: Add rate limiting, input validation, HTTPS
5. **Add Logging**: Implement comprehensive logging system
6. **Monitor**: Set up monitoring and error tracking

## Questions?

Refer to the backend `README.md` for more detailed information about API endpoints and database schema.
