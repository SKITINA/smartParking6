import { useState } from 'react';
import '../styles/HelpPage.css';

function HelpPage() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I reserve a parking spot?",
      answer: "To reserve a parking spot, simply enter your desired location in the search bar, choose your preferred duration (hourly/daily, monthly, or yearly), and click 'Find Parking'. Select from available spots and follow the booking process."
    },
    {
      id: 2,
      question: "What are the payment options?",
      answer: "We accept various payment methods including credit/debit cards, PayPal, and mobile payment solutions. All payments are processed securely through our encrypted payment system."
    },
    {
      id: 3,
      question: "What should I do if I encounter an issue with a parking spot?",
      answer: "If you experience any issues, please contact our 24/7 support team immediately through the app or call our helpline. We'll assist you in finding a solution or provide an alternative spot if necessary."
    }
  ];

  return (
    <div className="help-page">
      <h1>Help & Support</h1>
      
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <div key={faq.id} className="faq-item">
              <button
                className={`faq-question ${activeQuestion === faq.id ? 'active' : ''}`}
                onClick={() => setActiveQuestion(activeQuestion === faq.id ? null : faq.id)}
              >
                {faq.question}
                <span className="arrow">{activeQuestion === faq.id ? '−' : '+'}</span>
              </button>
              {activeQuestion === faq.id && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <h2>Need More Help?</h2>
        <div className="contact-options">
          <div className="contact-option">
            <h3>Call Us</h3>
            <p>+123 456 7890</p>
            <p className="subtitle">Available 24/7</p>
          </div>
          <div className="contact-option">
            <h3>Email Us</h3>
            <p>support@smartparking.com</p>
            <p className="subtitle">We'll respond within 24 hours</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HelpPage; 