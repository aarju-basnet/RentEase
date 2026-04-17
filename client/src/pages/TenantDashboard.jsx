import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllProperties, initiateBooking, deleteProperty } from '../services/api'; 
import '../styles.css';

export default function (){
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('Browse Properties');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for properties
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- NEW STATES FOR BOOKING ---
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // State to track current image index for each property card
  const [imageIndexes, setImageIndexes] = useState({});

  const tabs = ['Browse Properties', 'My Bookings'];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await getAllProperties();
        
        const approvedOnly = (res.properties || []).filter(
          (p) => p.status === 'approved'
        );
        
        setProperties(approvedOnly);

        // Initialize image indexes for each property to 0
        const initialIndexes = {};
        approvedOnly.forEach(p => {
            initialIndexes[p._id] = 0;
        });
        setImageIndexes(initialIndexes);

      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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

  // Gallery Navigation Functions
  const handleNextImage = (e, propertyId, imagesLength) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndexes(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] + 1) % imagesLength
    }));
  };

  const handlePrevImage = (e, propertyId, imagesLength) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndexes(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] - 1 + imagesLength) % imagesLength
    }));
  };

  // --- UPDATED KHALTI LOGIC ---
  const handlePayment = async () => {
    try {
      const advanceAmount = (selectedProperty.price * 0.1).toFixed(2);
      
      const data = await initiateBooking({ 
        amount: advanceAmount, 
        propertyId: selectedProperty._id 
      });

      // Simple redirect for Khalti
      if (data.success && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert("Payment initiation failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Could not start payment. Please try again.");
    }
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStats = () => (
    <div className="dashboard-stats-grid" style={{ marginBottom: '30px' }}>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ color: 'var(--color-accent)' }}>🏠</div>
        <div className="dashboard-stat-value">{properties.length}</div>
        <div className="dashboard-stat-label">Available Properties</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ color: 'var(--color-accent)' }}>💳</div>
        <div className="dashboard-stat-value">0</div>
        <div className="dashboard-stat-label">My Bookings</div>
      </div>
    </div>
  );

  const renderBrowseProperties = () => (
    <>
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="🔍 Search by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            width: '100%', 
            maxWidth: '400px', 
            padding: '12px 16px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--color-border)', 
            fontSize: '0.95rem' 
          }}
        />
      </div>
      <div className="property-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => {
            
            // Collect all available images
            const imageList = property.images && property.images.length > 0 
                ? property.images 
                : (property.image ? [property.image] : []);

            const currentIndex = imageIndexes[property._id] || 0;
            const currentImg = imageList[currentIndex];
            
            const imageUrl = currentImg?.startsWith('http') 
              ? currentImg 
              : `http://localhost:4000/${currentImg?.replace(/\\/g, '/')}`;

            return (
              <div key={property._id} className="property-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="property-card-image" style={{ background: '#e2e8f0', height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={property.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; }}
                  />

                  {/* GALLERY ARROWS */}
                  {imageList.length > 1 && (
                    <>
                        <button 
                            onClick={(e) => handlePrevImage(e, property._id, imageList.length)}
                            style={{ position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', zIndex: 2 }}
                        > ‹ </button>
                        <button 
                            onClick={(e) => handleNextImage(e, property._id, imageList.length)}
                            style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', zIndex: 2 }}
                        > › </button>
                        <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
                            {currentIndex + 1} / {imageList.length}
                        </div>
                    </>
                  )}
                </div>
                
                <div className="property-card-body" style={{ flexGrow: 1, padding: '15px' }}>
                  <h3 style={{ fontSize: '1.05rem', margin: '0 0 8px 0' }}>{property.title}</h3>
                  <div className="property-card-info" style={{ marginBottom: '12px', fontSize: '0.85rem' }}>
                    📍 {property.location}
                  </div>

                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#F3F4F6', 
                    borderRadius: 'var(--radius-sm)', 
                    marginBottom: '15px',
                    fontSize: '0.8rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>OWNER CONTACT</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>👤 {property.owner?.fullName || 'Owner'}</span>
                      <span>📞 {property.owner?.phoneNumber|| 'N/A'}</span>
                      <span style={{ color: 'var(--color-accent)', overflow: 'hidden', textOverflow: 'ellipsis' }}>📧 {property.owner?.email}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="property-card-price" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-accent)' }}>
                      NPR {property.price?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      🏷️ {property.type}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)', backgroundColor: '#F9FAFB', display: 'flex', gap: '8px' }}>
                  <Link to={`/properties/${property._id}`} className="icon-btn" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    👁️ Details
                  </Link>

                  <button 
                    onClick={() => handleDelete(property._id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    🗑️ 
                  </button>

                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}
                    onClick={() => {
                      setSelectedProperty(property);
                      setShowModal(true);
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>No properties available right now.</p>
        )}
      </div>
    </>
  );

  const renderPlaceholderBookings = () => (
    <div className="dashboard-content-panel" style={{ textAlign: 'center', padding: '50px' }}>
        <p>Booking history is currently unavailable.</p>
    </div>
  );

  if (loading) return <div className="dashboard-container">Loading properties...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title-wrapper">
          <div className="dashboard-icon" style={{ background: '#FFFBEB', borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}>🏠</div>
          <div>
            <h1>Tenant Dashboard</h1>
            <p>Welcome, {user?.name || 'User'}</p>
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
            {tab === 'Browse Properties' && '🔍 '}
            {tab === 'My Bookings' && '💳 '}
            {tab}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === 'Browse Properties' && renderBrowseProperties()}
        {activeTab === 'My Bookings' && renderPlaceholderBookings()}
      </div>

      {/* --- BOOKING CONFIRMATION MODAL --- */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '420px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Confirm Booking</h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Book <strong>{selectedProperty?.title}</strong></p>
            
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Total Rent</span>
                <span>NPR {selectedProperty?.price?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                <span>Advance (10%)</span>
                <span>NPR {(selectedProperty?.price * 0.1)?.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={handlePayment} style={{ width: '100%', padding: '14px', backgroundColor: '#5C2D91', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
              Pay with Khalti
            </button>
            <button onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

