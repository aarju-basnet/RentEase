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
  deleteAllRejected
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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [propertyFilter, setPropertyFilter] = useState('All');
  
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState([]);

  const tabs = ['Overview', 'Properties', 'Property Owners', 'Tenants', 'Bookings'];

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
    if (!window.confirm("Permanently delete this property?")) return;
    try {
      await deleteProperty(id);
      const propRes = await getAllProperties();
      setProperties(propRes.properties || []);
      setSelectedProperties(prev => prev.filter(item => item !== id));
    } catch (err) {
      alert("Delete failed");
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
        <div className="dashboard-stat-value">{bookings.length}</div>
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
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Owner: {property.owner?.fullName}</p>
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
                  <td>{item.property?.title}</td>
                  <td>{item.tenant?.fullName}</td>
                  <td>{new Date(item.startDate).toLocaleDateString()}</td>
                  <td className="font-bold">NPR {item.totalPrice}</td>
                  <td><span className={`status-badge status-${item.status}`}>{item.status}</span></td>
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
        {activeTab === 'Bookings' && renderTable(['Property', 'Tenant', 'Date', 'Amount', 'Status'], bookings, 'bookings')}
      </div>
    </div>
  );
};

export default AdminDashboard;