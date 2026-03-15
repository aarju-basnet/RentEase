import { useState } from 'react';
import '../styles.css';

const MOCK_PROPERTIES = [
  { id: 1, name: 'Modern Apartment in Kathmandu', location: 'Baneshwor, Kathmandu', price: '25,000', beds: 2, image: '🏙️' },
  { id: 2, name: 'Cozy House in Pokhara', location: 'Lakeside, Pokhara', price: '18,000', beds: 3, image: '🏡' },
  { id: 3, name: 'Luxury Apartment in Lalitpur', location: 'Jhamsikhel, Lalitpur', price: '45,000', beds: 3, image: '🛋️' },
  { id: 4, name: 'Traditional Room in Bhaktapur', location: 'Durbar Square, Bhaktapur', price: '12,000', beds: 1, image: '⛩️' },
];

const MOCK_MY_BOOKINGS = [
  { id: 1, property: 'Modern Apartment in Kathmandu', duration: '2026-04-01 → 2026-06-30', amount: '75,000', payment: 'completed', status: 'approved' },
];

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState('Browse Properties');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['Browse Properties', 'My Bookings'];

  const filteredProperties = MOCK_PROPERTIES.filter(property =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStats = () => (
    <div className="dashboard-stats-grid" style={{ marginBottom: '30px' }}>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ color: 'var(--color-accent)' }}>🏠</div>
        <div className="dashboard-stat-value">4</div>
        <div className="dashboard-stat-label">Available Properties</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ color: 'var(--color-accent)' }}>💳</div>
        <div className="dashboard-stat-value">1</div>
        <div className="dashboard-stat-label">My Bookings</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ color: '#16a34a' }}>✅</div>
        <div className="dashboard-stat-value">1</div>
        <div className="dashboard-stat-label">Approved</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ color: '#d97706' }}>⏱️</div>
        <div className="dashboard-stat-value">0</div>
        <div className="dashboard-stat-label">Pending</div>
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
          style={{ width: '100%', maxWidth: '400px', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
        />
      </div>
      <div className="property-grid">
        {filteredProperties.map(property => (
          <div key={property.id} className="property-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="property-card-image" style={{ background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', height: '200px' }}>
              {property.image}
            </div>
            <div className="property-card-body" style={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', margin: 0, paddingRight: '10px' }}>{property.name}</h3>
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
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)', backgroundColor: '#F9FAFB', display: 'flex', gap: '8px' }}>
              <button className="icon-btn" style={{ flex: 1, borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                👁️ Details
              </button>
              <button className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderMyBookings = () => (
    <div className="dashboard-content-panel">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Duration</th>
            <th>Amount (NPR)</th>
            <th>Payment</th>
            <th>Booking Status</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_MY_BOOKINGS.map(booking => (
            <tr key={booking.id}>
              <td className="font-bold">{booking.property}</td>
              <td>{booking.duration}</td>
              <td className="font-bold">{booking.amount}</td>
              <td>
                <span className={`status-badge status-${booking.payment === 'completed' ? 'approved' : 'pending'}`}>
                  {booking.payment}
                </span>
              </td>
              <td>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status}
                </span>
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
          <div className="dashboard-icon" style={{ background: '#FFFBEB', borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}>🏠</div>
          <div>
            <h1>Tenant Dashboard</h1>
            <p>Welcome, Hari Prasad</p>
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
        {activeTab === 'My Bookings' && renderMyBookings()}
      </div>
    </div>
  );
};

export default TenantDashboard;
