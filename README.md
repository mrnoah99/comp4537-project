
# Project

An application where users can register, log in, and access a dashboard. The application is built with a Django backend and a React frontend. Admin users have additional privileges, such as viewing all users and their API call counts.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [File Structure](#file-structure)

---

## Project Overview

This project includes:
- **Backend**: Django-based REST API server with token authentication.
- **Frontend**: React-based client that interacts with the backend via API requests.
- **Admin Dashboard**: Admin users can view all registered users and track their API call counts.

## Features

- **User Authentication**: Register and log in with token-based authentication.
- **User Dashboard**: Displayed based on user role (Admin vs. regular user).
- **Admin Dashboard**: Admin users can see all registered users and their API calls.
- **404 Page**: Custom 404 page for invalid URLs.
  
## Technology Stack

- **Backend**: Django, Django REST framework, SQLite
- **Frontend**: React, Axios, React Router

---

## Setup and Installation

### Prerequisites

- **Python** (3.8 or higher)
- **Node.js** and **npm**

### 1. Clone the Repository

```bash
git https://github.com/mrnoah99/comp4537-project
```

### 2. Backend Setup (Django)

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

On Windows:
```bash
venv\Scripts\activate
```
On macOS/Linux:
```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py makemigrations accounts
python manage.py migrate
```

Create a superuser (for admin access):

```bash
python manage.py createsuperuser
```

Start the Django server:

```bash
python manage.py runserver
```

### 3. Frontend Setup (React)

Navigate to the frontend folder:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

## Running the Application

Ensure both the Django backend and React frontend servers are running:

- Django runs on http://localhost:8000.
- React runs on http://localhost:3000.

Access the frontend in your browser at http://localhost:3000.

## API Endpoints

| Endpoint       | Method | Description                        | Auth Required |
|----------------|--------|------------------------------------|---------------|
| /api/register/ | POST   | Register a new user               | No            |
| /api/login/    | POST   | Log in a user and get token       | No            |
| /api/user/     | GET    | Get current user profile          | Yes           |
| /api/users/    | GET    | Get list of all users (admin-only)| Yes           |

## Usage of AI

In creation of this assignment, chatGPT, Gemeni and Copilot were used
