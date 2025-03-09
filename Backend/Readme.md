# Attendance Management System (Backend)

This is the backend for an Attendance Management System built with Node.js, Express.js, and MongoDB.

## Features

- **User**: Register, login, mark attendance, view attendance, upload/edit profile picture, send leave requests.
- **Admin**: Manage users, manage attendance, manage leave requests, generate reports.

## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer

## Setup Instructions

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up MongoDB and update the `.env` file.
4. Run the application: `npm start`.

## API Endpoints

- **User Registration**: `POST /api/register`
- **User Login**: `POST /api/login`
- **Mark Attendance**: `POST /api/attendance`
- **View Attendance**: `GET /api/attendance`
- **Admin - Get All Users**: `GET /api/admin/users`
