import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllProperties, initiateBooking, deleteProperty, getTenantBookings, acceptBooking  } from '../services/api'; 
import '../styles.css';

export default function TenantDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('Browse Properties');
  const [searchQuery, setSearchQuery] = useState('');
  
const [suggestionIndex, setSuggestionIndex] = useState(0);
const [isVisible, setIsVisible] = useState(false);

  // State for properties
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- NEW STATES FOR BOOKING ---
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  

  // NEW: Form states for shifting and members
  const [shiftSchedule, setShiftSchedule] = useState('this-week');
  const [memberCount, setMemberCount] = useState(1);

  const [myBookings, setMyBookings] = useState([]);
  const [showQR, setShowQR] = useState(false);
  // State to track current image index for each property card
  const [imageIndexes, setImageIndexes] = useState({});

  const [bookingDetails, setBookingDetails] = useState({
    months: 1,
    members: 1,
    paymentType: 'advance',
    shiftSchedule: 'this-week',
    hometown: '',
    profession: '',
    purpose: 'Studying' 
  });

const calculateCosts = () => {
  if (!selectedProperty) return { totalRent: 0, systemFee: 0, payableNow: 0, ownerGets: 0 };
  
  const monthlyPrice = Number(selectedProperty.price);
  let systemFee = 0;
  let payableNow = 0;
  let ownerGets = 0; // This is what the admin should actually transfer later

  if (bookingDetails.paymentType === 'advance') {
    // 20% of the rent is the base for the owner
    ownerGets = monthlyPrice * 0.20; 
    // 1% fee on that advance amount
    systemFee = ownerGets * 0.01; 
    // Tenant pays the 20% + the 1% fee
    payableNow = ownerGets + systemFee; 
  } else {
    // 100% of the rent is the base for the owner
    ownerGets = monthlyPrice; 
    // 3% fee on the full amount (You mentioned 5% earlier, 3% here—use whichever you prefer!)
    systemFee = ownerGets * 0.03; 
    // Tenant pays the full rent + the 3% fee
    payableNow = ownerGets + systemFee; 
  }

 return {
    totalRent: monthlyPrice,
    systemFee: systemFee,
    payableNow: payableNow,
    ownerGets: ownerGets // SAVE THIS TO YOUR DATABASE
  };
};


const [savedIds, setSavedIds] = useState(() => {
  const saved = localStorage.getItem('savedProperties');
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    // Only return actual strings/IDs, remove any empty "ghost" values
    return Array.isArray(parsed) ? parsed.filter(id => id && id.length > 0) : [];
  } catch {
    return [];
  }
})

const toggleSave = (e, id) => {
  e.preventDefault();
  e.stopPropagation();
  
  // 1. NEVER save if the ID is missing
  if (!id) return; 

  const stringId = id.toString();

  setSavedIds(prev => {
    const isAlreadySaved = prev.includes(stringId);
    const updated = isAlreadySaved 
      ? prev.filter(favId => favId !== stringId) 
      : [...prev, stringId];
    
    // 2. Clean the array before saving to localStorage
    const cleanUpdate = updated.filter(val => val && val.toString().trim() !== "");
    localStorage.setItem('savedProperties', JSON.stringify(cleanUpdate));
    
    return cleanUpdate;
  });
};
  console.log("Current Saved IDs:", savedIds);
  
  const { totalRent, systemFee, payableNow } = calculateCosts();
  const [sentRequests, setSentRequests] = useState([]);

const handleBookingSubmit = async () => {
    // 1. Validation
    if (!selectedProperty) return;
    
    if (!bookingDetails.paymentScreenshot) {
        alert("Please upload your payment screenshot first.");
        return;
    }

    try {
        setLoading(true); // Optional: add a small loading state for the button
        
        const formData = new FormData();
        
        // Append the file
        formData.append('paymentScreenshot', bookingDetails.paymentScreenshot);
        
        // Append property & user info
        formData.append('propertyId', selectedProperty._id);
        formData.append('ownerId', selectedProperty.owner?._id || selectedProperty.owner);
        
        // Append booking specifics
        formData.append('amount', payableNow);
        formData.append('systemFee', systemFee);
        formData.append('paymentType', bookingDetails.paymentType);
        formData.append('months', bookingDetails.months);
        formData.append('members', bookingDetails.members);
        formData.append('shiftSchedule', bookingDetails.shiftSchedule);
        formData.append('hometown', bookingDetails.hometown);
        formData.append('profession', bookingDetails.profession);
        formData.append('purpose', bookingDetails.purpose);
        
        // Set initial status for Admin panel
        formData.append('status', 'awaiting_payment_verification');

        const response = await initiateBooking(formData);

        if (response.success) {
            alert("Booking submitted successfully! Admin will verify your payment.");
            // Update UI
            setSentRequests(prev => [...prev, selectedProperty._id.toString()]);
            setShowModal(false);
            setShowQR(false);
            // Reset booking details if needed
        } else {
            alert(response.message || "Failed to submit booking.");
        }
    } catch (error) {
        console.error("Booking Error:", error);
        alert("An error occurred while submitting your booking.");
    } finally {
        setLoading(false);
    }
};

