# 🏠 RentEase Nepal — Rental Property Web Application

A modern, responsive rental property management web application built with **React + Vite**, focused on properties across Nepal (Kathmandu, Pokhara, Butwal, Ghorahi, Chitwan). Prices are listed in **NPR (Nepalese Rupees)**.

## ✨ Features

- **Property Listings** — Browse rooms and apartments across major cities in Nepal
- **Search & Filter** — Find properties by location, type, and price range
- **Property Details** — View detailed property information with owner contact
- **Authentication System** — Login and registration with role-based access
- **Role-based Dashboards**:
  - 🛡️ **Admin** — Manage properties, owners, tenants, and bookings
  - 🏢 **Property Owner** — List and manage owned properties
  - 🏠 **Tenant** — View bookings and rental information
- **Responsive Design** — Modern SaaS-style UI with 3D animations

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI Library |
| Vite 7 | Build Tool & Dev Server |
| React Router v7 | Client-side Routing |
| Axios | HTTP Client |
| CSS3 | Styling (custom, no framework) |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

```bash
# Clone the repository
git clone https://github.com/Grishma1245/RentalWeb_App.git

# Navigate to the project
cd RentalWeb_App

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rentease.com | admin123 |
| Owner | rajesh@rentease.com | owner123 |
| Tenant | hari@rentease.com | tenant123 |

## 📁 Project Structure

```
src/
├── assets/             # Images and static assets
├── components/         # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── PropertyCard.jsx
│   └── SearchBar.jsx
├── contexts/           # React Context providers
│   └── AuthContext.jsx
├── pages/              # Route page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Properties.jsx
│   ├── PropertyDetails.jsx
│   ├── AddProperty.jsx
│   ├── AdminDashboard.jsx
│   ├── PropertyOwnerDashboard.jsx
│   └── TenantDashboard.jsx
├── services/           # API service layer
│   └── api.js
├── styles.css          # Global styles
├── dashboard.css       # Dashboard-specific styles
├── App.jsx             # Root component with routing
└── main.jsx            # Application entry point
```

## 📄 License

This project is for educational purposes.
