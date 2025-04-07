import '../styles/AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page">
      <section className="hero-section">
        <h1>We're Smart Parking, Your Smart Parking Solution</h1>
        <p className="subtitle">
          Trusted for nearly two decades, we make parking quicker, cheaper, and smarter.
        </p>
      </section>

      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Smart Technology</h3>
            <p>Using AI and IoT to make parking effortless and efficient.</p>
          </div>
          <div className="feature-card">
            <h3>Wide Coverage</h3>
            <p>Thousands of parking spots available across multiple cities.</p>
          </div>
          <div className="feature-card">
            <h3>Best Prices</h3>
            <p>Competitive rates and exclusive discounts for regular users.</p>
          </div>
          <div className="feature-card">
            <h3>24/7 Support</h3>
            <p>Round-the-clock customer service to assist you anytime.</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-item">
          <h3>2M+</h3>
          <p>Active Users</p>
        </div>
        <div className="stat-item">
          <h3>50+</h3>
          <p>Cities</p>
        </div>
        <div className="stat-item">
          <h3>10K+</h3>
          <p>Parking Spots</p>
        </div>
        <div className="stat-item">
          <h3>98%</h3>
          <p>Satisfaction Rate</p>
        </div>
      </section>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          To revolutionize urban parking by providing smart, sustainable, and user-friendly
          parking solutions that make city life easier for everyone.
        </p>
      </section>
    </div>
  );
}

export default AboutPage; 