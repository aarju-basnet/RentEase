/**
 * Footer Component
 *
 * Simple, clean dark navy footer matching the screenshot.
 * Shows RentEase logo and copyright only.
 */

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <span className="footer-logo-text">🏠 <strong>RentEase</strong></span>
        <p>&copy; {new Date().getFullYear()} RentEase. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