const tenantSuggestions = [
  "Please try to read this suggestion as these are made for you",
  "Check your 'Saved' properties for price drops.",
  "Always communicate via RentEase for secure transactions.",
  "Always see the owner's fullname inside property card",
  "Always view the property details before clicking book now",
  "You will get payment refund if your booking request doesn't get accepted",
  "The property you see are all verified by admin",
  "If you have sent booking request then be up to date",
  "Once your booking request accepted then you cannot rewrite it",
  "Don't delete your property once it is accepted ",
  "If there anything you find supisioous then please free to contact from help line at any time "


];

useEffect(() => {
  const triggerCycle = () => {
    setIsVisible(true);
    
    // Suggestion stays for 15 seconds
    setTimeout(() => {
      setIsVisible(false);
      setSuggestionIndex((prev) => (prev + 1) % tenantSuggestions.length);
    }, 15000); 
  };

  // Initial trigger after a short delay on login
  const initialDelay = setTimeout(triggerCycle, 2000);

  // 1-minute interval
  const masterTimer = setInterval(triggerCycle, 60000);

  return () => {
    clearTimeout(initialDelay);
    clearInterval(masterTimer);
  };
}, []);

  const tabs = ['Browse Properties', 'My Bookings', 'Saved'];

useEffect(() => {
  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      const res = await getAllProperties();
      const visibleProperties = (res.properties || []).filter(
        (p) => p && p.status === 'approved'
      );

      
      const myRes = await getTenantBookings(); 
      let bookedProperties = [];

      if (myRes.success && myRes.bookings) {
        // 1. Get IDs for the status buttons (Requested/Accepted)
        const bookedIds = myRes.bookings
          .filter(b => b.property && b.property._id) 
          .map(b => b.property._id.toString());
        
        setSentRequests(bookedIds);

        // 2. Extract the actual property objects to ensure they show up in the UI
        bookedProperties = myRes.bookings
          .map(b => b.property)
          .filter(p => p !== null && p !== undefined); // CRITICAL: Remove nulls
      }

      // 3. Merge properties safely
      setProperties(() => {
        const combined = [...visibleProperties, ...bookedProperties];
        // Use a Map to deduplicate by _id safely
        const uniqueMap = new Map();
        combined.forEach(p => {
          if (p && p._id) {
            uniqueMap.set(p._id.toString(), p);
          }
        });
        return Array.from(uniqueMap.values());
      });

      // Initialize image indexes
      const initialIndexes = {};
      visibleProperties.forEach(p => {
        if (p?._id) initialIndexes[p._id] = 0;
      });
      setImageIndexes(initialIndexes);

    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  }

  fetchProperties();
}, []);

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

  // Gallery Navigation Functions
  const handleNextImage = (e, propertyId, imagesLength) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndexes(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] + 1) % imagesLength
    }));
  };

  const handlePrevImage = (e, propertyId, imagesLength) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndexes(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] - 1 + imagesLength) % imagesLength
    }));
  };

  
  const handlePayment = async () => {
    try {
      const advanceAmount = (selectedProperty.price * 0.1).toFixed(2);
      
      const data = await initiateBooking({ 
        amount: advanceAmount, 
        propertyId: selectedProperty._id,
        shiftSchedule: shiftSchedule,
        members: memberCount,
        status: 'pending_verification'
      });

      if (data.success) {
        alert("Booking request sent! Please contact Admin for payment verification.");
        setShowModal(false);
      } else {
        alert("Booking initiation failed. Please try again.");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Could not process booking. Please try again.");
    }
  };


const filteredProperties = properties.filter(property => {
  if (!property) return false;

  const search = searchQuery.toLowerCase();
  const matchesSearch = 
    (property.title?.toLowerCase() || '').includes(search) ||
    (property.location?.toLowerCase() || '').includes(search);

 
 if (activeTab === 'Saved') {
    return matchesSearch && 
           property._id && 
           savedIds.some(id => id === property._id.toString());
  }

  
  const isMyRequest = sentRequests.includes(property._id?.toString());
  const isAvailable = property.status === 'approved';

  return matchesSearch && (isAvailable || isMyRequest);
});


const validSavedCount = savedIds.filter(id => 
  properties.some(prop => prop._id.toString() === id.toString())
).length;

  const renderStats = () => (
    <div className="dashboard-stats-grid" style={{ marginBottom: '30px' }}>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ color: 'var(--color-accent)' }}>🏠</div>
        <div className="dashboard-stat-value">{properties.filter(p => p.status === 'approved').length}</div>
        <div className="dashboard-stat-label">Available Properties</div>
      </div>
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon" style={{ color: 'var(--color-accent)' }}>💳</div>
        <div className="dashboard-stat-value">{sentRequests.length}</div>
        <div className="dashboard-stat-label">My Bookings</div>
      </div>
       <div className="dashboard-stat-card">
      <div className="dashboard-stat-icon" style={{ color: '#ef4444' }}>❤️</div>
      <div className="dashboard-stat-value">{validSavedCount}</div>
      <div className="dashboard-stat-label">Saved Properties</div>
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
    onChange={(e) => setSearchQuery(e.target.value)} // This triggers the re-filter
    style={{ 
      width: '100%', 
      maxWidth: '400px', 
      padding: '12px 16px', 
      borderRadius: 'var(--radius-md)', 
      border: '1px solid var(--color-border)', 
      fontSize: '0.95rem' 
    }}
  />
