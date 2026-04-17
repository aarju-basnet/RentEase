
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const { id, title, image, price, type, location } = property;

  return (
    <div className="property-card">
      {/* Property Image with type badge */}
      <div className="property-card-image">
        <img src={image} alt={title} loading="lazy" />
        <span className={`property-card-badge ${type === 'Room' ? 'badge-room' : 'badge-apartment'}`}>
          {type}
        </span>
      </div>

      {/* Card Body */}
      <div className="property-card-body">
        <h3>{title}</h3>
        <div className="property-card-info">
          <span>
            <span className="info-icon">📍</span>
            {location}
          </span>
        </div>
        <div className="property-card-footer">
          <span className="property-card-price">
            <span className="price-icon">💰</span>
            NPR {price.toLocaleString()}/mo
          </span>
          <Link to={`/properties/${id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
