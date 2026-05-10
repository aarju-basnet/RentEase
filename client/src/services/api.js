/**
 * api.js - API Service Layer
 * 
 * Contains Axios instance and API functions for communicating
 * with the backend. Uses Nepal-focused mock data with rooms
 * and apartments in cities like Kathmandu, Butwal, Ghorahi,
 * Pokhara, and Chitwan. Prices are in NPR (Nepalese Rupees).
 */
import axios from 'axios'

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URI,
    withCredentials: true
})

// Request interceptor
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
}, (error) => {
    return Promise.reject(error)
})

// Response interceptor
API.interceptors.response.use(
    (response) => response,
    (error) => {
      const isAuthPage = window.location.href.includes('register') || window.location.href.includes('login');

       
        if (error.response?.status === 401 && !isAuthPage) {
            console.error("Unauthorized! Token issue.");
            localStorage.removeItem('token');
            window.location.href = '/#auth';
        }

        return Promise.reject(error)
    }
)

export default API



















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
    image: 'https://images.unsplash.com/photo-1598928506311-c55ece5c1870?w=600&q=80',
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

// ----- Public / Owner APIs -----
export const getProperties = async () => {
  const response = await API.get('/properties');
  return response.data;
};

export const getPropertyById = async (id) => {
  const response = await API.get(`/properties/${id}`);
  return response.data;
};

export const addProperty = async (propertyData) => {
  const response = await API.post('/properties', propertyData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getThatProperties = async () => {
  try {
    const response = await API.get('/properties/all-properties'); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOwnerProperties = async () => {
  const response = await API.get('/properties/owner-properties');
  return response.data;
};
// ----- Admin APIs -----
export const getAllProperties = async () => {
  const response = await API.get('/admin/properties');
  return response.data;
};

export const approveProperty = async (id) => {
  const response = await API.patch(`/admin/properties/approve/${id}`);
  return response.data;
};

export const rejectProperty = async (id) => {
  const response = await API.patch(`/admin/properties/reject/${id}`);
  return response.data;
};

export const getAllOwners = async () => {
  const response = await API.get('/admin/owners');
  return response.data;
};

export const getAllTenants = async () => {
  const response = await API.get('/admin/tenants');
  return response.data;
};

export const getAllBookings = async () => {
  const response = await API.get('/admin/bookings');
  return response.data;
};


export const deleteProperty = (id) =>
  API.delete(`/properties/${id}`);

export const bulkDeleteProperties = (ids) =>
  API.delete('/properties/bulk-delete', { data: { propertyIds: ids } });

export const deleteAllRejected = () =>
  API.delete('/properties/delete-rejected/all');

export const initiateBooking = async (bookingData) => {
  try {
   
    const response = await API.post('/booking/initiate', bookingData);
    return response.data;
  } catch (error) {
    console.error("Booking Initiation Error:", error.response?.data || error.message);
    
    return error.response?.data || { success: false, message: error.message };
  }
};

export const verifyBookingPayment = async (bookingId) => {
  try {
    // We send a POST request with the specific Booking ID
    const response = await API.post('/booking/verify-manual', { bookingId });
    return response.data;
  } catch (error) {
    console.error("Manual Verification Error:", error.response?.data || error.message);
    throw error;
  }
}


export const setupPayment = (data) => {
    return API.put("/auth/payment-setup", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};


export const getTenantDetails = async () => {
  try {
    // FIX: Match the backend route (GET) and remove the non-existent variable
    const response = await API.get('/booking/get-tenant-details'); 
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
}


// Fetch a single booking by ID
export const getBookingById = async (id) => {
  try {
    const response = await API.get(`/booking/details/${id}`);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateBookingStatus = async (id, status) => {
    const response = await API.put(`/booking/update-status/${id}`, 
      { status });
    return response.data;
};


export const getTenantBookings = async () => {
  try {
   
    const response = await API.get('/booking/my-bookings') 
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const acceptBooking = async (bookingId) => {
  try {
    const res = await API.put(`/booking/${bookingId}/accept`);
    return res.data;
  } catch (error) {
    console.error("Error accepting booking:", error);
    throw error;
  }
};


export const getAllBookingsForAdmin = async () => {
  try {
    const response = await API.get('/booking/admin/all');
    return response.data;
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    throw error;
  }
}

export const deleteBooking = async (id) => {
  try {
    const response = await API.delete(`/booking/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

// Create a new support ticket
export const createSupportTicket = async (ticketData) => {
  try {
    // ticketData should be { subject, message }
    const response = await API.post('/support', ticketData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Server Error";
  }
};


export const processOwnerTransfer = async (ownerId) => {
  try {
 
    const response = await API.put(`/admin/transfer-to-owner/${ownerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Server Error";
  }
};

// Fetch bookings for the logged-in owner
export const fetchOwnerBookings = async () => {
  try {
    const response = await API.get('/booking/my-bookings');
    return response.data; // This returns { success: true, bookings: [...] }
  } catch (error) {
    throw error.response?.data || "Server Error";
  }
};