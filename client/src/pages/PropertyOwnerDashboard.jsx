import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import{useNavigate} from 'react-router-dom'


import { getOwnerProperties, deleteProperty, setupPayment, getTenantDetails, acceptBooking } from '../services/api';

const NEPAL_BANKS = [
  "Nabil Bank Ltd.", "Global IME Bank Ltd.", "Nepal Investment Mega Bank Ltd.",
  "Siddhartha Bank Ltd.", "NIMB Bank", "NIC Asia Bank Ltd.", 
  "Everest Bank Ltd.", "Standard Chartered Bank Nepal Ltd.", "Prabhu Bank Ltd.",
  "Laxmi Sunrise Bank Ltd.", "Himalayan Bank Ltd.", "Kumari Bank Ltd.",
  "Nepal SBI Bank Ltd.", "Citizens Bank International Ltd.", "Prime Commercial Bank Ltd.",
  "Sanima Bank Ltd.", "Machhapuchhre Bank Ltd.", "Agricultural Development Bank Ltd.",
  "Nepal Bank Ltd.", "Rastriya Banijya Bank Ltd."
].sort();



const ImageSlider = ({ images, title, status }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = (e) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = (e) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const displayUrl = (img) => img?.startsWith('http') 
    ? img 
    : `http://localhost:4000/${img?.replace(/\\/g, '/')}`;

  return (
    <div className="property-card-image" style={{ 
      background: '#e2e8f0', 
      height: '160px', 
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {images.length > 0 ? (
        <>
          <img 
            src={displayUrl(images[currentIndex])} 
            alt={`${title}-${currentIndex}`} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x160?text=No+Image'; }}
          />
          
          {/* Left Arrow */}
          {images.length > 1 && (
            <button onClick={goToPrev} style={arrowStyle({ left: '5px' })}>❮</button>
          )}

          {/* Right Arrow */}
          {images.length > 1 && (
            <button onClick={goToNext} style={arrowStyle({ right: '5px' })}>❯</button>
          )}

          {/* Dots Indicator */}
          <div style={{ position: 'absolute', bottom: '8px', display: 'flex', gap: '4px' }}>
            {images.map((_, i) => (
              <div key={i} style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: i === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)'
              }} />
            ))}
          </div>
        </>
      ) : (
        <span style={{ fontSize: '3rem' }}>🏠</span>
      )}

      <span className={`status-badge status-${status}`} style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '0.7rem', zIndex: 10 }}>
        {status}
      </span>
    </div>
  );
};

const arrowStyle = (pos) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.3)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  zIndex: 15,
  ...pos
});

const PropertyOwnerDashboard = () => {
const [suggestionIndex, setSuggestionIndex] = useState(0);
const [isVisible, setIsVisible] = useState(true);

  const navigate = useNavigate()
  
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('My Properties');
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  const [showNotifications, setShowNotifications] = useState(false);
  // --- PAYMENT SETUP STATE ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank'); // 'bank' or 'qr'
  const [paymentData, setPaymentData] = useState({
    bankName: user?.paymentDetails?.bankName || '',
    accountNumber: user?.paymentDetails?.accountNumber || '',
    accountHolder: user?.paymentDetails?.accountHolder || '',
    qrImage: null // Changed to file object
  });
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  const tabs = ['My Properties', 'Booking Requests', 'Payouts']



const [unreadCount, setUnreadCount] = useState(0);

// Sync unread count whenever bookings load or dropdown opens
useEffect(() => {
  const viewedIds = JSON.parse(localStorage.getItem('viewedNotificationIds') || '[]');
  const unread = bookings.filter(b => b.isTransferredToOwner && !viewedIds.includes(b._id)).length;
  setUnreadCount(unread);
}, [bookings, showNotifications]);

const suggestions = [
  "Add high-quality photos to increase booking requests by 40%.",
  "Response time matters! Please be up to date",
  "Consider lowering prices by 5% during off-seasons for faster fills.",
  "Only put real property to build trust with potential tenants.",
  "Don't put any false information ",
  "Kindly put the banking details before you put your property",
  "Please don't delete the booked property",
  "You only get the amount form tenant whose booking request you accepted",
  "Put complete details in the property discription including street no, Toll name all."
  
];

useEffect(() => {
  const triggerCycle = () => {
    // 1. Show text and speed up orb
    setIsVisible(true);

    // 2. After 10 seconds, hide text and slow down orb
    setTimeout(() => {
      setIsVisible(false);
      // Move to next suggestion for the next time it wakes up
      setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    }, 10000); 
  };

  // Run once on load
  triggerCycle();

  // Set the big 10-minute interval (600,000ms)
  const masterTimer = setInterval(triggerCycle, 60000);

  return () => {
    clearInterval(masterTimer);
  };
}, []);

useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Properties (Existing)
        const propRes = await getOwnerProperties();
        if (propRes && propRes.properties) {
          setProperties(propRes.properties);
        }

        // 2. Fetch Booking/Tenant Details (NEW LOGIC)
        const bookingRes = await getTenantDetails();
       
        if (bookingRes && bookingRes.success) {
          setBookings(bookingRes.requests); // Use .requests as per your controller
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
}, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        await deleteProperty(id);
        setProperties(prevProperties => prevProperties.filter(p => p._id !== id));
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Failed to delete the property. Please try again.");
      }
    }
  };

