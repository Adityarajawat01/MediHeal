# MediHeal

MediHeal is a full-stack healthcare appointment platform where users can explore doctors and medical services, book appointments, and make online payments.

The project includes:
- Patient website
- Admin dashboard
- Doctor dashboard
- Online appointment system
- Stripe payment integration

Built using the MERN stack with Clerk authentication and Cloudinary image uploads.

---

## Features

- Browse doctors and healthcare services
- View doctor profiles, fees, and availability
- Book doctor appointments
- Book healthcare services/packages
- Pay online using Stripe
- Admin dashboard for managing doctors and services
- Doctor dashboard for managing appointments
- Authentication using Clerk
- Cloudinary image uploads
- MongoDB database integration

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Clerk

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Stripe
- Cloudinary

---

## Folder Structure

```bash
MediHeal/
├── admin/
├── backend/
├── frontend/
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/MediHeal.git
cd MediHeal
```

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install
```

---

## Environment Variables

Create a `.env` file inside the backend folder:

```env
CLERK_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
STRIPE_SECRET_KEY=
MONGODB_URI=
JWT_SECRET=
```

Frontend and admin:

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=
```

---

## Run Project

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Start admin panel:

```bash
cd admin
npm run dev
```

---

## Main Modules

### Patient Side
- Browse doctors
- Book appointments
- Online payments
- View appointments

### Doctor Dashboard
- Manage appointments
- Update profile details

### Admin Dashboard
- Manage doctors
- Manage services
- Track bookings

---

## Future Improvements

- Video consultation support
- Prescription management
- Appointment reminders
- Medical report uploads

---

## Author

Aditya Singh
