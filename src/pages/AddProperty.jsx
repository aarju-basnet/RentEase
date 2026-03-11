/**
 * AddProperty Page
 *
 * Form for property owners to list a new property.
 * Fields:
 *   - Property Title, Location, Price, Property Type
 *   - Description, Image URL
 *
 * Submits data via the API service (falls back to mock).
 * Shows a success message upon submission.
 */

import { useState } from 'react';
import { addProperty } from '../services/api';

const AddProperty = () => {
  // Form field state
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    type: 'Apartment',
    description: '',
    image: '',
  });

  // Success message state
  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('New Property Data:', formData);

    // Call the API (will fall back to mock response)
    const response = await addProperty(formData);
    setMessage(response.message || 'Property listed successfully!');

    // Clear form after submission
    setFormData({
      title: '',
      location: '',
      price: '',
      type: 'Apartment',
      description: '',
      image: '',
    });
  };

  return (
    <div className="form-page">
      <div className="form-container wide">
        {/* Form Header */}
        <div className="form-header">
          <div className="form-icon">🏘️</div>
          <h2>List Your Property</h2>
          <p>Reach thousands of potential tenants on RentEase</p>
        </div>

        {/* Success message */}
        {message && <div className="form-success">{message}</div>}

        {/* Add Property Form */}
        <form onSubmit={handleSubmit}>
          {/* Property Title */}
          <div className="form-group">
            <label htmlFor="prop-title">Property Title</label>
            <input
              id="prop-title"
              type="text"
              name="title"
              placeholder="e.g. Modern 2BHK Apartment"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Location and Price in a row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prop-location">Location</label>
              <input
                id="prop-location"
                type="text"
                name="location"
                placeholder="e.g. Mumbai, Maharashtra"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="prop-price">Monthly Rent (₹)</label>
              <input
                id="prop-price"
                type="number"
                name="price"
                placeholder="e.g. 25000"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Property Type and Image URL in a row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prop-type">Property Type</label>
              <select
                id="prop-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="prop-image">Image URL</label>
              <input
                id="prop-image"
                type="url"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="prop-description">Description</label>
            <textarea
              id="prop-description"
              name="description"
              placeholder="Describe your property — amenities, features, nearby landmarks, etc."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Submit button */}
          <button type="submit" className="btn btn-primary btn-lg btn-block">
            Submit Property
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
