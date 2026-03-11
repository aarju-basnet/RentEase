/**
 * PropertyDetails Page
 *
 * Displays full details for a single property, including:
 *   - Large image
 *   - Title, location, price, type
 *   - Description
 *   - Features grid (bedrooms, bathrooms, area, etc.)
 *   - Owner info and contact
 *   - "Book Now" button
 *
 * Gets the property ID from the URL via useParams.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProperties } from '../services/api';

const PropertyDetails = () => {
  // Get the property ID from the URL parameter
  const { id } = useParams();

  // State for the property data and booking status
  const [property, setProperty] = useState(null);
  const [booked, setBooked] = useState(false);

  // Find the property from mock data when the component mounts
  useEffect(() => {
    const found = mockProperties.find((p) => p.id === Number(id));
    setProperty(found || null);
    // Reset booking status when viewing a different property
    setBooked(false);
  }, [id]);

  // Handle the "Book Now" button click
  const handleBookNow = () => {
    setBooked(true);
    // In production, this would call an API to create a booking
    console.log(`Booking request for property ID: ${id}`);
  };

  // Show a message if the property is not found
  if (!property) {
    return (
      <div className="details-page">
        <Link to="/properties" className="back-link">
          ← Back to Properties
        </Link>
        <div className="no-results">
          <h3>Property Not Found</h3>
          <p>The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      {/* Back navigation link */}
      <Link to="/properties" className="back-link">
        ← Back to Properties
      </Link>

      {/* Property Header */}
      <div className="details-header">
        <h1>{property.title}</h1>
        <div className="details-meta">
          <span>📍 {property.location}</span>
          <span>🏷️ {property.type}</span>
          <span>📅 Posted: {property.posted}</span>
        </div>
      </div>

      {/* Main Property Image */}
      <div className="details-image">
        <img src={property.image} alt={property.title} />
      </div>

      {/* Two-column layout: content + booking sidebar */}
      <div className="details-grid">
        {/* Left: Description and features */}
        <div className="details-content">
          <h2>About This Property</h2>
          <p>{property.description}</p>

          <h2>Property Features</h2>
          <div className="details-features">
            <div className="feature-item">
              <span className="feature-icon">🛏️</span>
              {property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚿</span>
              {property.bathrooms} Bathroom{property.bathrooms > 1 ? 's' : ''}
            </div>
            <div className="feature-item">
              <span className="feature-icon">📐</span>
              {property.area}
            </div>
            <div className="feature-item">
              <span className="feature-icon">🪑</span>
              {property.furnished}
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚗</span>
              Parking: {property.parking}
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏠</span>
              {property.type}
            </div>
          </div>
        </div>

        {/* Right: Booking card sidebar */}
        <div>
          <div className="booking-card">
            <div className="price-display">₹{property.price.toLocaleString()}</div>
            <div className="price-period">per month</div>

            <hr />

            {/* Owner Info */}
            <div className="owner-section">
              <div className="owner-avatar">
                {property.owner.charAt(0)}
              </div>
              <div>
                <div className="owner-name">{property.owner}</div>
                <div className="owner-role">Property Owner</div>
              </div>
            </div>

            <div className="feature-item mb-2">
              <span className="feature-icon">📧</span>
              {property.ownerContact}
            </div>
            <div className="feature-item mb-2">
              <span className="feature-icon">📞</span>
              {property.ownerPhone}
            </div>

            <hr />

            {/* Booking confirmation or Book Now button */}
            {booked ? (
              <div className="form-success">
                ✅ Booking request sent successfully!
              </div>
            ) : (
              <button
                className="btn btn-accent btn-lg btn-block"
                onClick={handleBookNow}
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
