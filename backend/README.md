# Donation Platform Backend

Express.js + MongoDB backend for the donation platform application.

## Project Structure

```
backend/
├── config/
│   └── database.js           # MongoDB connection setup
├── middleware/
│   ├── auth.js              # JWT authentication & authorization
│   └── errorHandler.js      # Global error handling
├── models/
│   ├── User.js              # User schema with bcrypt password hashing
│   ├── Donation.js          # Donation schema
│   ├── ChildrenHome.js      # Children's home schema
│   ├── Distribution.js      # Distribution schema
│   └── Transaction.js       # M-Pesa transaction schema
├── routes/
│   ├── auth.js              # Authentication endpoints (register, login)
│   ├── donations.js         # Donation CRUD & management
│   ├── childrenHomes.js     # Children's homes management
│   ├── distributions.js     # Distribution management
│   └── transactions.js      # Transaction & M-Pesa callback handling
├── .env.example             # Environment variables template
├── server.js                # Main Express application
└── package.json             # Dependencies

```

## Setup Instructions

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `MPESA_*`: M-Pesa API credentials (if needed)

3. **Start the Server**

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Donations
- `POST /api/donations` - Create donation
- `GET /api/donations` - Get donations (filtered by role)
- `GET /api/donations/:id` - Get specific donation
- `PUT /api/donations/:id` - Update donation status (admin only)

### Children's Homes
- `POST /api/children-homes` - Create home (admin only)
- `GET /api/children-homes` - Get all homes
- `GET /api/children-homes/:id` - Get specific home
- `PUT /api/children-homes/:id` - Update home (admin only)
- `DELETE /api/children-homes/:id` - Delete home (admin only)

### Distributions
- `POST /api/distributions` - Create distribution (admin only)
- `GET /api/distributions` - Get all distributions
- `GET /api/distributions/:id` - Get specific distribution

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get transactions
- `POST /api/transactions/mpesa-callback` - M-Pesa callback endpoint

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are generated during login/registration and stored in browser localStorage on the frontend.

## Database Models

### User
- email (unique)
- password (hashed with bcryptjs)
- fullName
- phoneNumber
- role (admin | donor)

### Donation
- donorId (ref: User)
- type (monetary | non_monetary)
- amount (for monetary)
- itemName, itemDescription, quantity, quantityUnit (for non_monetary)
- status (pending | accepted | supplied | rejected)

### ChildrenHome
- name
- location
- contactInfo
- registeredBy (ref: User)

### Distribution
- donationId (ref: Donation)
- childrenHomeId (ref: ChildrenHome)
- distributedBy (ref: User)
- notes

### Transaction
- donationId (ref: Donation)
- amount
- phoneNumber
- mpesaRef
- checkoutRequestId
- status (pending | completed | failed)

## Frontend Integration

The frontend connects via the apiClient in `src/integrations/supabase/client.ts`. Update `VITE_API_URL` in `.env` to point to your backend URL.
