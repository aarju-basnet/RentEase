import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getBookingById, updateBookingStatus } from '../services/api';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // null, 'confirmed', or 'rejected'

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await getBookingById(id);
      if (res.success) {
        setBooking(res.booking);
        
        // PERSISTENCE CHECK: Update UI if booking is already processed in DB
        if (res.booking.paymentStatus === 'completed') {
          setBookingStatus('confirmed');
        } else if (res.booking.paymentStatus === 'failed') {
          setBookingStatus('rejected');
        }
      }
    };
    fetchDetails();
  }, [id]);

  const handleAction = async (status) => {
    const confirmMsg = status === 'completed' 
      ? "Are you sure you want to ACCEPT this booking? This will mark the property as Booked." 
      : "Are you sure you want to REJECT this request?";
    
    if (window.confirm(confirmMsg)) {
      const res = await updateBookingStatus(id, status);
      if (res.success) {
        // Set the status to trigger the animation
        setBookingStatus(status === 'completed' ? 'confirmed' : 'rejected');
        
        // Wait 3 seconds for the animation to play out, then navigate
        setTimeout(() => {
          navigate('/owner/dashboard');
        }, 3000);
      }
    }
  };

  if (!booking) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#666' }}>
      🔄 Loading request details...
    </div>
  );

  return (
    <div style={{ 
      padding: '60px 20px', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', sans-serif" 
    }}>
      {/* INTERNAL CSS FOR ANIMATIONS */}
      <style>
        {`
          @keyframes circlePop {
            0% { transform: scale(0); opacity: 0; }
            70% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes iconDraw {
            to { stroke-dashoffset: 0; }
          }
          .status-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: circlePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
          .icon-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
          }
          .success-bg { background: #16a34a; box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3); }
          .reject-bg { background: #ef4444; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3); }
          .draw-path {
            stroke-dasharray: 50;
            stroke-dashoffset: 50;
            animation: iconDraw 0.5s 0.2s ease-out forwards;
          }
        `}
      </style>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.8rem' }}>Request Overview</h2>
            <p style={{ color: '#64748b', marginTop: '5px' }}>Review tenant details and property availability</p>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Main Card */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ 
            background: '#fff', 
            borderRadius: '16px', 
            overflow: 'hidden',
            boxShadow: isHovered 
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
            border: '1px solid #e2e8f0'
          }}
        >
          {/* Property Header Banner */}
          <div style={{ backgroundColor: '#f1f5f9', padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Property Details
            </span>
            <h3 style={{ margin: '8px 0 0 0', fontSize: '1.4rem', color: '#0f172a' }}>{booking.property?.title}</h3>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
              📍 {booking.property?.location}
            </p>
          </div>

          <div style={{ padding: '32px' }}>
            {/* Main Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
              
              {/* Left Column: Tenant Profile */}
              <div style={{ borderRight: '1px solid #f1f5f9', paddingRight: '20px' }}>
                <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
                  Tenant Background
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ gridColumn: '1 / span 2' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Full Name</span>
                    <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>{booking.tenant?.fullName}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Hometown</span>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>📍 {booking.hometown}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Profession</span>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>💼 {booking.profession}</span>
                  </div>
                  <div style={{ gridColumn: '1 / span 2' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Purpose of Stay</span>
                    <span style={{ 
                      display: 'inline-block', 
                      marginTop: '4px',
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      backgroundColor: '#e0f2fe', 
                      color: '#0369a1', 
                      fontSize: '0.85rem', 
                      fontWeight: 600 
                    }}>
                      🎯 {booking.purpose}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Stay Logistics */}
              <div>
                <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
                  Stay Logistics
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>Duration</span>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{booking.stayDuration || booking.months} Months</span>
                    </div>
                    <div style={{ flex: 1, background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>Members</span>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{booking.members} People</span>
                    </div>
                  </div>
                  
                  <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#92400e', fontWeight: 600 }}>Shift Schedule</span>
                    <span style={{ fontWeight: 700, color: '#92400e', fontSize: '0.95rem' }}>📅 {booking.shiftSchedule}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary Bar */}
            <div style={{ 
              marginTop: '32px', 
              padding: '20px', 
              backgroundColor: '#f0fdf4', 
              borderRadius: '12px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              border: '1px solid #dcfce7'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>FINANCIAL SUMMARY</span>
                <span style={{ color: '#15803d', fontSize: '0.85rem' }}>Verified Advance Deposit</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a' }}>
                  NPR {booking.advanceAmount?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* ACTION AREA */}
            <div style={{ marginTop: '32px' }}>
              {bookingStatus === null ? (
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button 
                    onClick={() => handleAction('completed')} 
                    style={{ 
                      flex: 2,
                      background: '#16a34a', 
                      color: 'white', 
                      padding: '16px', 
                      border: 'none', 
                      borderRadius: '10px', 
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '1rem',
                      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    ✅ Accept & Confirm Booking
                  </button>
                  
                  <button 
                    onClick={() => handleAction('failed')} 
                    style={{ 
                      flex: 1,
                      background: '#fff', 
                      color: '#ef4444', 
                      padding: '16px', 
                      border: '2px solid #ef4444', 
                      borderRadius: '10px', 
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '1rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#ef4444';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                  >
                    ❌ Reject
                  </button>
                </div>
              ) : bookingStatus === 'confirmed' ? (
                <div className="status-container">
                  <div className="icon-circle success-bg">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <path className="draw-path" d="M20 6L9 17L4 12" />
                    </svg>
                  </div>
                  <h3 style={{ color: '#16a34a', margin: 0, fontSize: '1.4rem' }}>Booking Confirmed!</h3>
                  <p style={{ color: '#64748b', marginTop: '5px' }}>Processing payment details...</p>
                </div>
              ) : (
                <div className="status-container">
                  <div className="icon-circle reject-bg">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <path className="draw-path" d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 style={{ color: '#ef4444', margin: 0, fontSize: '1.4rem' }}>Request Rejected</h3>
                  <p style={{ color: '#64748b', marginTop: '5px' }}>This request has been declined.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;