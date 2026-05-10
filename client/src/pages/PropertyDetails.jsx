import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import API from '../services/api'; 

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booked, setBooked] = useState(false);
  
  // State to track which image is currently being viewed
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await API.get(`/properties/${id}`);
        if (res.data.success) {
          setProperty(res.data.property);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
    setBooked(false);
  }, [id]);

  const handleBookNow = () => {
    setBooked(true);
    console.log(`Booking request for property ID: ${id}`);
  };

  if (loading) {
    return <div className="details-page"><div className="no-results"><h3>Loading...</h3></div></div>;
  }
  const isAdmin = user && user.role === 'admin';

 if (error) {
    return (
      <div className="details-page">
        <button onClick={() => navigate(-1)} className="back-link">← Go Back</button>
        <div className="no-results" style={{ border: '1px solid #fee2e2', backgroundColor: '#fef2f2', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ color: '#dc2626' }}>{isAdmin ? "Admin Review Required" : "Access Restricted"}</h3>
          <p>{error}</p>
          {isAdmin && (
            <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
              Tip: If you are seeing this as an Admin, double-check that your token is valid and the backend route is protected.
            </p>
          )}
          <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ marginTop: '15px' }}>Return to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!property) return null;

  // Helper to format image URLs
  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/600x400?text=No+Image';
    return img.startsWith('http') ? img : `http://localhost:4000/${img.replace(/\\/g, '/')}`;
  };

  // Get the array of images (fallback to single image if array doesn't exist)
  const imageList = property.images && property.images.length > 0 ? property.images : (property.image ? [property.image] : []);

  return (
    <div className="details-page">
      <button onClick={() => navigate(-1)} className="back-link">← Back to dashboard</button>

      <div className="details-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1>{property.title}</h1>
          {property.status === 'pending' && (
            <span className="status-badge status-pending">Pending Approval</span>
          )}
        </div>
        <div className="details-meta">
          <span>📍 {property.location}</span>
          <span>🏷️ {property.type}</span>
          <span>📅 Posted: {new Date(property.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* --- UPDATED IMAGE GALLERY SECTION --- */}
      <div className="details-grid" style={{ marginBottom: '30px' }}>
        <div style={{ width: '100%' }}>
          {/* Main Large Image */}
          <div className="main-image-container" style={{ width: '100%', height: '450px', overflow: 'hidden', borderRadius: '12px', background: '#f1f5f9' }}>
            <img 
              src={getImageUrl(imageList[activeImage])} 
              alt={property.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'; }}
            />
          </div>

          {/* Thumbnails */}
          {imageList.length > 1 && (
            <div className="thumbnail-gallery" style={{ display: 'flex', gap: '10px', marginTop: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
              {imageList.map((img, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  style={{ 
                    width: '80px', 
                    height: '60px', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    border: activeImage === index ? '3px solid var(--color-accent, #3b82f6)' : '2px solid transparent',
                    transition: '0.2s'
                  }}
                >
                  <img src={getImageUrl(img)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* --- END IMAGE GALLERY SECTION --- */}

      <div className="details-grid">
        <div className="details-content">
          <h2>About This Property</h2>
          <p>{property.description}</p>

          <h2>Property Features</h2>
          <div className="details-features">
            <div className="feature-item">
              <span className="feature-icon">🛏️</span>
              {property.bedrooms || 0} Bedroom{(parseInt(property.bedrooms) !== 1) ? 's' : ''}
            </div>
            
            <div className="feature-item">
              <span className="feature-icon">🚿</span>
              {property.bathrooms || 0} Bathroom{(parseInt(property.bathrooms) !== 1) ? 's' : ''}
            </div>
            
            <div className="feature-item">
              <span className="feature-icon">📐</span>
              {property.area ? `${property.area}` : 'N/A'}
            </div>
            
            <div className="feature-item">
              <span className="feature-icon">🪑</span>
              {property.furnished || 'Unfurnished'}
            </div>
          </div>
        </div>

        <div>
          <div className="booking-card">
            <div className="price-display">NPR {property.price?.toLocaleString()}</div>
            <div className="price-period">per month</div>
            <hr />

            <div className="owner-section">
              <div className="owner-avatar">
                {property.owner?.name?.charAt(0) || 'O'}
              </div>
              <div>
                <div className="owner-name">{property.owner?.fullName || "Property Owner"}</div>
                <div className="owner-name">{property.owner?.phoneNumber || "Property Owner"}</div>
                <div className="owner-role">Verified Host</div>
              </div>
            </div>

            <hr />

            {booked ? (
              <div className="form-success">✅ Booking request sent successfully!</div>
            ) : (
              <button
                className="btn btn-accent btn-lg btn-block"
                onClick={handleBookNow}
                disabled={property.status === 'pending'}
              >
                {property.status === 'pending' ? 'Awaiting Approval' : 'Book Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;