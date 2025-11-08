# Donation Platform - System Architecture

## Overview

The application is now split into a decoupled frontend and backend architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│                                                               │
│  - Vite dev server: http://localhost:5173                   │
│  - React 18 with TypeScript                                 │
│  - Shadcn UI components                                     │
│  - React Router for navigation                              │
│  - TanStack Query (optional enhancement)                    │
│                                                               │
│  Pages:                                                       │
│  ├── Landing          - Home page                           │
│  ├── Auth             - Login/Register                      │
│  ├── DonorDashboard   - Submit donations                    │
│  └── AdminDashboard   - Manage donations & homes            │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP API (JSON)
                 │ Requests with JWT tokens
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Express.js)                            │
│                                                               │
│  - Express dev server: http://localhost:3001                │
│  - Node.js with TypeScript (ES modules)                     │
│  - RESTful API architecture                                 │
│  - JWT authentication                                       │
│  - Input validation (express-validator)                     │
│                                                               │
│  Route Modules:                                              │
│  ├── auth.js              - Auth endpoints                  │
│  ├── donations.js         - Donation CRUD                   │
│  ├── childrenHomes.js     - Home management                 │
│  ├── distributions.js     - Distribution tracking           │
│  └── transactions.js      - Payment handling                │
│                                                               │
│  Middleware:                                                 │
│  ├── auth.js              - JWT verification                │
│  └── errorHandler.js      - Error handling                  │
└────────────────┬────────────────────────────────────────────┘
                 │ Mongoose ODM
                 │ Database operations
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (MongoDB)                              │
│                                                               │
│  Collections:                                                │
│  ├── users                 - User accounts (admin/donor)    │
│  ├── donations             - Donation records               │
│  ├── childrenhomes         - Beneficiary organizations      │
│  ├── distributions         - Donation deliveries            │
│  └── transactions          - M-Pesa payments                │
│                                                               │
│  Indexes:                                                    │
│  - users.email (unique)                                     │
│  - donations.donorId, donations.status                      │
│  - childrenhomes.name                                       │
└─────────────────────────────────────────────────────────────┘
```

## Communication Flow

### 1. User Registration
```
Frontend Form → Auth Page → apiClient.post() → Backend /auth/register
    ↓
    Hash password + Store in MongoDB
    ↓
    Generate JWT token → Return token + user data
    ↓
    Frontend: Save token in localStorage
    ↓
    Navigate to appropriate dashboard
```

### 2. Donation Submission
```
Donor Dashboard Form → Validate input → apiClient.post(/donations)
    ↓
    Backend: authenticateToken middleware
    ↓
    Create Donation document in MongoDB
    ↓
    For monetary: Initiate M-Pesa payment
    ↓
    Return confirmation → Frontend toast notification
```

### 3. Admin Reviews Donations
```
Admin Dashboard → apiClient.get(/donations)
    ↓
    Backend: Query all donations from MongoDB
    ↓
    Return with populated donor info
    ↓
    Admin reviews and updates status → apiClient.put(/donations/:id)
    ↓
    Backend: Update MongoDB document
    ↓
    Optionally create distribution record
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND STATE                            │
│                                                               │
│  - useAuth() hook: User data, role, auth status             │
│  - Component state: Form inputs, tables, modals             │
│  - localStorage: JWT token (automatic)                      │
└─────────────────────────────────────────────────────────────┘
                         ↓ ↑
                    API Calls
                    with Token
                         ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND LOGIC                             │
│                                                               │
│  Request → Middleware → Route Handler → Database Query      │
│                                                               │
│  - Validates JWT token                                      │
│  - Checks user role/permissions                             │
│  - Sanitizes and validates input                            │
│  - Performs business logic                                  │
│  - Updates/retrieves from MongoDB                           │
│  - Returns JSON response                                    │
└─────────────────────────────────────────────────────────────┘
                         ↓ ↑
                   Data Persistence
                         ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                      MONGODB                                 │
