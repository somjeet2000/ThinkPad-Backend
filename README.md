# ThinkPad-Backend

## Overview

ThinkPad-Backend is a Node.js-based backend application that provides API services. It includes authentication, middleware, and database connectivity.

## Features

- User authentication and authorization
- Note Management with proper authentication
- Middleware for request handling
- Database integration

## Installation

### Prerequisites

- Node.js (>=14)
- npm (Node Package Manager)
- MongoDB Atlas

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/somjeet2000/ThinkPad-Backend.git
   cd ThinkPad-Backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add required environment variables (e.g., `MONGO_URI`, `PORT`, `JWT_SECRET`, `GMAIL_AUTH`).

4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/createuser` - User Registration
- `POST /api/auth/login` - User Login
- `POST /api/auth/getuser` - Get the User. Login Required.
- `DELETE /api/auth/deleteuser` - Delete the User. Login Required.

### Notes Management

- `GET /api/notes/fetchallnotes` - Fetch all notes. Login Required.
- `POST /api/notes/addnote` - Create a new note. Login Required.
- `PUT /api/notes/updatenote/:id` - Update a note. Login Required.
- `DELETE /api/notes/deletenode/:id` - Delete a note. Login Required.

### Feedback

- `POST /api/feedback/submitFeedback` - Submit Feedback

### Forgot Password

- `POST /api/forgotpassword/forgotpassword` - Forgot Password
- `PUT /api/forgotpassword/resetpassword` - Reset Password

## Deployment

### Using Docker

1. Build the Docker image:
   ```sh
   docker build -t thinkpad-backend -f deploy/Dockerfile .
   ```
2. Run the container:
   ```sh
   docker run -p 5000:5000 thinkpad-backend
   ```

## Contributing

Feel free to fork the repository and submit pull requests.
