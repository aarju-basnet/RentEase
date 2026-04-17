import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

// Added deleteProperty to the imports
import { getOwnerProperties, deleteProperty } from '../services/api';

// --- HELPER COMPONENT FOR IMAGE SLIDER ---
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('My Properties');
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['My Properties', 'Booking Requests'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const propRes = await getOwnerProperties();
        
        if (propRes && propRes.properties) {
          setProperties(propRes.properties);
        } else {
          setProperties([]);
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

  const renderStats = () => {
    const approvedCount = properties.filter(p => p.status === 'approved').length;
    const pendingCount = properties.filter(p => p.status === 'pending').length;

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
          <div className="dashboard-stat-value">{bookings.length}</div>
          <div className="dashboard-stat-label">Booking Requests</div>
        </div>
      </div>
    );
  };

  const renderMyProperties = () => (
    <div className="property-grid" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
      gap: '20px' 
    }}>
      {properties.length > 0 ? (
        properties.map(property => {
          const imageList = property.images && property.images.length > 0 ? property.images : (property.image ? [property.image] : []);

          return (
            <div key={property._id} className="property-card" style={{ display: 'flex', flexDirection: 'column', maxWidth: '280px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              
              {/* COMPONENT REPLACED HERE FOR CLICK BUTTONS */}
              <ImageSlider images={imageList} title={property.title} status={property.status} />
              
              <div className="property-card-body" style={{ flexGrow: 1, padding: '12px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '0.95rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {property.title}
                  </h3>
                </div>
                <div className="property-card-info" style={{ marginBottom: '12px', fontSize: '0.8rem' }}>
                  📍 {property.location}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div className="property-card-price" style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
                     NPR {property.price?.toLocaleString()}
                   </div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                     🏷️ {property.type}
                   </div>
                </div>
              </div>
              
              <div style={{ 
                padding: '10px', 
                borderTop: '1px solid var(--color-border)', 
                backgroundColor: '#F9FAFB', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Link to={`/properties/${property._id}`} className="icon-btn" style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-accent)' }}>
                  👁️ View
                </Link>
                
                <button 
                  onClick={() => handleDelete(property._id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#ef4444', 
                    cursor: 'pointer', 
                    fontSize: '0.85rem', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
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

  const renderBookingRequests = () => (
    <div className="dashboard-content-panel">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Tenant</th>
            <th>Duration</th>
            <th>Amount (NPR)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <tr key={booking._id}>
                <td className="font-bold">{booking.property?.name || 'Deleted Property'}</td>
                <td>
                  <div className="tenant-cell">
                    <div>{booking.tenant?.name}</div>
                    <div className="text-small text-muted">{booking.tenant?.email}</div>
                  </div>
                </td>
                <td>{new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}</td>
                <td className="font-bold">{booking.totalPrice}</td>
                <td>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="table-actions">
                  {booking.status === 'pending' && (
                    <>
                      <button className="icon-btn success" title="Approve">✅</button>
                      <button className="icon-btn danger" title="Reject">❌</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No booking requests found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <div className="dashboard-container">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="dashboard-title-wrapper" style={{ marginBottom: 0 }}>
          <div className="dashboard-icon" style={{ background: '#FFFBEB', borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}>🏢</div>
          <div>
            <h1>Property Owner Dashboard</h1>
            <p>Welcome, {user?.name || 'Owner'}</p>
          </div>
        </div>
        <Link to="/add-property" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⊕</span> Add Property
        </Link>
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
      </div>
    </div>
  );
};

export default PropertyOwnerDashboard;