│                                                               │
│  Collections store JSON documents                            │
│  Relationships via ObjectId references                       │
│  Automatic timestamps (createdAt, updatedAt)                │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

### Authentication
```
1. User provides credentials
    ↓
2. Backend hashes password with bcryptjs
    ↓
3. If valid, generate JWT with user info
    ↓
4. Frontend stores JWT in localStorage
    ↓
5. Each request includes: Authorization: Bearer <token>
    ↓
6. Backend verifies token with JWT_SECRET
    ↓
7. Extract user info from token for authorization
```

### Authorization
```
Routes protected by middleware:
    ├── authenticateToken - Requires valid JWT
    └── authorizeAdmin - Requires admin role

Permission levels:
    ├── Public - Landing page, auth
    ├── Authenticated - Donor/admin dashboards
    └── Admin only - Manage homes, approve donations, distributions
```

### Data Validation
```
User Input → express-validator → Type checking
    ↓
Mongoose schema validation
    ↓
Business logic constraints
    ↓
Database constraints
```

## API Endpoint Categories

### Public (No Auth Required)
```
POST /auth/register
POST /auth/login
```

### User (Authenticated)
```
GET  /auth/me
GET  /donations          (own donations for donors, all for admins)
POST /donations          (create own donation)
GET  /children-homes     (view all)
GET  /transactions       (own transactions for donors, all for admins)
POST /transactions       (create transaction for own donation)
```

### Admin (Authenticated + Admin Role)
```
PUT    /donations/:id              (update status)
POST   /children-homes             (create)
PUT    /children-homes/:id         (update)
DELETE /children-homes/:id         (delete)
POST   /distributions              (create)
GET    /distributions              (view all)
POST   /transactions/mpesa-callback (M-Pesa callback)
```

## Technology Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Shadcn/UI (Radix UI + Tailwind)
- **Router**: React Router v6
- **HTTP Client**: Fetch API (via apiClient wrapper)
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript (ES modules)
- **Database**: MongoDB
- **ODM**: Mongoose
- **Auth**: JWT with jsonwebtoken
- **Password**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors package

### DevOps
- **Frontend Dev Server**: Vite
- **Backend Dev Server**: Nodemon
- **Package Manager**: npm

## Deployment Considerations

### Frontend
- Build: `npm run build`
- Output: `dist/` directory (static files)
- Hosting: Vercel, Netlify, GitHub Pages, or any static hosting
- Update `VITE_API_URL` to production backend URL

### Backend
- Node.js 16+ required
- Environment variables for production
- MongoDB Atlas for cloud database
- Deployment: Heroku, Railway, DigitalOcean, AWS, etc.

### Environment Setup
```
Development:
  Frontend → http://localhost:5173
  Backend  → http://localhost:3001

Production:
  Frontend → https://yourdomain.com
  Backend  → https://api.yourdomain.com
```

## Model Relationships

```
User (1) ───────── (Many) Donation
  │
  ├───────────────── (Many) ChildrenHome (registered_by)
  └───────────────── (Many) Distribution (distributed_by)

Donation (1) ──────── (Many) Distribution
    │
    └────────────── (Many) Transaction

ChildrenHome (1) ──── (Many) Distribution
```

## Error Handling

```
Frontend:
  ├── Try/catch on API calls
  ├── Display toast notifications
  ├── Redirect on 401 (unauthorized)
  └── Show validation errors

Backend:
  ├── express-validator for input validation
  ├── Mongoose validation on models
  ├── Try/catch in route handlers
  ├── Error middleware catches all errors
  └── Returns appropriate HTTP status codes
```

## Future Enhancements

- Add WebSocket for real-time updates
- Implement refresh token rotation
- Add email notifications
- Implement file uploads (documents, receipts)
- Add SMS notifications
- Caching layer (Redis)
- GraphQL API alternative
- Mobile app with React Native
- Advanced search and filtering
- Analytics dashboard
