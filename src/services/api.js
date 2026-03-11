/**
 * api.js - API Service Layer
 * 
 * Contains Axios instance and API functions for communicating
 * with the backend. Uses Nepal-focused mock data with rooms
 * and apartments in cities like Kathmandu, Butwal, Ghorahi,
 * Pokhara, and Chitwan. Prices are in NPR (Nepalese Rupees).
 */

import axios from 'axios';

// ---- Axios Instance ----
// Base URL can be updated when the backend is available
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update this to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================================================
// MOCK DATA - Nepal-focused rooms and apartments
// ================================================
export const mockProperties = [
  {
    id: 1,
    title: 'Modern Apartment in Kathmandu',
    location: 'Baneshwor, Kathmandu',
    price: 25000,
    type: 'Apartment',
    description:
      'A beautifully designed 2BHK apartment in the heart of Kathmandu. Features modern interiors, a spacious balcony with mountain views, fully equipped kitchen, and 24/7 water supply. Close to schools, hospitals, and shopping malls. Ideal for young professionals and small families.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    owner: 'Ramesh Shrestha',
    ownerContact: 'ramesh@example.com',
    ownerPhone: '+977 9841234567',
    bedrooms: 2,
    bathrooms: 2,
    area: '1100 sq ft',
    furnished: 'Fully Furnished',
    parking: 'Yes',
    posted: '2026-02-15',
  },
  {
    id: 2,
    title: 'Cozy Room in Pokhara',
    location: 'Lakeside, Pokhara',
    price: 8000,
    type: 'Room',
    description:
      'A cozy single room with attached bathroom near the beautiful Phewa Lake. Enjoy stunning Annapurna mountain views from your window. The room is well-ventilated with natural light, includes a bed, wardrobe, and study table. WiFi and electricity included in rent. Perfect for students and solo travelers.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80',
    owner: 'Sita Gurung',
    ownerContact: 'sita@example.com',
    ownerPhone: '+977 9856123456',
    bedrooms: 1,
    bathrooms: 1,
    area: '250 sq ft',
    furnished: 'Fully Furnished',
    parking: 'No',
    posted: '2026-03-01',
  },
  {
    id: 3,
    title: 'Spacious Apartment in Butwal',
    location: 'Traffic Chowk, Butwal',
    price: 15000,
    type: 'Apartment',
    description:
      'A spacious 3BHK apartment located near Traffic Chowk, Butwal. Features a large living room, modern kitchen, marble flooring, and a dedicated parking space. The apartment is on the 2nd floor with good ventilation and sunlight. Close to markets, banks, and public transport.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    owner: 'Hari Prasad Poudel',
    ownerContact: 'hari@example.com',
    ownerPhone: '+977 9847654321',
    bedrooms: 3,
    bathrooms: 2,
    area: '1400 sq ft',
    furnished: 'Semi Furnished',
    parking: 'Yes',
    posted: '2026-02-28',
  },
  {
    id: 4,
    title: 'Budget Room in Ghorahi',
    location: 'Ghorahi, Dang',
    price: 5000,
    type: 'Room',
    description:
      'An affordable single room perfect for students and working professionals in Ghorahi, Dang. The room comes with basic furnishings including a bed, table, and chair. Shared kitchen and bathroom facilities. Electricity and water included. Located in a safe and quiet neighborhood.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    owner: 'Krishna Bahadur Thapa',
    ownerContact: 'krishna@example.com',
    ownerPhone: '+977 9848123456',
    bedrooms: 1,
    bathrooms: 1,
    area: '200 sq ft',
    furnished: 'Furnished',
    parking: 'No',
    posted: '2026-03-05',
  },
  {
    id: 5,
    title: 'Luxury Apartment in Chitwan',
    location: 'Bharatpur, Chitwan',
    price: 35000,
    type: 'Apartment',
    description:
      'A premium 3BHK luxury apartment in the heart of Bharatpur, Chitwan. Features modern architecture, Italian marble flooring, modular kitchen, spacious bedrooms with attached bathrooms, and a large balcony. Amenities include 24/7 security, backup generator, elevator, and underground parking.',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    owner: 'Anita Adhikari',
    ownerContact: 'anita@example.com',
    ownerPhone: '+977 9855234567',
    bedrooms: 3,
    bathrooms: 3,
    area: '1800 sq ft',
    furnished: 'Fully Furnished',
    parking: 'Yes',
    posted: '2026-01-20',
  },
  {
    id: 6,
    title: 'Comfortable Room in Kathmandu',
    location: 'Koteshwor, Kathmandu',
    price: 10000,
    type: 'Room',
    description:
      'A comfortable room with attached bathroom in a residential area of Koteshwor, Kathmandu. The room is on the top floor with great natural light and cross ventilation. Includes a single bed, wardrobe, and desk. Kitchen access shared with the landlord family. Close to bus stops and local shops.',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ez637a499?w=600&q=80',
    owner: 'Sunita Maharjan',
    ownerContact: 'sunita@example.com',
    ownerPhone: '+977 9841987654',
    bedrooms: 1,
    bathrooms: 1,
    area: '300 sq ft',
    furnished: 'Furnished',
    parking: 'No',
    posted: '2026-03-08',
  },
  {
    id: 7,
    title: 'Premium Apartment in Pokhara',
    location: 'Newroad, Pokhara',
    price: 28000,
    type: 'Apartment',
    description:
      'A premium 2BHK apartment with stunning mountain views located on Newroad, Pokhara. Features include a fully equipped modular kitchen, wooden flooring, spacious living area, and two balconies. Building amenities include elevator, CCTV security, and rooftop garden. Walking distance to hospitals and schools.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    owner: 'Bikash Rai',
    ownerContact: 'bikash@example.com',
    ownerPhone: '+977 9846012345',
    bedrooms: 2,
    bathrooms: 2,
    area: '1200 sq ft',
    furnished: 'Fully Furnished',
    parking: 'Yes',
    posted: '2026-02-10',
  },
  {
    id: 8,
    title: 'Affordable Room in Butwal',
    location: 'Golpark, Butwal',
    price: 6000,
    type: 'Room',
    description:
      'A clean and affordable room near Golpark, Butwal. Ideal for students attending nearby colleges. The room features a comfortable bed, study table, ceiling fan, and attached bathroom. The landlord provides WiFi, electricity, and water. Peaceful environment with easy access to the main road.',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80',
    owner: 'Gita Devi Sharma',
    ownerContact: 'gita@example.com',
    ownerPhone: '+977 9847890123',
    bedrooms: 1,
    bathrooms: 1,
    area: '220 sq ft',
    furnished: 'Furnished',
    parking: 'No',
    posted: '2026-03-02',
  },
  {
    id: 9,
    title: 'Family Apartment in Chitwan',
    location: 'Narayanghat, Chitwan',
    price: 20000,
    type: 'Apartment',
    description:
      'A well-maintained 2BHK family apartment in Narayanghat, Chitwan. Located on a quiet street with easy access to the highway. Features include tiled flooring, modern bathroom fittings, a balcony with garden view, and dedicated parking. Schools and hospitals are within 1 km radius.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
    owner: 'Prakash Chaudhary',
    ownerContact: 'prakash@example.com',
    ownerPhone: '+977 9855678901',
    bedrooms: 2,
    bathrooms: 1,
    area: '950 sq ft',
    furnished: 'Semi Furnished',
    parking: 'Yes',
    posted: '2026-02-22',
  },
];

