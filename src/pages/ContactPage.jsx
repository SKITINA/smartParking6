import { useState } from 'react';
import { contactService } from '../services/api';
import '../styles/ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const contactData = {
        fullName: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: "PENDING"
      };

      const response = await contactService.submit(contactData);
      console.log('Contact submitted:', response);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
      console.error('Contact error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>We're here to help and answer any question you might have</p>
      </section>

      <div className="contact-content">
        <section className="contact-form-section">
          <h2>Send us a Message</h2>
          {success && (
            <div className="success-message">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </section>

        <section className="contact-info-section">
          <h2>Other Ways to Reach Us</h2>
          <div className="contact-info">
            <div className="info-item">
              <h3>Visit Us</h3>
              <p>123 Parking Street</p>
              <p>City, State 12345</p>
            </div>
            <div className="info-item">
              <h3>Call Us</h3>
              <p>+123 456 7890</p>
              <p>Mon-Fri: 9am-6pm</p>
            </div>
            <div className="info-item">
              <h3>Email Us</h3>
              <p>support@smartparking.com</p>
              <p>Response within 24h</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContactPage; 