const handlePaymentSubmit = async (e) => {
  e.preventDefault();
  try {
    setIsUpdatingPayment(true);
    const formData = new FormData();

    // Prepare data for the API
    if (paymentMethod === 'bank') {
      formData.append('bankName', paymentData.bankName);
      formData.append('accountNumber', paymentData.accountNumber);
      formData.append('accountHolder', paymentData.accountHolder);
    } else if (paymentData.qrImage) {
      formData.append('qrImage', paymentData.qrImage);
    }

    // 1. Send to your existing API
    await setupPayment(formData); 

    // 2. MANUALLY UPDATE LOCAL USER (This is the trick)
    // We create a fake version of what the user should look like now
    const updatedUser = {
      ...user,
      paymentDetails: {
        bankName: paymentData.bankName || 'QR Code',
        accountNumber: paymentData.accountNumber || 'Uploaded',
        accountHolder: paymentData.accountHolder || ''
      }
    };

    // 3. Update the AuthContext so the button disappears INSTANTLY
    updateUser(updatedUser); 

    alert("Payment details updated successfully!");
    setShowPaymentModal(false);

  } catch (error) {
    console.error("Error:", error);
    alert("Failed to update payment details.");
  } finally {
    setIsUpdatingPayment(false);
  }
};

const handleAccept = async (bookingId, propertyId) => {
  try {
    await acceptBooking(bookingId);

    setBookings(prev =>
      prev.map(b => {
        const propId = getPropId(b);

        if (b._id === bookingId) {
          return { ...b, status: 'accepted' }; // ✅ keep this one
        }

        if (propId === propertyId) {
          return { ...b, status: 'rejected' }; // ❌ reject others
        }

        return b;
      })
    );

  } catch (error) {
    console.error(error);
    alert("Failed to accept booking");
  }
};

  const renderStats = () => {
    const approvedCount = properties.filter(p => p.status === 'approved').length;
    const pendingCount = properties.filter(p => p.status === 'pending').length;
      const activeRequestsCount = bookings.filter(b => 
    b.ownerId === user?._id && b.status === 'pending'
  ).length;

    return (
      <div className="dashboard-stats-grid" style={{ marginBottom: '30px' }}>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">🏢</div>
          <div className="dashboard-stat-value">{properties.length}</div>
          <div className="dashboard-stat-label">My Properties</div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon" style={{ color: '#16a34a' }}>✅</div>
          <div className="dashboard-stat-value">{approvedCount}</div>
          <div className="dashboard-stat-label">Approved</div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon" style={{ color: '#d97706' }}>⏱️</div>
          <div className="dashboard-stat-value">{pendingCount}</div>
          <div className="dashboard-stat-label">Pending Review</div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">💳</div>
          <div className="dashboard-stat-value">{activeRequestsCount || 0}</div>
          <div className="dashboard-stat-label">Booking Requests</div>
        </div>
      </div>
    );
  };

    const getPropId = (b) => b.property?._id || b.property;
  const getStatus = (b) => b.status || b.paymentStatus;

