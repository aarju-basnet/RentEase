

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { mockProperties } from '../services/api';

const Home = () => {
  const navigate = useNavigate();

  // Search filter state
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    type: '',
  });

  // Animated counter state
  const [counters, setCounters] = useState({ properties: 0, users: 0, rate: 0 });
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);

  // Animate counters when stats section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCounter('properties', 25, 1500);
          animateCounter('users', 10, 1200);
          animateCounter('rate', 98, 1800);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Counter animation helper
  const animateCounter = (key, target, duration) => {
    const start = 0;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);

      setCounters((prev) => ({ ...prev, [key]: current }));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.type) params.set('type', filters.type);
    navigate(`/properties?${params.toString()}`);
  };

  // Show first 3 properties as featured
  const featuredProperties = mockProperties.slice(0, 3);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>
            Find Your Perfect Rental
            <br />
            <span>in Nepal</span>
          </h1>
          <p>
            Browse verified rooms and apartments all over Nepal. Find your ideal rental anywhere in the country with confidence.
          </p>
          <Link to="/properties" className="btn btn-accent btn-lg hero-cta">
            Explore Properties →
          </Link>
        </div>

        {/* Search bar overlapping bottom of hero */}
        <div className="hero-search-wrapper">
          <SearchBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
        </div>
      </section>

      {/* ===== QUICK STATS BAR ===== */}
      <section className="quick-stats" ref={statsRef}>
        <div className="container">
          <div className="quick-stats-grid">
            <div className="quick-stat">
              <span className="quick-stat-value">{counters.properties}</span>
              <span className="quick-stat-label">Properties</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-value">{counters.users}</span>
              <span className="quick-stat-label">Happy Users</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-value">{counters.rate}%</span>
              <span className="quick-stat-label">Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS CARDS ===== */}
      <section className="stats-cards-section">
        <div className="container">
          <div className="stats-cards-grid">
            <div className="stats-card card-3d">
              <div className="stats-card-icon">🏢</div>
              <div className="stats-card-value">2,500+</div>
              <div className="stats-card-label">Verified Properties</div>
            </div>
            <div className="stats-card card-3d">
              <div className="stats-card-icon">👥</div>
              <div className="stats-card-value">10,000+</div>
              <div className="stats-card-label">Active Users</div>
            </div>
            <div className="stats-card card-3d">
              <div className="stats-card-icon">🤝</div>
              <div className="stats-card-value">5,000+</div>
              <div className="stats-card-label">Successful Matches</div>
            </div>
            <div className="stats-card card-3d">
              <div className="stats-card-icon">⭐</div>
              <div className="stats-card-value">4.9/5</div>
              <div className="stats-card-label">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW RENTEASE WORKS ===== */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How RentEase Works</h2>
            <p>Simple steps to find your perfect rental match</p>
          </div>
          <div className="steps-grid">
            {/* Step 01 */}
            <div className="step-card card-3d">
              <div className="step-number">01</div>
              <div className="step-icon-circle">👤</div>
              <h3>Create Your Profile</h3>
              <p>
                Sign up and create a detailed profile with your preferences,
                budget, and requirements.
              </p>
            </div>
            {/* Step 02 */}
            <div className="step-card card-3d">
              <div className="step-number">02</div>
              <div className="step-icon-circle">🔍</div>
              <h3>Smart Search & Match</h3>
              <p>
                Our AI algorithm finds the perfect properties or tenants based
                on your criteria.
              </p>
            </div>
            {/* Step 03 */}
            <div className="step-card card-3d">
              <div className="step-number">03</div>
              <div className="step-icon-circle">💬</div>
              <h3>Connect & Communicate</h3>
              <p>
                Chat directly with property owners or potential tenants through
                our secure platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-header">
            <h2>What Our Users Say</h2>
            <p>Join thousands of satisfied renters and property owners</p>
          </div>
          <div className="testimonials-grid">
            {/* Testimonial 1 */}
            <div className="testimonial-card">
              <div className="testimonial-stars">
                ★★★★★
              </div>
              <p className="testimonial-text">
                “Finding an apartment with RentEase was a breeze! The verification process made me feel secure, and I was able to move into my ideal place in just a week.”
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div className="author-info">
                  <h4>Nimesha Sapkota</h4>
                  <p>Dentist, Ghorahi</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card">
              <div className="testimonial-stars">
                ★★★★★
              </div>
              <p className="testimonial-text">
                “As a landlord, I was able to quickly find dependable tenants through RentEase. I loved how I could communicate directly with them, and the verification process made everything feel safe and reliable.”
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div className="author-info">
                  <h4>Dinesh Gurung</h4>
                  <p>Property Owner, Kathmandu</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card">
              <div className="testimonial-stars">
                ★★★★★
              </div>
              <p className="testimonial-text">
                “Living in Kathmandu as a student can be hectic, but this app made finding a room stress-free. I can check listings whenever I have free time, and I never miss out on new options.”
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div className="author-info">
                  <h4>Miresh Dhungana</h4>
                  <p>Student, Kathmandu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROPERTIES ===== */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Properties</h2>
            <p>Hand-picked listings you'll love</p>
          </div>
          <div className="property-grid">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="text-center mt-3">
            <Link to="/properties" className="btn btn-outline">
              View All Properties →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section className="section contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Left Side: Info */}
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>
                Have questions or feedback?
                Feel free to contact us and we’ll get back to you as soon as possible.
              </p>

              <div className="contact-method">
                <div className="contact-icon">✉️</div>
                <div className="contact-text">
                  <h4>Email</h4>
                  <p>grishma_support@rentease.com.np</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">📞</div>
                <div className="contact-text">
                  <h4>Contact</h4>
                  <p>9856789001</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">📍</div>
                <div className="contact-text">
                  <h4>Location</h4>
                  <p>Ghorahi-15,Dang ,Nepal</p>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="contact-form-card">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input type="text" id="fullName" placeholder="" />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="emailAddress">Email Address</label>
                    <input type="email" id="emailAddress" placeholder="" />
                  </div>
                </div>

                {/* <div className="contact-form-group">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject">
                    <option value="">Select a subject</option>
                    <option value="support">General Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div> */}

                <div className="contact-form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" placeholder="Tell us how we can help you..."></textarea>
                </div>

                <button type="submit" className="btn-teal">
                  <span style={{ marginRight: '8px' }}>🚀</span> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section
        className="cta-section"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "60px 20px"
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          <h2>Own a Property in Nepal?</h2>

          <p>
            List your room or apartment on RentEase and connect with thousands
            of verified tenants across the country.
          </p>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              flexWrap: "wrap"
            }}
          >
            <Link to="/add-property" className="btn btn-accent btn-lg">
              Start Listing →
            </Link>

            <Link to="/register" className="btn btn-secondary btn-lg">
              Create Account
            </Link>
          </div>
        </div>
      </section>
      {/* <section className="cta-section">
        <div className="cta-content">
          <h2>Own a Property in Nepal?</h2>
          <p>
            List your room or apartment on RentEase and connect with thousands
            of verified tenants across the country.
          </p>
          <div className="cta-buttons">
            <Link to="/add-property" className="btn btn-accent btn-lg">
              Start Listing →
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Create Account
            </Link>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default Home;
