# Car Rental Management System

A full-stack car rental management system built with **React**, **Express**, and **MongoDB**. This application allows users to manage cars, rentals, and clients efficiently.

## Features

- **Dashboard**: View key statistics such as total rentals, revenue, active rentals, and available cars.
- **Car Management**: Add, edit, delete, and view cars with availability status.
- **Rental Management**: Create new rentals, view rental history, and return cars.
- **Validation**: Backend request validation using **Joi**.
- **Responsive Design**: Built with **TailwindCSS** for a modern and responsive UI.


## Prerequisites

- **Node.js** (v18 or later)
- **MongoDB** (local or cloud instance)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/car-rental-management.git
   cd car-rental-management

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Set up environment variables:

Copy the .env.example file in the server directory to .env and fill in the required values:

PORT=4000
MONGO_URI=your_mongodb_connection_string

# Usage
Start the Backend Server:

cd server
npm run dev

Start the Frontend Development Server:

cd client
npm run dev

The frontend will be available at http://localhost:5173, and the backend will run at http://localhost:4000.

# Scripts
## Server

npm run dev: Start the backend server in development mode with nodemon.
npm start: Start the backend server in production mode.

## Client
npm run dev: Start the frontend development server.
npm run build: Build the frontend for production.
npm run preview: Preview the production build.

# Technologies Used

## Frontend
React: UI library
React Router: Client-side routing
TailwindCSS: Utility-first CSS framework
Vite: Fast development build tool

## Backend
Express: Web framework
MongoDB: Database
Mongoose: MongoDB object modeling
Joi: Request validation
dotenv: Environment variable management

# API Endpoints

Cars
POST /api/cars: Create a new car
GET /api/cars: Get all cars
GET /api/cars/:id: Get a car by ID
DELETE /api/cars/:id: Delete a car
PUT /api/cars/:id/availability: Update car availability

Rentals
POST /api/rentals: Create a new rental
GET /api/rentals: Get all rentals
GET /api/rentals/:id: Get a rental by ID
PUT /api/rentals/:id/return: Return a rental

# License
This project is licensed under the MIT License.


Feel free to customize the content as needed!
Feel free to customize the content as needed!
