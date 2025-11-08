# Quick Start Guide - 5 Minutes to Running

## Prerequisites
- Node.js v16+ installed
- npm or yarn
- MongoDB (local or MongoDB Atlas account)

## Step 1: Setup Backend (2 min)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/donation-platform
JWT_SECRET=super_secret_key_change_in_production
```

Start backend:
```bash
npm run dev
```
✅ Backend running at http://localhost:3001

## Step 2: Setup Frontend (2 min)

In a new terminal (project root):
```bash
npm install
npm run dev
```
✅ Frontend running at http://localhost:5173

## Step 3: Test It (1 min)

1. Open http://localhost:5173
2. Click "Sign up"
3. Fill form:
   - Email: test@example.com
   - Password: password123
   - Name: Test User
   - Phone: 254712345678
   - Role: Donor
4. Click "Sign Up"
5. Submit a donation
6. Done! 🎉

## Available Accounts

### Test Admin Account
```
Email: admin@example.com
Password: password123
```

### Test Donor Account
```
Email: donor@example.com
Password: password123
```

*Create these after first backend start*

## Common Commands

### Backend
```bash
cd backend
npm run dev          # Development with hot-reload
npm start            # Production mode
npm run build        # Build backend (none needed)
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Lint code
```

## Database

### Local MongoDB
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows (if installed)
net start MongoDB
```

### MongoDB Atlas (Cloud)
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Copy connection string
4. Update `MONGODB_URI` in backend `.env`

## API Base URL

All API calls go to: `http://localhost:3001/api`

Example:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Project Structure

```
project/
├── src/              ← Frontend React code
├── backend/          ← Express.js backend
│   ├── routes/       ← API endpoints
│   ├── models/       ← Database schemas
│   ├── middleware/   ← Auth & error handling
│   └── server.js     ← Main server file
├── .env              ← Frontend config
└── README files      ← Documentation
```

## Troubleshooting

### Backend won't start
```bash
# Check if port 3001 is in use
lsof -i :3001

# Check MongoDB is running
# Try connecting with mongosh
mongosh
```

### API calls fail
- Ensure both servers are running
- Check browser console for errors
- Verify .env files are correct

### "Cannot connect to MongoDB"
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

### Port already in use
```bash
# Backend on different port
PORT=3002 npm run dev

# Update frontend .env to match
VITE_API_URL=http://localhost:3002/api
```

## Next Steps

1. ✅ Servers running? Great!
2. Create test accounts
3. Test all features
4. Update M-Pesa credentials if using payments
5. Set up MongoDB Atlas for production
6. Deploy to hosting service

## Documentation

- Full setup: Read `MIGRATION_GUIDE.md`
- Backend API: Read `backend/README.md`
- Architecture: Read `ARCHITECTURE.md`
- Details: Read `CONVERSION_SUMMARY.md`

## Useful URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- MongoDB local: mongodb://localhost:27017
- MongoDB docs: https://docs.mongodb.com

## Key Files to Know

- `backend/server.js` - Main Express server
- `backend/routes/auth.js` - Login/register
- `src/pages/DonorDashboard.tsx` - Donor view
- `src/pages/AdminDashboard.tsx` - Admin view
- `src/integrations/supabase/client.ts` - API client

That's it! You're ready to go. 🚀
