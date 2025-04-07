import '../styles/HowItWorksPage.css';

function HowItWorksPage() {
  const steps = [
    {
      id: 1,
      icon: "✓",
      title: "Register and Set Up",
      description: "Create your account and set up your profile in just a few minutes."
    },
    {
      id: 2,
      icon: "🎯",
      title: "Find and Reserve a Parking Spot",
      description: "Use our map to find and select the best parking spot near your destination."
    },
    {
      id: 3,
      icon: "🚗",
      title: "Navigate and Park",
      description: "Get real-time directions to navigate directly to your reserved spot."
    },
    {
      id: 4,
      icon: "💳",
      title: "Payment and Extensions",
      description: "Use our secure payment system to pay for your parking spot."
    }
  ];

  return (
    <div className="how-it-works-page">
      <div className="hero-section">
        <h1>How It Works</h1>
        <p>Simple steps to start parking smarter</p>
      </div>

      <div className="steps-container">
        <div className="steps-timeline">
          {steps.map((step) => (
            <div key={step.id} className="step-item">
              <div className="step-icon">{step.icon}</div>
              <div className="step-content">
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
          <div className="timeline-line"></div>
        </div>
      </div>

      <div className="details-section">
        {steps.map((step) => (
          <div key={step.id} className="detail-card">
            <div className="detail-header">
              <div className="step-number">{step.id}</div>
              <h3>{step.title}</h3>
            </div>
            <div className="detail-content">
              {step.id === 1 && (
                <div className="detail-info">
                  <p>• Create an account with your email</p>
                  <p>• Add your vehicle information</p>
                  <p>• Set up your payment method</p>
                </div>
              )}
              {step.id === 2 && (
                <div className="detail-info">
                  <p>• Search for parking spots by location</p>
                  <p>• Compare prices and availability</p>
                  <p>• Reserve your spot in advance</p>
                </div>
              )}
              {step.id === 3 && (
                <div className="detail-info">
                  <p>• Get turn-by-turn directions</p>
                  <p>• Access your spot with a unique code</p>
                  <p>• Park safely and securely</p>
                </div>
              )}
              {step.id === 4 && (
                <div className="detail-info">
                  <p>• Pay securely through the app</p>
                  <p>• Extend your parking time if needed</p>
                  <p>• Get digital receipts automatically</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorksPage; 