</div>
      <div className="property-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => {

                const isBookedByMe = property.status === 'booked' && (
      property.bookedBy?._id?.toString() === user?._id?.toString() || 
      property.bookedBy?.toString() === user?._id?.toString()
    );
    
    // --- INSERT LOGIC HERE ---
    const isBookedByOthers = property.status === 'booked' && !isBookedByMe
            
            const imageList = property.images && property.images.length > 0 
                ? property.images 
                : (property.image ? [property.image] : []);

            const currentIndex = imageIndexes[property._id] || 0;
            const currentImg = imageList[currentIndex];
            
            const imageUrl = currentImg?.startsWith('http') 
              ? currentImg 
              : `http://localhost:4000/${currentImg?.replace(/\\/g, '/')}`;

            return (
              <div key={property._id} className="property-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="property-card-image" style={{ background: '#e2e8f0', height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={property.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; }}
                  />
                  <div style={{ 
    position: 'absolute', 
    top: '10px', 
    left: '10px', 
    padding: '4px 10px', 
    borderRadius: '4px', 
    fontSize: '0.7rem', 
    fontWeight: 'bold', 
    backgroundColor: isBookedByMe ? '#dcfce7' : isBookedByOthers ? '#fee2e2' : '#fef9c3', 
    color: isBookedByMe ? '#15803d' : isBookedByOthers ? '#b91c1c' : '#a16207',
    zIndex: 3 
  }}>
    {isBookedByMe ? '🎉Congratulations!' : isBookedByOthers ? '❌ Booked By others' : '⏳ Available'}
  </div>

                  {imageList.length > 1 && (
                    <>
                        <button 
                            onClick={(e) => handlePrevImage(e, property._id, imageList.length)}
                            style={{ position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', zIndex: 2 }}
                        > ‹ </button>
                        <button 
                            onClick={(e) => handleNextImage(e, property._id, imageList.length)}
                            style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', zIndex: 2 }}
                        > › </button>
                        <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
                            {currentIndex + 1} / {imageList.length}
                        </div>
                    </>
                  )}
                </div>
                
                <div className="property-card-body" style={{ flexGrow: 1, padding: '15px' }}>
                  <h3 style={{ fontSize: '1.05rem', margin: '0 0 8px 0' }}>{property.title}</h3>
                  <div className="property-card-info" style={{ marginBottom: '12px', fontSize: '0.85rem' }}>
                    📍 {property.location}
                    <span style={{marginLeft:'110px'}}>
                      <button 
    onClick={(e) => toggleSave(e, property._id)}
    style={{ 
      background: 'none', 
      border: 'none', 
      cursor: 'pointer', 
      fontSize: '1.2rem', 
      display: 'flex', 
      alignItems: 'center',
      transition: 'transform 0.2s ease',
      color: savedIds.includes(property._id) ? '#ef4444' : '#94a3b8'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    {savedIds.includes(property._id) ? '❤️' : '🤍'}
  </button>
                    </span>
                  </div>

                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#F3F4F6', 
                    borderRadius: 'var(--radius-sm)', 
                    marginBottom: '15px',
                    fontSize: '0.8rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>OWNER CONTACT</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>👤 {property.owner?.fullName || 'Owner'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="property-card-price" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-accent)' }}>
                      NPR {property.price?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      🏷️ {property.type}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)', backgroundColor: '#F9FAFB', display: 'flex', gap: '8px' }}>
                  <Link to={`/properties/${property._id}`} className="icon-btn" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    👁️ Details
                  </Link>

                  <button 
                    onClick={() => handleDelete(property._id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    🗑️ 
                  </button>

                  {/* Replace your existing button with this conditional block */}
{/* Replace the existing button conditional block with this: */}
{sentRequests.includes(property._id) ? (
  // 1. Check if the property is actually booked
  property.status === 'booked' ? (
    // 2. Check if YOU are the one who booked it
    (property.bookedBy?._id?.toString() === user?._id?.toString() || 
     property.bookedBy?.toString() === user?._id?.toString()) ? (
      <button 
        className="btn" 
        style={{ flex: 1, padding: '8px', fontSize: '0.9rem', backgroundColor: '#dcfce7', color: '#15803d', cursor: 'default', border: '1px solid #bbf7d0', fontWeight: 'bold' }} 
        disabled
      >
        ✅ Accepted
      </button>
    ) : (
      // 3. If status is booked but NOT by you
      <button 
        className="btn" 
        style={{ flex: 1, padding: '8px', fontSize: '0.9rem', backgroundColor: '#fee2e2', color: '#b91c1c', cursor: 'not-allowed', border: '1px solid #fecaca', fontWeight: 'bold' }} 
        disabled
      >
        🚫 Sorry (Booked)
      </button>
    )
  ) : property.status === 'rejected' ? (
    <button 
      className="btn" 
      style={{ flex: 1, padding: '8px', fontSize: '0.9rem', backgroundColor: '#fee2e2', color: '#b91c1c', cursor: 'default', border: '1px solid #fecaca', fontWeight: 'bold' }} 
      disabled
    >
      ❌ Rejected
    </button>
  ) : (
    <button 
      className="btn" 
      style={{ flex: 1, padding: '8px', fontSize: '0.7rem', backgroundColor: '#cbd5e1', color: '#64748b', cursor: 'not-allowed', border: '1px solid #94a3b8' }} 
      disabled
    >
      ⏳ Request Sent
    </button>
  )
) : (
  <button 
    className="btn btn-primary" 
    style={{ flex: 1 , fontSize:'0.9rem', fontWeight:'600'}} 
    onClick={() => {
      setSelectedProperty(property);
      setShowModal(true);
    }}
  >
    Book Now
  </button>
  )}
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>No properties available right now.</p>
        )}
      </div>
    </>
  );

  

 const renderMyBookings = () => {
    const myRequests = properties.filter(property => sentRequests.includes(property._id));
    return (
      <div className="property-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {myRequests.length > 0 ? (
          myRequests.map(property => {
              const isBookedByMe = property.status === 'booked' && (
      property.bookedBy?._id?.toString() === user?._id?.toString() || 
      property.bookedBy?.toString() === user?._id?.toString()
    );

    // --- INSERT LOGIC HERE ---
    const isBookedByOthers = property.status === 'booked' && !isBookedByMe;

            const imageList = property.images && property.images.length > 0 ? property.images : (property.image ? [property.image] : []);
            const currentIndex = imageIndexes[property._id] || 0;
            const currentImg = imageList[currentIndex];
            const imageUrl = currentImg?.startsWith('http') ? currentImg : `http://localhost:4000/${currentImg?.replace(/\\/g, '/')}`;

            return (
              <div key={property._id} className="property-card" style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border)' }}>
                <div className="property-card-image" style={{ height: '180px', position: 'relative' }}>
  <img src={imageUrl} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  
  {/* Replace your old status div with this: */}
  <div style={{ 
    position: 'absolute', 
    top: '10px', 
    left: '10px', 
    padding: '4px 10px', 
    borderRadius: '4px', 
    fontSize: '0.7rem', 
    fontWeight: 'bold', 
    // Logic for background color
    backgroundColor: isBookedByMe ? '#dcfce7' : isBookedByOthers ? '#fee2e2' : '#fef9c3', 
    // Logic for text color
    color: isBookedByMe ? '#15803d' : isBookedByOthers ? '#b91c1c' : '#a16207' 
  }}>
    {/* Logic for the Label Text */}
    {isBookedByMe ? 'YOUR BOOKING' : isBookedByOthers ? 'BOOKED BY OTHERS' : 'PENDING VERIFICATION'}
  </div>
</div>

                <div className="property-card-body" style={{ padding: '12px' }}>
                  <h3 style={{ fontSize: '0.95rem', margin: '0' }}>{property.title}</h3>
                  <div style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  left: '10px', 
                  padding: '4px 10px', 
                  borderRadius: '4px', 
                  fontSize: '0.7rem', 
                  fontWeight: 'bold', 
                  backgroundColor: isBookedByMe ? '#dcfce7' : isBookedByOthers ? '#fee2e2' : '#e0f2fe', 
                  color: isBookedByMe ? '#15803d' : isBookedByOthers ? '#b91c1c' : '#0369a1',
                  zIndex: 3
                }}>
                  {isBookedByMe ? '✅ Booking Accepted' : isBookedByOthers ? '❌ Booked by Others' : '⏳ Request Sent'}
                </div>

                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0' }}>📍 {property.location}</p>
                  <div style={{ marginTop: '8px', fontWeight: 'bold', color: 'var(--color-accent)' }}>NPR {property.price?.toLocaleString()}</div>
                </div>

                <div style={{ padding: '10px 13px', borderTop: '1px solid var(--color-border)', backgroundColor: '#F9FAFB', display: 'flex', gap: '5px' , }}>
                  <Link to={`/properties/${property._id}`} className="icon-btn" style={{ flex: 1, blockSize:'30px' ,gap:'7px', textAlign: 'center', textDecoration: 'none', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    👁️ Details
                  </Link>
                  <button 
                    onClick={() => handleDelete(property._id)}
                    style={{ background: 'none', border: 'none',   color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', paddingLeft:'35px' }}
                  >
                    🗑️ 
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <p>You haven't submitted any booking requests yet.</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="dashboard-container">Loading properties...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title-wrapper">
          <div className="dashboard-icon" style={{ background: '#FFFBEB', borderColor: 'var(--color-accent)', color: 'var(--color-accent)', justifyContent: 'space-between',marginBottom: '20px' }}>🏠</div>
          <div>
            <h1>Tenant Dashboard</h1>
            <p>Welcome, {user?.name || 'User'}</p>
          </div>

          <Link 
    to="/support" 
    style={{ 
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      marginLeft:'650px',
      transition: 'all 0.3s ease'
    }}
    className="help-trigger"
  >
    <div style={{ 
      width: '33px', 
      height: '33px', 
      borderRadius: '12px', 
      backgroundColor: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      fontSize: '1.2rem'
    }}>
     ℹ️
    </div>
    <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Help</span>
  </Link>
        </div>
      </div>

      

      {renderStats()}

      <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '12px',
  margin: '10px 0 20px 0',
  minHeight: '20px' // Keeps the layout from jumping
}}>
  {isVisible && (
    <>
      {/* Suggestion Text */}
      <span 
        className="suggestion-manifest"
        style={{ 
          fontSize: '0.7rem', 
          color: '#94a3b8', 
          fontWeight: '500',
          textAlign: 'right'
        }}
      >
        {tenantSuggestions[suggestionIndex]}
      </span>

      {/* The Orb - Now only renders when isVisible is true */}
      <div className="living-orb orb-active"></div>
    </>
  )}
</div>

      <div className="dashboard-tabs" style={{ marginBottom: '24px' }}>
  {tabs.map(tab => (
    <button 
      key={tab} 
      className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`} 
      onClick={() => setActiveTab(tab)}
    >
      {tab === 'Browse Properties' ? '🔍 ' : tab === 'Saved' ? '❤️ ' : '💳 '} {tab}
    </button>
  ))}
</div>

      <div className="dashboard-content">
  {activeTab === 'My Bookings' ? renderMyBookings() : renderBrowseProperties()}
</div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '8px' }}>Booking Request</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Stay Duration</label>
                <select value={bookingDetails.months} onChange={(e) => setBookingDetails({...bookingDetails, months: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  {[1,2,3,4,5,6,12].map(m => <option key={m} value={m}>{m} Month(s)</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>No. of People</label>
                <input type="number" min="1" value={bookingDetails.members} onChange={(e) => setBookingDetails({...bookingDetails, members: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>When do you plan to move in?</label>
              <select value={bookingDetails.shiftSchedule} onChange={(e) => setBookingDetails({...bookingDetails, shiftSchedule: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                <option value="immediate">Immediately (Today/Tomorrow)</option>
                <option value="this-week">Within this week</option>
                <option value="next-week">Coming Week</option>
                <option value="next-month">Next Month</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Profession</label>
              <input type="text" value={bookingDetails.profession} placeholder="eg: student" onChange={(e) => setBookingDetails({...bookingDetails, profession: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Purpose of Stay</label>
              <select value={bookingDetails.purpose} onChange={(e) => setBookingDetails({...bookingDetails, purpose: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                <option value="Studying">📚 Studying</option>
                <option value="Doing Job">💼 Doing Job</option>
                <option value="Business">🏪 Business</option>
                <option value="Other">🔍 Other</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Hometown</label>
              <input type="text" value={bookingDetails.hometown} placeholder="eg: Ghorahi, Dang" onChange={(e) => setBookingDetails({...bookingDetails, hometown: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Payment Plan</label>
              <select value={bookingDetails.paymentType} onChange={(e) => setBookingDetails({...bookingDetails, paymentType: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                <option value="advance">20% Advance (1% System Fee)</option>
                <option value="full">Full Payment (5% System Fee)</option>
              </select>
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #bae6fd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#0369a1' }}>
                    <span>Amount to Pay Now:</span>
                    <span>NPR {payableNow.toLocaleString()}</span>
                </div>
            </div>
            {!showQR && (
        <button 
            onClick={() => setShowQR(true)}
            style={{ width: '100%', padding: '10px', backgroundColor: '#0369a1', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
        >
            💳 Pay Here
        </button>
    )}

    {/* Step 2: QR Code & Screenshot Upload (Visible after clicking Pay Here) */}
    {showQR && (
        <div style={{ textAlign: 'center', marginTop: '10px', borderTop: '1px dashed #bae6fd', paddingTop: '10px' }}>
            <p style={{ fontSize: '0.75rem', color: '#0369a1', marginBottom: '10px' }}>
                Scan to pay to <b>RentEase Admin</b>
            </p>
            
            {/* Replace with your actual Admin QR image path */}
            <img 
                src="/adminQR.jpeg" 
                alt="Payment QR" 
                style={{  width: '220px', 
        height: '350px', 
        
        // 2. Make it stand out
        borderRadius: '12px', 
        border: '4px solid white', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)', 
        backgroundColor: 'white',
        
        // 3. Setup for the "Touch" effect
        cursor: 'zoom-in',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', // Smooth "pop" effect
        display: 'block',
        margin: '15px auto',
        position: 'relative',
        zIndex: 10
    }} 
    // 4. The Interaction: Grow on touch/click
    onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(1.6)';
        e.currentTarget.style.zIndex = '50';
    }}
    onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.zIndex = '10';
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.zIndex = '10';
    }}
    // Mobile Touch support
    onTouchStart={(e) => {
        e.currentTarget.style.transform = 'scale(1.6)';
        e.currentTarget.style.zIndex = '50';
    }}
    onTouchEnd={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.zIndex = '10';
    }} 
            />

            <div style={{ marginTop: '15px', textAlign: 'left' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                    Upload Payment Screenshot (SS)
                </label>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setBookingDetails({...bookingDetails, paymentScreenshot: e.target.files[0]})}
                    style={{ width: '100%', fontSize: '0.8rem' }} 
                />
            </div>
        </div>
    )}

            <button 
    onClick={handleBookingSubmit} 
    disabled={showQR && !bookingDetails.paymentScreenshot} // Disable if QR is shown but no SS uploaded
    style={{ 
        width: '100%', 
        padding: '14px', 
        backgroundColor: (showQR && !bookingDetails.paymentScreenshot) ? '#cbd5e1' : 'var(--color-accent)', 
        color: 'white', 
        border: 'none', 
        borderRadius: '8px', 
        fontWeight: '700', 
        cursor: (showQR && !bookingDetails.paymentScreenshot) ? 'not-allowed' : 'pointer' 
    }}
>
    Confirm Booking Request
</button>

<button onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
    Cancel
</button>
          </div>
        </div>
      )}
    </div>
  );
}