// ================================================
// API FUNCTIONS
// ================================================

/**
 * Fetch all properties from the backend.
 * Falls back to mock data if the request fails.
 */
export const getProperties = async () => {
  try {
    const response = await API.get('/properties');
    return response.data;
  } catch (error) {
    console.warn('Backend not available, using mock data.', error.message);
    return mockProperties;
  }
};

/**
 * Fetch a single property by its ID.
 * Falls back to mock data if the request fails.
 */
export const getPropertyById = async (id) => {
  try {
    const response = await API.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    console.warn('Backend not available, using mock data.', error.message);
    return mockProperties.find((p) => p.id === Number(id)) || null;
  }
};

/**
 * Add a new property listing.
 * Logs data to console if the backend is not available.
 */
export const addProperty = async (propertyData) => {
  try {
    const response = await API.post('/properties', propertyData);
    return response.data;
  } catch (error) {
    console.warn('Backend not available. Property data:', propertyData);
    return { success: true, message: 'Property added (mock)', data: propertyData };
  }
};

/**
 * Log in an existing user.
 * Returns mock success if the backend is not available.
 */
export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.warn('Backend not available. Login data:', credentials);
    return { success: true, message: 'Login successful (mock)', token: 'mock-jwt-token' };
  }
};

/**
 * Register a new user.
 * Returns mock success if the backend is not available.
 */
export const registerUser = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.warn('Backend not available. Register data:', userData);
    return { success: true, message: 'Registration successful (mock)' };
  }
};

export default API;