const renderMyProperties = () => (
  <div className="property-grid" style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
    gap: '20px' 
  }}>
    {properties.length > 0 ? (
      properties.map((property) => {
        const imageList = property.images && property.images.length > 0 
          ? property.images 
          : (property.image ? [property.image] : []);

   
          const getStatus = (b) => b.status || b.paymentStatus;
          const allPropertyBookings = bookings.filter(b => {
  const propId = b.property?._id || b.property;
  return String(propId) === String(property._id);
});

const acceptedBooking = allPropertyBookings.find(
  b => getStatus(b) === 'accepted'
);

const pendingRequests = allPropertyBookings.filter(
  b => getStatus(b) === 'pending'
);

        return (
          <div key={property._id} className="property-card" style={{ 
            display: 'flex', flexDirection: 'column', maxWidth: '280px', 
            background: '#fff', borderRadius: '12px', overflow: 'hidden', 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', position: 'relative' 
          }}>
            
            {/* Notification badge: Only shows if NO booking is accepted AND there are pending requests */}
{/* Notification badge: Strictly hidden if property status is 'booked' */}
{(pendingRequests.length > 0 || acceptedBooking) && (
  <div style={{
    position: 'absolute', top: '12px', right: '12px',
    backgroundColor: '#f59e0b', color: 'white',
    padding: '4px 10px', borderRadius: '20px',
    fontSize: '0.7rem', fontWeight: 'bold', zIndex: 20,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)', border: '1px solid white'
  }}>
    🔔 {pendingRequests.length}
  </div>
)}
            
            <ImageSlider images={imageList} title={property.title} status={property.status} />
            
            <div className="property-card-body" style={{ flexGrow: 1, padding: '12px' }}>
              <h3 style={{ fontSize: '0.95rem', margin: '0 0 8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {property.title}
              </h3>

              <div style={{ marginBottom: '12px', fontSize: '0.8rem', color: '#64748b' }}>
                📍 {property.location}
              </div>

              {/* --- DYNAMIC SECTION --- */}
           {pendingRequests.length > 0 && !acceptedBooking && (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '10px', 
                  background: acceptedBooking ? '#f0fdf4' : '#fffbeb', 
                  borderRadius: '8px', 
                  border: `1px solid ${acceptedBooking ? '#bbf7d0' : '#fde68a'}`, 
                  marginBottom: '10px'
                }}>
                  {acceptedBooking ? (
                    /* UI FOR ACCEPTED TENANT (Replacing the list) */
                    <div onClick={() => navigate(`/booking-details/${acceptedBooking._id}`)} style={{ cursor: 'pointer' }}>
                      <p style={{ fontSize: '0.65rem', fontWeight: '800', color: '#166534', marginBottom: '4px', textTransform: 'uppercase' }}>
                        ✅ Confirmed Tenant:
                      </p>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#14532d' }}>
                        {acceptedBooking.tenant?.fullName}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#15803d', marginTop: '2px' }}>
                        View Details →
                      </div>
                    </div>
                  ) : (
                    /* UI FOR MULTIPLE PENDING REQUESTS */
                    <>
                      <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#92400e', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Pending Requests:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                     {propertyRequests
  .filter(req => req.status !== 'rejected')
  .map((req, index) => (
  <div 
    key={req._id} 
    onClick={() => navigate(`/booking-details/${req._id}`)}
    style={{ 
      fontSize: '0.75rem', cursor: 'pointer',
      borderBottom: index !== pendingRequests.length - 1 ? '1px solid #fef3c7' : 'none',
      display: 'flex', justifyContent: 'space-between', paddingBottom: '2px'
    }}
  >
    <span> {index + 1}. {req.tenant?.fullName || 'Tenant'}
    </span>

    <span style={{ color: '#2563eb' }}>→</span>
  </div>
))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  NPR {property.price?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  🏷️ {property.type}
                </div>
              </div>
            </div>
            
            {/* Footer Actions */}
            <div style={{ 
              padding: '10px', borderTop: '1px solid #e5e7eb', 
              backgroundColor: '#F9FAFB', display: 'flex', 
              justifyContent: 'space-between', alignItems: 'center' 
            }}>
              <Link to={`/properties/${property._id}`} style={{ textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-accent)' }}>
                👁️ View
              </Link>
              <button onClick={() => handleDelete(property._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>
                🗑️ Delete
              </button>
            </div>
          </div>
        );
      })
    ) : (
      <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>No properties listed yet.</p>
    )}
  </div>
);

const OwnerPayouts = ({ bookings }) => {
  // Filter for bookings that are officially transferred by Admin
  const payouts = bookings.filter(b => b.isTransferredToOwner === true);

  return (
    <div style={{ padding: '20px 0' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', color: '#1e293b' }}>
        💰 Payout History
      </h3>
      
      {payouts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b' }}>No payouts received from Admin yet.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '16px' 
        }}>
          {payouts.map((pay) => (
            <div key={pay._id} style={{ 
              background: '#fff', 
              padding: '16px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {/* Header: Amount & Date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#16a34a' }}>
                  NPR {(pay.advanceAmount - (pay.systemFee || 0)).toLocaleString()}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  📅 📅 {new Date(pay.transferredAt || pay.updatedAt).toLocaleDateString()}
                </span>
              </div>
              
              {/* Body: Property & Tenant */}
              <div style={{ padding: '4px 0' }}>
                <div style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', margin: 0 }}>Property</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>
                    🏠 {pay.property?.title || "Property Details Deleted"}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', margin: 0 }}>Tenant</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>
                    👤 {pay.tenant?.fullName || "N/A"}
                  </p>
                </div>
              </div>

              {/* Footer: Status Badge */}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ 
                  fontSize: '0.65rem', 
                  background: '#dcfce7', 
                  color: '#166534', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontWeight: '700' 
                }}>
                  ✅ TRANSFERRED
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}










const renderBookingRequests = () => {
  const activeBookings = bookings.filter(b => {
    const bStatus = (b.status || "").toLowerCase().trim();
    const pStatus = (b.paymentStatus || "").toLowerCase().trim();
    if (bStatus === "rejected") return false;
  
    return bStatus === "accepted" || ['verified', 'paid', 'approved', 'success', 'pending_owner_approval'].includes(pStatus);
  });

  const propertiesWithRequests = properties.filter(p => 
    activeBookings.some(b => String(b.property?._id || b.property) === String(p._id)) || p.status === 'booked'
  );

  return (
    <div className="property-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', padding: '20px 0' }}>
      {propertiesWithRequests.map((property) => {
        console.log("Property Data:", property);
        const imageList = property.images?.length > 0 ? property.images : [property.image];
        
        // Find the booking associated with this property in the bookings state
       // ... inside property loop
const propertyRequests = activeBookings.filter(b => 
  String(b.property?._id || b.property) === String(property._id)
);

// 1. Try to find by status
let acceptedBooking = propertyRequests.find(req => 
  req.status?.toLowerCase().trim() === 'accepted'
);

// 2. BACKUP: If status isn't 'accepted' yet, but the property is booked,
// find the booking that matches the 'bookedBy' ID we see in your console log
if (!acceptedBooking && property.status === 'booked' && property.bookedBy) {
  acceptedBooking = propertyRequests.find(req => 
    String(req.tenant?._id || req.tenant) === String(property.bookedBy._id || property.bookedBy)
  );
}

const isActuallyBooked = property.status === 'booked';

        return (
          <div key={property._id} className="property-card" style={{ 
            background: '#fff', borderRadius: '12px', position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            border: isActuallyBooked ? '2px solid #16a34a' : '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}>
            
            {!isActuallyBooked && propertyRequests.length > 0 && (
              <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#f59e0b', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 20 }}>
                🔔 {propertyRequests.length}
              </div>
            )}

            <ImageSlider images={imageList} title={property.title} status={property.status} />
            
            <div className="property-card-body" style={{ padding: '12px', flexGrow: 1 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '8px' }}>{property.title}</h3>
             {isActuallyBooked ? (
  <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '10px' }}>
    <p style={{ fontSize: '0.65rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>✅ Confirmed Tenant</p>
    
    <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#14532d' }}>
      {/* Show the name from property.bookedBy (which we populated) */}
      {property.bookedBy?.fullName || "Tenant Confirmed"}
    </div>
    
    {/* Use the ID we just added to the backend */}
    {(acceptedBooking?._id || property.currentBookingId) ? (
      <button 
        onClick={() => navigate(`/booking-details/${acceptedBooking?._id || property.currentBookingId}`)} 
        style={{ marginTop: '10px', width: '100%', background: '#16a34a', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        View Tenant Details
      </button>
    ) : (
      <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '5px' }}>ID Syncing...</p>
    )}
  </div>
              ) : (
                <div style={{ padding: '10px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', marginBottom: '10px' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#92400e', textTransform: 'uppercase', marginBottom: '6px' }}>Verified Requests:</p>
                  {propertyRequests.map((req, index) => (
                    <div key={req._id} onClick={() => navigate(`/booking-details/${req._id}`)} style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: index !== propertyRequests.length - 1 ? '1px solid #fef3c7' : 'none' }}>
                      <span>{index + 1}. {req.tenant?.fullName}</span>
                      <span style={{ color: '#2563eb', fontWeight: 'bold' }}>Review →</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>NPR {property.price?.toLocaleString()}</div>
            </div>

            <div style={{ padding: '10px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to={`/properties/${property._id}`} style={{ textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, color: '#2563eb' }}>
                👁️ View Property
              </Link>
              <button onClick={() => handleDelete(property._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>
                🗑️ Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

  return (
<div className="dashboard-container">
 
  {showPaymentModal && (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex',
      justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ 
        background: 'white', padding: '24px', borderRadius: '12px', 
        width: '90%', maxWidth: '450px', position: 'relative',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
      }}>
        <button 
          onClick={() => setShowPaymentModal(false)}
          style={{
            position: 'absolute', top: '15px', right: '15px',
            border: 'none', background: '#f3f4f6', borderRadius: '50%',
            width: '30px', height: '30px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', color: '#666'
          }}
        >
          ×
        </button>

        {/* --- CONDITION: SHOW SUMMARY IF DETAILS EXIST, ELSE SHOW FORM --- */}
        {user?.paymentDetails?.bankName || user?.paymentDetails?.qrImage ? (
          
          /* VIEW 1: SAVED DETAILS SUMMARY (Shows after filling the form) */
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
            <h2 style={{ marginBottom: '10px', fontSize: '1.25rem', fontWeight: '700' }}>Payment Verified</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
              Your details are saved. Admin will use these for transfers.
            </p>
            
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', textAlign: 'left', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: '5px 0', fontSize: '0.85rem', color: '#475569' }}>
                <strong>Method:</strong> {user.paymentDetails.bankName ? 'Bank Transfer' : 'QR Code'}
              </p>
              {user.paymentDetails.bankName && (
                <>
                  <p style={{ margin: '5px 0', fontSize: '0.85rem', color: '#475569' }}>
                    <strong>Bank:</strong> {user.paymentDetails.bankName}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '0.85rem', color: '#475569' }}>
                    <strong>A/C Holder:</strong> {user.paymentDetails.accountHolder}
                  </p>
                </>
              )}
            </div>

            <button 
              onClick={() => setShowPaymentModal(false)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontWeight: '600' }}
            >
              Close
            </button>
          </div>

        ) : (

          /* VIEW 2: YOUR ORIGINAL PERFECT FORM (Shows if no details exist) */
          <>
            <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '700' }}>Payment Setup</h2>
            
            <div style={{ display: 'flex', background: '#f3f4f6', padding: '4px', borderRadius: '8px', marginBottom: '20px' }}>
              <button 
                onClick={() => setPaymentMethod('bank')}
                style={{ 
                  flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                  background: paymentMethod === 'bank' ? 'white' : 'transparent',
                  boxShadow: paymentMethod === 'bank' ? '0 1px 3px 0 rgba(0,0,0,0.1)' : 'none',
                  fontWeight: paymentMethod === 'bank' ? '600' : '400'
                }}
              >
                Bank Transfer
              </button>
              <button 
                onClick={() => setPaymentMethod('qr')}
                style={{ 
                  flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                  background: paymentMethod === 'qr' ? 'white' : 'transparent',
                  boxShadow: paymentMethod === 'qr' ? '0 1px 3px 0 rgba(0,0,0,0.1)' : 'none',
                  fontWeight: paymentMethod === 'qr' ? '600' : '400'
                }}
              >
                QR Code
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit}>
              {paymentMethod === 'bank' ? (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '500' }}>Bank Name</label>
                    <select 
                      value={paymentData.bankName}
                      onChange={(e) => setPaymentData({...paymentData, bankName: e.target.value})}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white' }}
                      required
                    >
                      <option value="">Select a Bank</option>
                      {NEPAL_BANKS.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '500' }}>Account Number</label>
                    <input 
                      type="text" 
                      value={paymentData.accountNumber}
                      onChange={(e) => setPaymentData({...paymentData, accountNumber: e.target.value})}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '500' }}>Account Holder Name</label>
                    <input 
                      type="text" 
                      value={paymentData.accountHolder}
                      onChange={(e) => setPaymentData({...paymentData, accountHolder: e.target.value})}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      required
                    />
                  </div>
                </>
              ) : (
                <div style={{ marginBottom: '20px', textAlign: 'center', padding: '20px', border: '2px dashed #d1d5db', borderRadius: '8px' }}>
                  <label style={{ display: 'block', cursor: 'pointer' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📷</div>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>Upload QR Code Image</div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setPaymentData({...paymentData, qrImage: e.target.files[0]})}
                      style={{ display: 'none' }}
                      required={paymentMethod === 'qr'}
                    />
                  </label>
                  {paymentData.qrImage && (
                    <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#16a34a' }}>
                      Selected: {paymentData.qrImage.name}
                    </div>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isUpdatingPayment} 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '12px', fontWeight: '600' }}
              >
                {isUpdatingPayment ? 'Saving...' : 'Save Payment Details'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )}


      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <div className="dashboard-title-wrapper" style={{ marginBottom: 0 }}>
          
          <div className="dashboard-icon" style={{ background: '#FFFBEB', borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}>🏢</div>
          <div>
            <h1>Property Owner Dashboard</h1>
            <p>Welcome, {user?.name || 'Owner'}</p>
          </div>
          
        </div>
        
      
<div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
  {user?.paymentDetails?.bankName || user?.paymentDetails?.qrImage ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '5px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', position: 'relative' }}>
      
      {/* 1. THE TRIGGER SECTION (Transferred Amount + Badge) */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div 
          onClick={() => {
            if (!showNotifications) {
              // FACEBOOK LOGIC: Mark as read the moment you click
              const allIds = bookings.filter(b => b.isTransferredToOwner).map(b => b._id);
              localStorage.setItem('viewedNotificationIds', JSON.stringify(allIds));
              setUnreadCount(0); // This makes the number vanish immediately
            }
            setShowNotifications(!showNotifications);
          }}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div style={{ textAlign: 'right', position: 'relative' }}>
            <p style={{ margin: 0, fontSize: '0.6rem', color: '#64748b', fontWeight: 'bold' }}>TRANSFERRED</p>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: '#16a34a' }}>
              NPR {bookings
                .filter(b => b.isTransferredToOwner === true)
                .reduce((sum, b) => {
                  const netAmount = b.ownerAmountDue || (Number(b.advanceAmount) - (Number(b.systemFee) || 0));
                  return sum + (netAmount || 0);
                }, 0)
                .toLocaleString()}
            </p>

            {/* FACEBOOK BADGE (The 1/2) */}
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '-10px', left: '-18px',
                background: '#ef4444', color: 'white', borderRadius: '50%',
                width: '18px', height: '18px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '10px', fontWeight: 'bold',
                border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* 2. THE DROPDOWN CARD (With Scrollbar) */}
        {/* 2. THE DROPDOWN CARD (With Scrollbar and Priority Layering) */}
{/* 2. THE DROPDOWN CARD (Newest First + Right Aligned + Forced Scrollbar) */}
{showNotifications && (
  <div style={{
    position: 'absolute', 
    top: '55px',     
    right: '0',      
    width: '260px', 
    background: 'white', 
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
    borderRadius: '12px', 
    border: '1px solid #e2e8f0', 
    zIndex: 9999,    
    display: 'flex', 
    flexDirection: 'column',
    overflow: 'hidden'
  }}>
    {/* Header */}
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '10px 12px', 
      borderBottom: '1px solid #f1f5f9'
    }}>
      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#1e293b' }}>Recent Payouts</span>
      <button 
        onClick={(e) => { e.stopPropagation(); setShowNotifications(false); }} 
        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.2rem', lineHeight: 1 }}
      >
        ×
      </button>
    </div>

    {/* SCROLLABLE AREA */}
    <div style={{ 
      maxHeight: '240px', 
      overflowY: 'scroll', // Keep that scrollbar on the right!
      padding: '10px',
      backgroundColor: '#fff'
    }}>
      {/* LOGIC: Spread, Filter, then Reverse to bring Newest to Top */}
      {[...bookings]
        .filter(b => b.isTransferredToOwner)
        .reverse() 
        .map(b => {
          const ownerReceived = b.ownerAmountDue || b.ownerEarnings || (Number(b.advanceAmount || 0) - Number(b.systemFee || 0));
          const viewedIds = JSON.parse(localStorage.getItem('viewedNotificationIds') || '[]');
          const isNew = !viewedIds.includes(b._id);

          return (
            <div key={b._id} style={{ 
              padding: '8px 10px', 
              background: isNew ? '#f0f9ff' : '#f8fafc', 
              borderRadius: '8px', 
              marginBottom: '8px', 
              borderLeft: isNew ? '4px solid #3b82f6' : '4px solid #e2e8f0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 'bold', color: isNew ? '#1d4ed8' : '#475569' }}>
                NPR {ownerReceived.toLocaleString()} Received
              </p>
              <p style={{ margin: '2px 0', fontSize: '0.65rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {b.property?.title}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.6rem' }}>
                    {new Date(b.transferredAt || b.updatedAt).toLocaleDateString()}
                  </span>
                  {isNew && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }}></span>}
              </div>
            </div>
          );
      })}

      {bookings.filter(b => b.isTransferredToOwner).length === 0 && (
        <p style={{ fontSize: '0.65rem', color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
          No history found.
        </p>
      )}
    </div>
  </div>
)}
        
      </div>

      <button 
        onClick={() => setShowPaymentModal(true)}
        className="btn" 
        style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#fff', border: '1px solid #cbd5e1' }}
      >
        Payment Info
      </button>
    </div>
  ) : (
    <button 
      onClick={() => setShowPaymentModal(true)}
      className="btn" 
      style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', border: '1px solid #d1d5db' }}
    >
      💳 Setup Payment
    </button>
  )}

          <Link to="/add-property" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⊕</span> Add Property
          </Link>
        </div>
      </div>

       <Link 
    to="/support" 
    style={{ 
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      marginRight:'1095px',
      transition: 'all 0.3s ease'
    }}
    className="help-trigger"
  >
    <div style={{ 
      width: '33px', 
      height: '33px', 
      borderRadius: '12px', 
      backgroundColor: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      fontSize: '1.2rem'
    }}>
     ℹ️
    </div>
    <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Help</span>
  </Link>

    <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '12px',
  margin: '10px 0 25px 0',
  minHeight: '20px' // Keeps layout stable when text is gone
}}>
  {/* Suggestion Text - Only renders during the 10s window */}
  {isVisible && (
    <span 
      className="suggestion-anim"
      style={{ 
        fontSize: '0.7rem', 
        color: '#64748b', 
        fontWeight: '500',
        textAlign: 'right'
      }}
    >
      {suggestions[suggestionIndex]}
    </span>
  )}

  

  {/* The Orb - Always there, but classes change speed */}
  <div className={`living-orb ${isVisible ? 'orb-active' : ''}`}></div>
</div>

      {renderStats()}

      <div className="dashboard-tabs" style={{ marginBottom: '24px' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'My Properties' && '🏢 '}
            {tab === 'Booking Requests' && '💳 '}
            {tab}
          </button>
        ))}
      </div>
      

      <div className="dashboard-content">
        {activeTab === 'My Properties' && renderMyProperties()}
        {activeTab === 'Booking Requests' && renderBookingRequests()}
        {activeTab === 'Payouts' && <OwnerPayouts bookings={bookings} />}
      </div>
    </div>
  );
};

export default PropertyOwnerDashboard;