import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProperty } from '../services/api';

const AddProperty = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    type: 'Apartment',
    description: '',
    image: [], // ✅ changed to array
    bedrooms: '',
    bathrooms: '',
    area: '',
    furnished: 'Unfurnished',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...Array.from(files)], // ✅ multiple images
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ REMOVE IMAGE
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  // ✅ REORDER IMAGE
  const moveImage = (index, direction) => {
    const newImages = [...formData.image];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];

    setFormData((prev) => ({
      ...prev,
      image: newImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === 'image') {
        formData.image.forEach((file) => {
          data.append('images', file); // ✅ important
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await addProperty(data);
      if (response.success) {
        setMessage(response.message || 'Property listed successfully!');
        setTimeout(() => navigate('/owner/dashboard'), 1000);
      } else {
        setMessage(response.message || 'Failed to add property.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error. Please try again.');
    }
  };

  return (
    <div className="form-page" style={{ padding: '20px', backgroundColor: '#f8fafc' }}>
      <div
        className="form-container wide"
        style={{
          maxWidth: '750px',
          margin: 'auto',
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        }}
      >
        <div className="form-header" style={{ textAlign: 'center', marginBottom: '30px', position: 'relative' }}>
          
          {/* ✅ FIXED X BUTTON */}
          <button
            type="button"
            onClick={() => navigate('/owner/dashboard')}
            style={{
              position: 'absolute',
              top: '-10px',
              right: '0',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            ✕
          </button>

          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏘️</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>List Your Property</h2>
          <p style={{ color: '#64748b' }}>Fill in the details to find your next tenant</p>
        </div>

        {message && (
          <div className="form-success" style={{ textAlign: 'center', marginBottom: '20px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
              <label style={{ fontWeight: '600', color: '#475569' }}>Property Title</label>
              <input type="text" name="title" placeholder="e.g. Modern 2BHK Apartment" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>

              <div className="form-group">
              <label style={{ fontWeight: '600', color: '#475569' }}>Monthly(NPR)</label>
              <input type="number" name="price" placeholder="15000" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>

                <div className="form-group">
              <label style={{ fontWeight: '600', color: '#475569' }}>Location</label>
              <input type="text" name="location" placeholder="Kathmandu, Bagmati" value={formData.location} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>


            <div className="form-group">
              <label style={{ fontWeight: '600', color: '#475569' }}>Type</label>
              <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <option value="Apartment">Apartment</option>
                <option value="Room">Room</option>
                <option value="Villa">Villa</option>
                <option value="Studio">Studio</option>
              </select>
            </div>  


          


            


            

            <div className="form-group">
               <label style={{ fontWeight: '600', color: '#475569' }}>Images</label>
              <input type="file" name="image" multiple onChange={handleChange}  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />

              {/* ✅ PREVIEW */}
              {formData.image.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap', borderRadius: '8px',width: '100%', border: '1px solid #cbd5e1' }}>
                  {formData.image.map((img, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '10px',
                        }}
                      />

                      {/* DELETE */}
                      <button type="button" onClick={() => handleRemoveImage(index)} style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer'
                      }}>✕</button>

                      {/* LEFT */}
                      <button type="button" onClick={() => moveImage(index, 'left')} style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        fontSize: '10px'
                      }}>◀</button>

                      {/* RIGHT */}
                      <button type="button" onClick={() => moveImage(index, 'right')} style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        fontSize: '10px'
                      }}>▶</button>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label style={{ fontWeight: '600', color: '#475569' }}>Description</label>
            <textarea name="description" placeholder="Describe amenities, landmarks, etc." value={formData.description} onChange={handleChange} required style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none' }}></textarea>
          </div>

               <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginTop: '30px', marginBottom: '15px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>Property Features</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
            <div className="feature-input" style={{ background: '#f1f5f9', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '20px' }}>🛏️</span>
              <input type="number" name="bedrooms" placeholder="Beds" value={formData.bedrooms} onChange={handleChange} style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'center', fontWeight: '600' }} />
            </div>

            <div className="feature-input" style={{ background: '#f1f5f9', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '20px' }}>🚿</span>
              <input type="number" name="bathrooms" placeholder="Baths" value={formData.bathrooms} onChange={handleChange} style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'center', fontWeight: '600' }} />
            </div>

            <div className="feature-input" style={{ background: '#f1f5f9', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '20px' }}>📐</span>
              <input type="text" name="area" placeholder="Area" value={formData.area} onChange={handleChange} style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'center', fontWeight: '600' }} />
            </div>

            <div className="feature-input" style={{ background: '#f1f5f9', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '20px' }}>🪑</span>
              <select name="furnished" value={formData.furnished} onChange={handleChange} style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'center', fontWeight: '600', cursor: 'pointer' }}>
                <option value="Unfurnished">No</option>
                <option value="Furnished">Yes</option>
              </select>
            </div>
          </div>



          <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Submit Property
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;