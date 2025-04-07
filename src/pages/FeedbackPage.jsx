import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedbackService } from '../services/api';

function FeedbackPage() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await feedbackService.submit({ rating, comment });
      setSuccess(true);
      setRating(0);
      setComment('');
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-page">
      <h1>Your Feedback</h1>
      <p>Help us improve our service by sharing your experience</p>

      {success && (
        <div className="success-message">
          Thank you for your feedback!
        </div>
      )}

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="rating-section">
          <h2>Rate your experience</h2>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${star <= rating ? 'active' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Additional Comments</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience..."
            rows="4"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}

export default FeedbackPage; 