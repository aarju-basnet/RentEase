/**
 * AdminDashboard.jsx
 *
 * Dashboard for Admin to manage properties, property owners, tenants, and bookings.
 */

import { useState } from 'react';
import '../styles.css';

const MOCK_PROPERTIES = [
  { id: 1, name: 'Modern Apartment in Kathmandu', location: 'Baneshwor, Kathmandu', owner: 'Rajesh Shrestha', price: '25,000', status: 'approved' },
  { id: 2, name: 'Cozy House in Pokhara', location: 'Lakeside, Pokhara', owner: 'Sita Gurung', price: '18,000', status: 'approved' },
  { id: 3, name: 'Luxury Apartment in Lalitpur', location: 'Jhamsikhel, Lalitpur', owner: 'Rajesh Shrestha', price: '45,000', status: 'approved' },
  { id: 4, name: 'Traditional Room in Bhaktapur', location: 'Durbar Square, Bhaktapur', owner: 'Sita Gurung', price: '12,000', status: 'pending' },
];

const MOCK_PROPERTY_OWNERS = [
  { id: 1, name: 'Rajesh Shrestha', email: 'rajesh@rentease.com', phone: '+977-9841234567', status: 'verified' },
  { id: 2, name: 'Sita Gurung', email: 'sita@rentease.com', phone: '+977-9856123456', status: 'unverified' },
];

const MOCK_TENANTS = [
  { id: 1, name: 'Hari Prasad', email: 'hari@rentease.com', phone: '+977-9812345678' },
  { id: 2, name: 'Maya Tamang', email: 'maya@rentease.com', phone: '+977-9823456789' },
];

const MOCK_BOOKINGS = [
  { id: 1, property: 'Modern Apartment in Kathmandu', tenant: 'Hari Prasad', tenantEmail: 'hari@rentease.com', duration: '2026-04-01 → 2026-06-30', amount: '75,000', payment: 'completed', status: 'approved' },
  { id: 2, property: 'Luxury Apartment in Lalitpur', tenant: 'Maya Tamang', tenantEmail: 'maya@rentease.com', duration: '2026-04-15 → 2026-07-15', amount: '135,000', payment: 'pending', status: 'pending' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [propertyFilter, setPropertyFilter] = useState('All');

  const tabs = ['Overview', 'Properties', 'Property Owners', 'Tenants', 'Bookings'];

  const filteredProperties = MOCK_PROPERTIES.filter(p => propertyFilter === 'All' || p.status === propertyFilter.toLowerCase());

  const renderOverview = () => (
    <div className="dashboard-stats-grid">
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon">👥</div>
        <div className="dashboard-stat-value">5</div>
        <div className="dashboard-stat-label">Total Users</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon">🏢</div>
        <div className="dashboard-stat-value">6</div>
        <div className="dashboard-stat-label">Total Properties</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon">⏱️</div>
        <div className="dashboard-stat-value">2</div>
        <div className="dashboard-stat-label">Pending Approvals</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon">💳</div>
        <div className="dashboard-stat-value">2</div>
        <div className="dashboard-stat-label">Total Bookings</div>
      </div>
    </div>
  );

  const renderProperties = () => (
    <div className="dashboard-content-panel">
      <div className="dashboard-sub-filters">
        {['All', 'Pending', 'Approved', 'Rejected'].map(filter => (
          <button
            key={filter}
            className={`dashboard-sub-filter ${propertyFilter === filter ? 'active' : ''}`}
            onClick={() => setPropertyFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Location</th>
            <th>Owner</th>
            <th>Price (NPR)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProperties.map(property => (
            <tr key={property.id}>
              <td>
                <div className="table-property-cell">
                  {/* Placeholder for image */}
                  <div className="table-property-img"></div>
                  <span>{property.name}</span>
                </div>
              </td>
              <td>{property.location}</td>
              <td>{property.owner}</td>
              <td>{property.price}</td>
              <td>
                <span className={`status-badge status-${property.status}`}>
                  {property.status}
                </span>
              </td>
              <td className="table-actions">
                <button className="icon-btn" title="View">👁️</button>
                {property.status === 'pending' && (
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

  const renderPropertyOwners = () => (
    <div className="dashboard-content-panel">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_PROPERTY_OWNERS.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <span className={`status-badge status-${user.status}`}>
                  {user.status}
                </span>
              </td>
              <td className="table-actions">
                {user.status === 'unverified' && (
                  <button className="icon-btn success" title="Verify">👤✅</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTenants = () => (
    <div className="dashboard-content-panel">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_TENANTS.map(tenant => (
            <tr key={tenant.id}>
              <td>{tenant.name}</td>
              <td>{tenant.email}</td>
              <td>{tenant.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBookings = () => (
    <div className="dashboard-content-panel">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Property</th>
            <th>Tenant</th>
            <th>Duration</th>
            <th>Amount (NPR)</th>
            <th>Payment</th>
            <th>Booking Status</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_BOOKINGS.map(booking => (
            <tr key={booking.id}>
              <td>#{booking.id}</td>
              <td>{booking.property}</td>
              <td>
                <div className="tenant-cell">
                  <div>{booking.tenant}</div>
                  <div className="text-small text-muted">{booking.tenantEmail}</div>
                </div>
              </td>
              <td>{booking.duration}</td>
              <td className="font-bold">{booking.amount}</td>
              <td>
                <span className={`status-badge payment-${booking.payment}`}>
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
      <div className="dashboard-header">
        <div className="dashboard-title-wrapper">
          <div className="dashboard-icon">🛡️</div>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Full platform management</p>
          </div>
        </div>
        
        <div className="dashboard-tabs">
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
      </div>

      <div className="dashboard-content">
        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Properties' && renderProperties()}
        {activeTab === 'Property Owners' && renderPropertyOwners()}
        {activeTab === 'Tenants' && renderTenants()}
        {activeTab === 'Bookings' && renderBookings()}
      </div>
    </div>
  );
};

export default AdminDashboard;
