import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SupportPage() {
  const { user } = useAuth();
  
  // Determine where the "X" should take the user
  const dashboardPath = user?.role === 'owner' ? '/owner/dashboard' : '/tenant/dashboard';

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f1f5f9', // Light grey background to make the card pop
      padding: '20px',
      position: 'relative'
    }}>
      
      {/* The Support Card */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '28px', 
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)', 
        border: '1px solid #e2e8f0',
        width: '100%',
        maxWidth: '500px',
        position: 'relative' // Needed to anchor the X button
      }}>

        {/* THE "X" BUTTON: Absolute positioned at the top right */}
        <Link 
          to={dashboardPath}
          style={{ 
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            color: '#64748b',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            border: '1px solid #e2e8f0',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          ✕
        </Link>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#1e293b', margin: '0 0 8px 0' }}>Support Center</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Submit a ticket and our team will get back to you.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); alert("Ticket Sent!"); }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', color: '#475569' }}>Subject</label>
            <input 
              type="text" 
              placeholder="What do you need help with?" 
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} 
              required 
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', color: '#475569' }}>Message</label>
            <textarea 
              rows="5" 
              placeholder="Describe the issue in detail..." 
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', resize: 'none', boxSizing: 'border-box' }} 
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              padding: '16px', 
              borderRadius: '12px', 
              fontWeight: '700', 
              backgroundColor: 'var(--color-accent, #2563eb)', 
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}