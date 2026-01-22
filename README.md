<div align="center">

# 🚗 RentPilot

### Modern Car Rental Management System

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.1.1-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A full-stack car rental management system designed to streamline your rental business operations with an intuitive dashboard, secure authentication, and comprehensive rental tracking.

[Features](#-features) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Tech Stack](#-tech-stack)

</div>

---

## 📋 Overview

**RentPilot** is a comprehensive car rental management solution that helps rental businesses track their fleet, manage bookings, and monitor revenue—all from a single, elegant dashboard. Built with modern technologies and best practices, it offers a secure, scalable, and user-friendly experience.

### Why RentPilot?

- 🎯 **Purpose-Built**: Designed specifically for car rental businesses
- 🔒 **Secure**: Session-based authentication with HTTP-only cookies
- 📊 **Insightful**: Real-time dashboard with key business metrics
- 🚀 **Fast**: Optimized API calls and efficient data fetching
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile

---

## ✨ Features

### 🏠 Dashboard
- Real-time statistics overview
- Monthly revenue tracking
- Active rentals count
- Available cars indicator
- Recent rentals table with quick access

### 🚗 Car Management
- Add new vehicles with images
- Track car availability status
- Update car details and specifications
- Remove vehicles from fleet
- License plate (matricule) tracking

### 📝 Rental Management
- Create new rental agreements
- Client information management
- Document upload support
- Automatic price calculation
- Rental contract generation
- Return processing

### 🔐 Authentication & Security
- Session-based authentication (30-day sessions)
- HTTP-only secure cookies
- Protected API routes
- Rate limiting
- Helmet security headers
- CORS configuration

### 📊 Reporting
- Rental history with filtering
- Revenue reports
- Export capabilities
- Detailed rental summaries

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │Dashboard│  │  Cars   │  │ Rentals │  │ Reports │           │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘           │
│       └────────────┴────────────┴────────────┘                 │
│                           │                                     │
│                    Zustand Store                                │
└───────────────────────────┬─────────────────────────────────────┘
                            │ REST API
┌───────────────────────────┴─────────────────────────────────────┐
│                      Backend (Express)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Auth   │  │   Cars   │  │ Rentals  │  │ Contract │       │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       └─────────────┴─────────────┴─────────────┘              │
│                           │                                     │
│              ┌────────────┴────────────┐                       │
│              │  Middleware (Auth, Joi) │                       │
│              └────────────┬────────────┘                       │
│                           │                                     │
│              ┌────────────┴────────────┐                       │
│              │    Error Handler +      │                       │
│              │    Winston Logger       │                       │
│              └─────────────────────────┘                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                      MongoDB Database                           │
│         ┌──────┐      ┌──────────┐      ┌──────────┐           │
│         │ Cars │      │ Rentals  │      │Templates │           │
│         └──────┘      └──────────┘      └──────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
RentPilot/
├── 📂 client/                    # Frontend React application
│   ├── 📂 src/
│   │   ├── 📂 components/        # Reusable UI components
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── 📂 pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Cars.tsx
│   │   │   ├── RentalForm.tsx
│   │   │   ├── RentalHistory.tsx
│   │   │   ├── RentalDetails.tsx
│   │   │   ├── RentalSummary.tsx
│   │   │   ├── Report.tsx
│   │   │   └── Login.tsx
│   │   ├── 📂 store/             # Zustand state management
│   │   │   ├── carStore.tsx
│   │   │   ├── rentalHistoryStore.tsx
│   │   │   ├── authStore.ts
│   │   │   └── countriesStore.ts
│   │   ├── 📂 lib/               # Utilities & configurations
│   │   │   └── axios.ts
│   │   └── 📂 utils/             # Helper functions & types
│   │       ├── cars.ts
│   │       └── moroccanCities.ts
│   ├── package.json
│   └── vite.config.ts
│
├── 📂 server/                    # Backend Express application
│   ├── 📂 config/                # Configuration files
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── swagger.js
│   ├── 📂 controllers/           # Request handlers
│   │   ├── car.controller.js
│   │   ├── rental.controller.js
│   │   └── contractTemplate.controller.js
│   ├── 📂 middleware/            # Custom middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validateRequest.js
│   ├── 📂 models/                # Mongoose schemas
│   │   ├── Car.js
│   │   ├── Rental.js
│   │   └── ContractTemplate.js
│   ├── 📂 routes/                # API route definitions
│   │   ├── auth.routes.js
│   │   ├── car.routes.js
│   │   ├── rental.routes.js
│   │   └── contractTemplate.routes.js
│   ├── 📂 utils/                 # Utilities
│   │   ├── AppError.js
│   │   ├── logger.js
│   │   └── contrat.html
│   ├── 📂 validators/            # Joi validation schemas
│   │   ├── car.validator.js
│   │   └── rental.validator.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** v18 or later
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/RentPilot.git
   cd RentPilot
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development

   # Database
   MONGO_URI=mongodb://localhost:27017/rentpilot

   # Authentication
   SESSION_SECRET=your-super-secret-key-change-in-production
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start the application**
   ```bash
   # Terminal 1 - Start backend
   cd server
   npm run dev

   # Terminal 2 - Start frontend
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - API Documentation: http://localhost:4000/api-docs

---

## 📚 API Documentation

### Interactive Documentation

Access the full Swagger documentation at `/api-docs` when running the server.

### Endpoints Overview

#### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login with credentials |
| `POST` | `/api/auth/logout` | End session |
| `GET` | `/api/auth/session` | Check session status |

#### 🚗 Cars
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cars` | Get all cars |
| `GET` | `/api/cars/:id` | Get car by ID |
| `POST` | `/api/cars` | Create new car |
| `PUT` | `/api/cars/:id` | Update car |
| `DELETE` | `/api/cars/:id` | Delete car |
| `PUT` | `/api/cars/:id/availability` | Toggle availability |

#### 📝 Rentals
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/rentals` | Get all rentals |
| `GET` | `/api/rentals?limit=5&sort=-createdAt` | Get recent rentals |
| `GET` | `/api/rentals/:id` | Get rental by ID |
| `POST` | `/api/rentals` | Create new rental |
| `PUT` | `/api/rentals/:id/return` | Process car return |

#### 📄 Contract Templates
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/contract-template` | Get contract template |
| `PUT` | `/api/contract-template` | Update template |

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Library |
| TypeScript | Type Safety |
| Vite | Build Tool |
| TailwindCSS | Styling |
| Zustand | State Management |
| React Router | Navigation |
| Axios | HTTP Client |
| Lucide React | Icons |
| React Toastify | Notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Express 5 | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| Joi | Validation |
| Winston | Logging |
| Express Session | Authentication |
| Helmet | Security |
| Swagger | API Documentation |
| Cloudinary | Image Storage |

---

## 📜 Available Scripts

### Server
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
```

### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🔒 Security Features

- **Session-based Authentication**: Secure HTTP-only cookies with 30-day expiration
- **Rate Limiting**: Prevents brute force attacks
- **Helmet.js**: Sets security HTTP headers
- **CORS**: Configured for specific origins
- **Input Validation**: All requests validated with Joi
- **Error Handling**: Centralized error handling with sanitized responses
- **Logging**: Winston logger for audit trails

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for car rental businesses**

[⬆ Back to Top](#-rentpilot)

</div>
