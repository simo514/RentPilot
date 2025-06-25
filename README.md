# Car Rental Management System

A full-stack car rental management system built with **React**, **Express**, and **MongoDB**. This application allows users to manage cars, rentals, and clients efficiently.

## Description

This Car Rental Management System streamlines the process of managing a car rental business by providing an intuitive dashboard and robust backend. The system enables administrators to track car inventory, manage rental transactions, and monitor client activity in real-time. With a modern and responsive user interface, the platform ensures seamless operations for both staff and customers.

The backend is built with Express and MongoDB, ensuring scalability and reliability, while the frontend leverages React and TailwindCSS for a fast and user-friendly experience. The application includes comprehensive validation, error handling, and follows best practices for security and maintainability.

## Architecture Overview

- **Frontend**: Built with React and TailwindCSS, providing a responsive and interactive user interface. Communicates with the backend via RESTful APIs.
- **Backend**: Node.js with Express handles API requests, business logic, and connects to MongoDB for data storage. Uses Mongoose for object modeling and Joi for request validation.
- **Database**: MongoDB stores information about cars, rentals, and clients, supporting efficient queries and scalability.

## Features

- **Dashboard**: View key statistics such as total rentals, revenue, active rentals, and available cars.
- **Car Management**: Add, edit, delete, and view cars with availability status.
- **Rental Management**: Create new rentals, view rental history, and return cars.
- **Validation**: Backend request validation using **Joi**.
- **Responsive Design**: Built with **TailwindCSS** for a modern and responsive UI.

## Functionality Overview

The Car Rental Management System provides the following core functionalities:

- **User Dashboard**: Displays real-time statistics, including total rentals, revenue, active rentals, and available cars, giving users a quick overview of business performance.
- **Car Inventory Management**: Allows administrators to add new cars, update car details, set availability status, and remove cars from the fleet.
- **Rental Processing**: Enables creation of new rental agreements, assignment of cars to clients, and automatic updating of car availability.
- **Rental History & Returns**: Users can view detailed rental histories, process car returns, and update the system accordingly.
- **Validation & Error Handling**: All backend requests are validated to ensure data integrity and prevent invalid operations.
- **Responsive UI**: The application is fully responsive, ensuring usability across desktops, tablets, and mobile devices.
a

These functionalities are designed to streamline daily operations, reduce manual errors, and provide actionable insights for car rental businesses.

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
