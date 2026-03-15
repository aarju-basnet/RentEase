import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const MOCK_MY_PROPERTIES = [
  { id: 1, name: 'Modern Apartment in Kathmandu', location: 'Baneshwor, Kathmandu', price: '25,000', beds: 2, status: 'approved', image: '🏙️' },
  { id: 2, name: 'Luxury Apartment in Lalitpur', location: 'Jhamsikhel, Lalitpur', price: '45,000', beds: 3, status: 'approved', image: '🛋️' },
  { id: 3, name: 'Furnished Studio in Chitwan', location: 'Bharatpur, Chitwan', price: '10,000', beds: 1, status: 'approved', image: '🛏️' },
];

const MOCK_BOOKING_REQUESTS = [
  { id: 1, property: 'Modern Apartment in Kathmandu', tenant: 'Hari Prasad', tenantEmail: 'hari@rentease.com', duration: '2026-04-01 → 2026-06-30', amount: '75,000', status: 'approved' },
  { id: 2, property: 'Luxury Apartment in Lalitpur', tenant: 'Maya Tamang', tenantEmail: 'maya@rentease.com', duration: '2026-04-15 → 2026-07-15', amount: '135,000', status: 'pending' },
];

const PropertyOwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('My Properties');

  const tabs = ['My Properties', 'Booking Requests'];

  const renderStats = () => (
    <div className="dashboard-stats-grid" style={{ marginBottom: '30px' }}>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon">🏢</div>
        <div className="dashboard-stat-value">3</div>
        <div className="dashboard-stat-label">My Properties</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ color: '#16a34a' }}>✅</div>
        <div className="dashboard-stat-value">3</div>
        <div className="dashboard-stat-label">Approved</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ color: '#d97706' }}>⏱️</div>
        <div className="dashboard-stat-value">0</div>
        <div className="dashboard-stat-label">Pending Review</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon">💳</div>
        <div className="dashboard-stat-value">1</div>
        <div className="dashboard-stat-label">Booking Requests</div>
      </div>
    </div>
  );

  const renderMyProperties = () => (
    <div className="property-grid">
      {MOCK_MY_PROPERTIES.map(property => (
        <div key={property.id} className="property-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="property-card-image" style={{ background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', height: '200px' }}>
            {property.image}
          </div>
          <div className="property-card-body" style={{ flexGrow: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.05rem', margin: 0, paddingRight: '10px' }}>{property.name}</h3>
              <span className={`status-badge status-${property.status}`}>{property.status}</span>
            </div>
            <div className="property-card-info" style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
              📍 {property.location}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div className="property-card-price" style={{ margin: 0, fontSize: '1.1rem' }}>
                 NPR {property.price}<span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>/mo</span>
               </div>
               <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                 🛏️ {property.beds} bed
               </div>
            </div>
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)', backgroundColor: '#F9FAFB', textAlign: 'center' }}>
            <button className="icon-btn" style={{ width: '100%', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              👁️ View Details
            </button>
          </div>
        </div>
      ))}
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
            <th>Booking Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_BOOKING_REQUESTS.map(booking => (
             <tr key={booking.id}>
               <td className="font-bold">{booking.property}</td>
               <td>
                 <div className="tenant-cell">
                   <div>{booking.tenant}</div>
                   <div className="text-small text-muted">{booking.tenantEmail}</div>
                 </div>
               </td>
               <td>{booking.duration}</td>
               <td className="font-bold">{booking.amount}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="dashboard-title-wrapper" style={{ marginBottom: 0 }}>
          <div className="dashboard-icon" style={{ background: '#FFFBEB', borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}>🏢</div>
          <div>
            <h1>Property Owner Dashboard</h1>
            <p>Welcome, Rajesh Shrestha</p>
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
            style={{ borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' /* Simplistic approach here, normally use first-child/last-child */}}
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
