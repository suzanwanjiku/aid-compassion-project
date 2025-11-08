
### 3. File Structure

```
project/
├── src/                          (Frontend - React)
│   ├── pages/
│   │   ├── Auth.tsx             
│   │   ├── DonorDashboard.tsx   
│   │   ├── AdminDashboard.tsx   
│   │   └── ...
│   ├── hooks/
│   │   └── useAuth.tsx          
│   ├── integrations/supabase/
│   │   └── client.ts            
│   └── ...
│
├── backend/                      (- Express.js)
│   ├── config/
│   │   └── database.js          (MongoDB connection)
│   ├── middleware/
│   │   ├── auth.js              (JWT authentication)
│   │   └── errorHandler.js      (Error handling)
│   ├── models/
│   │   ├── User.js              (User model)
│   │   ├── Donation.js          (Donation model)
│   │   ├── ChildrenHome.js      (Home model)
│   │   ├── Distribution.js      (Distribution model)
│   │   └── Transaction.js       (Transaction model)
│   ├── routes/
│   │   ├── auth.js              (Auth endpoints)
│   │   ├── donations.js         (Donation endpoints)
│   │   ├── childrenHomes.js     (Home endpoints)
│   │   ├── distributions.js     (Distribution endpoints)
│   │   └── transactions.js      (Transaction endpoints)
│   ├── server.js                (Main Express app)
│   ├── package.json             (Backend dependencies)
│   ├── .env.example             (Environment template)
│   └── README.md                (Backend documentation)
│
├── .env                         ( API URL only)
├── MIGRATION_GUIDE.md           ( Setup instructions)
├── ARCHITECTURE.md              (System design)
```