
# 🌍 Aid Compassion Project

![MERN](https://img.shields.io/badge/MERN-Stack-blueviolet?style=flat-square\&logo=mongodb)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-orange?style=flat-square)

**Empowering communities through digital compassion.**

Aid Compassion is a full-stack **MERN** application that connects **donors, volunteers, and organizations** to humanitarian causes.
It enables users to donate, volunteer, and track impact in real time — fostering transparency and engagement in charitable giving.

---

## 📸 Preview

> Add screenshots or GIFs of your UI here (for example, your landing page, dashboard, or campaign view)

| Landing Page                                    | Dashboard                                      | Donation Flow                                     |
| ----------------------------------------------- | ---------------------------------------------- | ------------------------------------------------- |
| ![Landing Page](assets/screenshots/landing.png) | ![Dashboard](assets/screenshots/dashboard.png) | ![Donation Flow](assets/screenshots/donation.png) |

---

## 🚀 Tech Stack

**Frontend:** React.js, Redux Toolkit, Axios, Tailwind CSS / Material UI
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose)
**Authentication:** JWT, bcrypt.js
**Cloud & Tools:** Cloudinary / AWS S3, Nodemailer, Multer
**Deployment:** Vercel / Netlify (Frontend), Render / Railway (Backend)

---

## 🎯 Project Overview

Aid Compassion aims to simplify the process of giving and volunteering by bridging the gap between **donors and NGOs**.
It ensures **transparency**, **accountability**, and **real impact**.

### ✨ Key Features

* 🧾 **Secure Authentication** – Sign up, login, and role-based access using JWT.
* 🎁 **Donation System** – Donate money or resources to verified campaigns.
* ❤️ **Volunteer Opportunities** – Apply to campaigns and track volunteer hours.
* 🏢 **Organization Dashboard** – Manage campaigns, donations, and volunteers.
* 📊 **Impact Analytics** – Visualize performance with data-driven insights.
* ☁️ **Cloud Integration** – Upload campaign media to Cloudinary / AWS S3.
* 🔔 **Email Notifications** – Automated donor and volunteer communication.
* 📱 **Fully Responsive UI** – Works on desktop and mobile devices.

---

## 🧩 Folder Structure

```
aid-compassion/
│
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── redux/           # Redux slices & store
│   │   └── utils/           # Helpers & API setup
│   └── package.json
│
├── server/                  # Express backend
│   ├── config/              # DB and cloud configs
│   ├── controllers/         # Logic for routes
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API endpoints
│   ├── middlewares/         # Auth and validation
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/aid-compassion.git
cd aid-compassion
```

### 2️⃣ Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3️⃣ Configure environment variables

#### Server `.env`

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

#### Client `.env`

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4️⃣ Run the app

```bash
# Backend
cd server
npm run dev

# Frontend
cd ../client
npm start
```

The app should be running on:

* Frontend → `http://localhost:3000`
* Backend → `http://localhost:5000`

---

## 🧠 API Endpoints (Sample)

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| `POST` | `/api/auth/register`    | Register a user          |
| `POST` | `/api/auth/login`       | Authenticate user        |
| `GET`  | `/api/campaigns`        | Get all active campaigns |
| `POST` | `/api/donations`        | Submit a donation        |
| `GET`  | `/api/volunteers`       | List all volunteers      |
| `POST` | `/api/volunteers/apply` | Apply for a campaign     |

---

## 🧑‍💻 Contribution Guide

Contributions are welcome and greatly appreciated! 💙

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push your branch (`git push origin feature/your-feature`)
5. Submit a Pull Request

---

## 🛡️ License

This project is licensed under the **MIT License** — you’re free to use, modify, and distribute it.

---

## 💬 Contact

**Developer:** Your Name
📧 Email: [your.email@example.com](mailto:your.email@example.com)
🔗 GitHub: [@yourusername](https://github.com/yourusername)
🌐 Live Demo: [https://aidcompassion.org](https://aidcompassion.org)

---

## 🌱 Future Enhancements

* 💳 **Stripe / PayPal Integration** for secure payments
* 🗺️ **Interactive Campaign Map** (Mapbox / Google Maps API)
* 🌍 **Multi-language Support**
* 📱 **React Native Mobile App**
* 🤖 **AI Recommendation System** for donor-cause matching

---

## ⭐ Acknowledgements

* [MongoDB](https://www.mongodb.com/)
* [Express.js](https://expressjs.com/)
* [React.js](https://reactjs.org/)
* [Node.js](https://nodejs.org/)
* [Cloudinary](https://cloudinary.com/)
* [Tailwind CSS](https://tailwindcss.com/)



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
