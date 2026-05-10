import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';
import { 
  getAllProperties, 
  approveProperty, 
  rejectProperty, 
  getAllOwners, 
  getAllTenants, 
  getAllBookings,
  deleteProperty,
  bulkDeleteProperties,
  deleteAllRejected,
  verifyBookingPayment,
  getAllBookingsForAdmin,
  deleteBooking,
  processOwnerTransfer
} from '../services/api';

// --- NEW HELPER COMPONENT FOR ADMIN IMAGE SLIDING ---
const AdminImageSlider = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageList = images && images.length > 0 ? images : [];
  
  const goToNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const getUrl = (img) => img?.startsWith('http') 
    ? img 
    : `http://localhost:4000/${img?.replace(/\\/g, '/')}`;

  return (
    <div className="property-card-image" style={{ height: '180px', position: 'relative', overflow: 'hidden', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {imageList.length > 0 ? (
        <>
          <img 
            src={getUrl(imageList[currentIndex])} 
            alt={`${title}-${currentIndex}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=No+Image'; }}
          />
          {imageList.length > 1 && (
            <>
              <button onClick={goToPrev} style={arrowStyle({ left: '5px' })}>❮</button>
              <button onClick={goToNext} style={arrowStyle({ right: '5px' })}>❯</button>
              <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '10px' }}>
                {currentIndex + 1}/{imageList.length}
              </div>
            </>
          )}
        </>
      ) : (
        <span style={{ fontSize: '2rem' }}>🏠</span>
      )}
    </div>
  );
};

const arrowStyle = (pos) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.4)',
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
  zIndex: 10,
  ...pos
});


 
const BookingDetailsModal = ({ booking, onClose, onVerify }) => {
  if (!booking) return null;

  const getUrl = (img) => img?.startsWith('http') 
    ? img 
    : `http://localhost:4000/${img?.replace(/\\/g, '/')}`;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        
        <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Booking Request Details</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div><strong>Tenant:</strong> {booking.tenant?.fullName || 'N/A'}</div>
          <div><strong>Profession:</strong> {booking.profession || 'N/A'}</div>
          <div><strong>Hometown:</strong> {booking.hometown || 'N/A'}</div>
          <div><strong>Family Members:</strong> {booking.members || '1'}</div>
          <div><strong>Purpose:</strong> {booking.purpose || 'Residential'}</div>
          <div><strong>Shift Date:</strong> {booking.shiftSchedule || 'Not set'}</div>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Payment Information</h4>
          <p><strong>Amount Paid:</strong> NPR {booking.advanceAmount}</p>
          
          <div style={{ textAlign: 'center', backgroundColor: '#eee', borderRadius: '8px', padding: '10px', marginTop: '10px' }}>
            <strong>Payment Proof Screenshot:</strong>
            {booking.paymentScreenshot ? (
              <img 
                src={getUrl(booking.paymentScreenshot)} 
                alt="Payment Proof" 
                style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', marginTop: '10px', cursor: 'zoom-in', borderRadius: '4px' }} 
                onClick={() => window.open(getUrl(booking.paymentScreenshot), '_blank')}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Screenshot+File+Not+Found'; }}
              />
            ) : (
              <p style={{ color: '#ef4444', marginTop: '10px' }}>⚠️ No screenshot uploaded by tenant.</p>
            )}
          </div>
        </div>
<div style={{ display: 'flex', gap: '10px' }}>
  {booking.paymentStatus === 'awaiting_verification' && (
    <button 
      onClick={() => onVerify(booking._id)} 
      style={{ 
        flex: 1, 
        padding: '12px', 
        backgroundColor: '#16a34a', 
        color: 'white', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontWeight: 'bold' 
      }}
    >
      Verify & Send to Owner
    </button>

    
  )}
  

  <button 
    onClick={onClose} 
    style={{ 
      flex: 1, 
      padding: '12px', 
      backgroundColor: '#6b7280', 
      color: 'white', 
      border: 'none', 
      borderRadius: '8px', 
      cursor: 'pointer' 
    }}
  >
    Close
  </button>
   
</div>
      </div>
    </div>
  );
};

const handleTransferClick = async (ownerId) => {
  try {
    const data = await processOwnerTransfer(ownerId);
    if (data.success) {
      alert(data.message);
      // Refresh your bookings list here to update UI
      fetchBookings(); 
    }
  } catch (err) {
    alert(err.message || "Failed to transfer");
  }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [propertyFilter, setPropertyFilter] = useState('All');

  const [clickedIds, setClickedIds] = useState({});

  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState([]);

  const tabs = ['Overview', 'Properties', 'Property Owners', 'Tenants', 'Bookings', 'Owner Payments'];

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [propRes, ownersRes, tenantsRes, bookingsRes] = await Promise.all([
          getAllProperties(),
          getAllOwners(),
          getAllTenants(),
          getAllBookings()
        ]);

        console.log("Bookings Data from API:", bookingsRes.bookings);
        setProperties(propRes.properties || []);
        setOwners(ownersRes.owners || []);
        setTenants(tenantsRes.tenants || []);
        setBookings(bookingsRes.bookings || []);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      await deleteBooking(id);
      // Re-fetch bookings to update the UI
      const updated = await getAllBookings();
      // Handle the data structure (array vs object)
      setBookings(updated.bookings || updated || []);
      alert("Booking deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete booking failed");
    }
  };

  const handlePropertyAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this property?`)) return;
    try {
      if (action === 'approve') await approveProperty(id);
      else await rejectProperty(id);
      const propRes = await getAllProperties();
      setProperties(propRes.properties || []);
    } catch (err) {
      alert("Action failed. Please try again.");
    }
  };

 const handleDelete = async (id) => {
  if (!id || id === 'undefined') {
    console.error("Cannot delete: ID is undefined");
    return;
  }

  if (!window.confirm("Delete this property and all its requests?")) return;

  try {
    await deleteProperty(id);
    
    // Remove from properties state
    setProperties(prev => prev.filter(p => p._id !== id));
    
    // Remove from bookings state (this makes the card disappear)
    setBookings(prev => prev.filter(b => {
      const bPropId = b.property?._id || b.property;
      return String(bPropId) !== String(id);
    }));

    alert("Deleted successfully");
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Delete failed. Check console for details.");
  }
};

  const handleBulkDelete = async () => {
    if (selectedProperties.length === 0) return alert("Select properties first");
    if (!window.confirm(`Delete ${selectedProperties.length} selected properties?`)) return;
    try {
      await bulkDeleteProperties(selectedProperties);
      const propRes = await getAllProperties();
      setProperties(propRes.properties || []);
      setSelectedProperties([]);
    } catch (err) {
      alert("Bulk delete failed");
    }
  };

  const handleDeleteRejected = async () => {
    if (!window.confirm("Delete all rejected properties?")) return;
    try {
      await deleteAllRejected();
      const propRes = await getAllProperties();
      setProperties(propRes.properties || []);
    } catch (err) {
      alert("Delete rejected failed");
    }
  }


const handleBookingVerify = async (bookingId) => {
  if (!window.confirm("Is the payment screenshot valid? This will send the request to the Property Owner.")) return;

  try {
    const result = await verifyBookingPayment(bookingId); 
    if (result.success) {
      alert("Payment Verified! The Owner has been notified to approve the tenant.");
      const updated = await getAllBookings();
      setBookings(updated.bookings || []); 
    }
  } catch (err) {
    alert("Verification failed.");
  }
}


const renderBookingCards = () => {
  // Group bookings by property
  const groupedBookings = bookings.reduce((acc, booking) => {
    const propId = booking.property?._id || booking.property; 
    
    if (!propId) return acc; 

    if (!acc[propId]) {
      acc[propId] = {
        id: propId, 
        property: booking.property,
        ownerName: booking.owner?.fullName || booking.property?.owner?.fullName || 'System Owner',
        requests: []
      };
    }
    acc[propId].requests.push(booking);
    return acc;
  }, {});

  const groupedArray = Object.values(groupedBookings);

  if (groupedArray.length === 0) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>No bookings found.</p>;
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: '16px'
    }}>
      {groupedArray.map((group) => (
        <div key={group.id} style={{ 
          background: 'white', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ padding: '12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '0.9rem', margin: 0, paddingRight: '25px' }}>
              🏠 {group.property?.title || 'Property Deleted'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              👤 Owner: {group.ownerName}
            </p>
            
            <button 
              onClick={() => handleDelete(group.id)} 
              style={{ position: 'absolute', top: '12px', right: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              🗑️
            </button>
          </div>

          <div style={{ padding: '10px' }}>
            {group.requests.map((req) => {
              // --- STATUS COLOR LOGIC ---
              let statusLabel = req.paymentStatus;
              let statusColor = '#64748b'; // Gray default
              let showRefund = false;

              if (req.paymentStatus === 'awaiting_admin_verification') {
                statusLabel = 'Pending Admin';
                statusColor = '#f59e0b'; // Amber
              } else if (req.paymentStatus === 'pending_owner_approval') {
                statusLabel = 'Sent to Owner';
                statusColor = '#2563eb'; // Blue
              } else if (req.paymentStatus === 'completed' || req.paymentStatus === 'approved') {
                statusLabel = 'Accepted/Booked';
                statusColor = '#16a34a'; // Green
              } else if (req.paymentStatus === 'rejected') {
                statusLabel = 'Not Chosen';
                statusColor = '#ef4444'; // Red
                showRefund = true; 
              }

              return (
                <div key={req._id} style={{ 
                  padding: '10px', 
                  borderRadius: '8px', 
                  backgroundColor: req.paymentStatus === 'completed' ? '#f0fdf4' : '#f1f5f9', 
                  marginBottom: '8px',
                  border: req.paymentStatus === 'completed' ? '1px solid #bbf7d0' : '1px solid transparent'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {req.tenant?.fullName}
                      </div>
                      <div style={{ 
                        fontSize: '0.7rem', 
                        color: statusColor, 
                        fontWeight: 'bold', 
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ fontSize: '10px' }}>●</span> {statusLabel.replace(/_/g, ' ')}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                       <button 
                        onClick={() => setSelectedBooking(req)}
                        style={{ fontSize: '0.7rem', color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Details →
                      </button>

                      {showRefund && (
                        <button 
                          onClick={() => alert('Initiate refund logic here')}
                          style={{ fontSize: '0.65rem', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }}
                        >
                          Refund $
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}


const renderOwnerPayments = () => {
  // We use the 'owners' state which you likely already have from getAllOwners()
  if (!owners || owners.length === 0) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>No owners found.</p>;
  }

  const toggleTransferButton = (id) => {
    setClickedIds(prev => ({
      ...prev,
      [id]: !prev[id] // This flips the state for that specific ID
    }));
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
      gap: '20px' 
    }}>
      {owners.map((owner) => {
        // --- LOGIC PLACED HERE ---
        const isClicked = clickedIds[owner._id];

        return (
          <div key={owner._id} style={{ 
            background: 'white', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0',
            padding: '16px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}>
            {/* Header: Owner Basic Info */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>👤 {owner.fullName}</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0' }}>📧 {owner.email}</p>
            </div>

            {/* Payment Details Content */}
            {owner.paymentDetails ? (
              <div>
                {owner.paymentDetails.bankName ? (
                  /* Bank Details View */
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>
                      🏦 Bank Transfer Details
                    </p>
                    <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                      <strong>Bank:</strong> {owner.paymentDetails.bankName}
                    </div>
                    <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                      <strong>A/C No:</strong> <code style={{ background: '#e2e8f0', padding: '2px 4px', borderRadius: '4px' }}>{owner.paymentDetails.accountNumber}</code>
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong>Holder:</strong> {owner.paymentDetails.accountHolder}
                    </div>
                  </div>
                ) : owner.paymentDetails.qrImage ? (
                  /* QR Code View */
                  <div style={{ textAlign: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>
                      📸 QR Code Payment
                    </p>
                    <img 
                      src={`http://localhost:4000/${owner.paymentDetails.qrImage.replace(/\\/g, '/')}`} 
                      alt="Owner QR" 
                      style={{ width: '150px', height: '150px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=QR+Error'; }}
                    />
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>No details provided yet.</p>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>
                ⚠️ No payment setup completed by owner.
              </div>
            )}

            {/* Action Button */}
           {/* Action Button - Update this part */}
<button 
  onClick={async () => {
    if (window.confirm(`Confirm transfer to ${owner.fullName}?`)) {
      try {
        // 1. Call the actual API (Ensure this matches your backend endpoint)
        const data = await processOwnerTransfer(owner._id); 
        
        if (data.success) {
          // 2. Update the local UI color
          setClickedIds(prev => ({ ...prev, [owner._id]: true }));
          alert("Transfer marked as completed!");
          
          // 3. Optional: Refresh bookings so the system knows they are 'completed'
          const updated = await getAllBookings();
          setBookings(updated.bookings || []);
        }
      } catch (err) {
        alert("Transfer failed: " + err.message);
      }
    }
  }}
  style={{ 
    width: '100%',
    padding: '10px',
    marginTop: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
    fontWeight: 'bold',
    color: 'white',
    transition: '0.3s ease',
    backgroundColor: isClicked ? '#16a34a' : '#dc3545' 
  }}
>
  {isClicked ? '✅ Transferred' : '💸 Transfer Funds'}
</button>
          </div>
        );
      })}
    </div>
  );
};


  const renderStats = () => (
    <div className="dashboard-stats-grid" style={{ marginBottom: '30px' }}>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon">📊</div>
        <div className="dashboard-stat-value">{properties.length}</div>
        <div className="dashboard-stat-label">Total Properties</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ color: '#d97706' }}>⏳</div>
        <div className="dashboard-stat-value">
          {properties.filter(p => p.status === 'pending').length}
        </div>
        <div className="dashboard-stat-label">Pending Review</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ color: '#16a34a' }}>👥</div>
        <div className="dashboard-stat-value">{owners.length}</div>
        <div className="dashboard-stat-label">Property Owners</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ color: '#2563eb' }}>💳</div>
        <div className="dashboard-stat-value">{new Set(bookings.map(b => b.property?._id || b.property)).size}</div>
        <div className="dashboard-stat-label">Total Bookings</div>
      </div>
    </div>
  );

  const renderProperties = () => {
    const filteredProperties = properties.filter(p => 
      propertyFilter === 'All' || p.status === propertyFilter.toLowerCase()
    );

    return (
      <div className="dashboard-content-panel">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          padding: '10px',
          background: '#f8fafc',
          borderRadius: '12px'
        }}>
          <div className="dashboard-sub-filters" style={{ display: 'flex', gap: '10px' }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map(filter => (
              <button
                key={filter}
                className={`dashboard-sub-filter ${propertyFilter === filter ? 'active' : ''}`}
                onClick={() => setPropertyFilter(filter)}
                style={{
                  padding: '6px 15px',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  backgroundColor: propertyFilter === filter ? 'var(--color-accent)' : 'white',
                  color: propertyFilter === filter ? 'white' : 'inherit'
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {selectedProperties.length > 0 && (
              <button onClick={handleBulkDelete} className="btn-delete-main">
                🗑️ Delete Selected ({selectedProperties.length})
              </button>
            )}
            <button onClick={handleDeleteRejected} className="btn-delete-secondary">
              Cleanup Rejected
            </button>
          </div>
        </div>
        
        <div className="property-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredProperties.length > 0 ? (
            filteredProperties.map(property => {
              // Ensure we have an array for the slider
              const images = property.images && property.images.length > 0 
                ? property.images 
                : (property.image ? [property.image] : []);

              return (
                <div key={property._id} className="property-card" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  position: 'relative',
                  border: selectedProperties.includes(property._id) ? '2px solid #ef4444' : '1px solid #eee'
                }}>
                  
                  <input 
                    type="checkbox" 
                    checked={selectedProperties.includes(property._id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedProperties([...selectedProperties, property._id]);
                      else setSelectedProperties(selectedProperties.filter(id => id !== property._id));
                    }}
                    style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 15, width: '18px', height: '18px', cursor: 'pointer' }}
                  />

                  {/* USE THE NEW SLIDER COMPONENT HERE */}
                  <AdminImageSlider images={images} title={property.title} />
                  
                  <span className={`status-badge status-${property.status}`} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 12 }}>
                    {property.status}
                  </span>

                  <div className="property-card-body" style={{ padding: '15px', flexGrow: 1 }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '5px' }}>{property.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>📍 {property.location}</p>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Owner: {property.owner?.fullName || 'Unknown'}</p>
                    <div style={{ fontWeight: 'bold', marginTop: '10px', color: 'var(--color-accent)' }}>
                      NPR {property.price?.toLocaleString()}
                    </div>
                  </div>
                  
                  <div style={{ padding: '12px', borderTop: '1px solid #eee', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {property.status === 'pending' && (
                      <>
                        <button onClick={() => handlePropertyAction(property._id, 'approve')} className="btn btn-primary" style={{ flex: 1, padding: '6px', fontSize: '0.8rem' }}>Approve</button>
                        <button onClick={() => handlePropertyAction(property._id, 'reject')} className="btn btn-danger" style={{ flex: 1, padding: '6px', fontSize: '0.8rem' }}>Reject</button>
                      </>
                    )}
                    <Link to={`/properties/${property._id}`} className="btn" style={{ flex: 1, textAlign: 'center', padding: '6px', fontSize: '0.8rem', backgroundColor: '#f3f4f6' }}>View</Link>
                    
                    <button 
                      onClick={() => handleDelete(property._id)} 
                      className="btn-icon-delete"
                      title="Delete Property"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>No properties found matching this filter.</p>
          )}
        </div>
      </div>
    );
  };

  const renderTable = (headers, data, type) => (
    <div className="dashboard-content-panel">
      <table className="dashboard-table">
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {data.length > 0 ? data.map((item, idx) => (
            <tr key={item._id || idx}>
              {type === 'owners' && (
                <>
                  <td className="font-bold">{item.fullName}</td>
                  <td>{item.email}</td>
                  <td>{item.phoneNumber || 'N/A'}</td>
                  <td><span className="status-badge status-approved">Active</span></td>
                </>
              )}
              {type === 'tenants' && (
                <>
                  <td className="font-bold">{item.fullName}</td>
                  <td>{item.email}</td>
                  <td>{item.phoneNumber || 'N/A'}</td>
                </>
              )}
                {type === 'bookings' && (
  <>
    <td>
      <div style={{ fontWeight: 'bold' }}>{item.property?.title || 'Unknown Property'}</div>
      <div style={{ fontSize: '11px', color: '#666' }}>Owner: {item.owner?.fullName || 'N/A'}</div>
    </td>
    <td>{item.tenant?.fullName || 'N/A'}</td>
    <td>
       <button 
         onClick={() => setSelectedBooking(item)}
         style={{ color: '#2563eb', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
       >
         View Details 📄
       </button>
    </td>
    <td className="font-bold">NPR {item.advanceAmount || 0}</td>
    <td><span className={`status-badge status-${item.paymentStatus}`}>{item.paymentStatus?.replace(/_/g, ' ')}</span></td>
   <td style={{ display: 'flex', gap: '6px' }}>
  {item.paymentStatus === 'awaiting_admin_verification' && (
    <button 
      onClick={() => handleBookingVerify(item._id)} 
      className="btn-verify-small"
    >
      Verify
    </button>
  )}

  <button 
    onClick={() => handleDeleteBooking(item._id)} 
    className="btn-icon-delete"
    title="Delete Booking"
  >
    🗑️
  </button>
</td>
  </>
)}
    
            </tr>
          )) : (
            <tr><td colSpan={headers.length} style={{ textAlign: 'center', padding: '20px' }}>No data found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <div className="dashboard-container">Loading admin panel...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title-wrapper">
          <div className="dashboard-icon" style={{ background: '#EEF2FF', borderColor: '#4F46E5', color: '#4F46E5' }}>🛡️</div>
          <div>
            <h1>Admin Control Panel</h1>
            <p>Platform management and oversight</p>
          </div>
        </div>
      </div>

      {renderStats()}

      <div className="dashboard-tabs" style={{ marginBottom: '24px' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'Overview' && '🛡️ '}
            {tab === 'Properties' && '🏢 '}
            {tab === 'Property Owners' && '👥 '}
            {tab === 'Tenants' && '👤 '}
            {tab === 'Bookings' && '💳 '}
            {tab}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === 'Overview' && (
          <div style={{ padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3>Quick Actions & System Status</h3>
            <p style={{ color: '#666' }}>System is operational. You have {properties.filter(p => p.status === 'pending').length} properties waiting for review.</p>
          </div>
        )}
        {activeTab === 'Properties' && renderProperties()}
        {activeTab === 'Property Owners' && renderTable(['Name', 'Email', 'Phone', 'Status'], owners, 'owners')}
        {activeTab === 'Tenants' && renderTable(['Name', 'Email', 'Phone'], tenants, 'tenants')}
      {activeTab === 'Bookings' && renderBookingCards()}
      {activeTab === 'Owner Payments' && renderOwnerPayments()}
</div>
{selectedBooking && (
  <BookingDetailsModal 
    booking={selectedBooking} 
    onClose={() => setSelectedBooking(null)} 
    onVerify={(id) => {
      handleBookingVerify(id);
      setSelectedBooking(null);
    }}
  />
)}
    </div>
  );
};

export default AdminDashboard;