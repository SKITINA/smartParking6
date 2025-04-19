import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simuler le traitement du paiement
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/confirmation');
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
    }
  };

  return (
    <div className="fade-in">
      <div className="payment-container">
        <h1 className="text-3xl font-bold text-center mb-8">
          Paiement sécurisé
        </h1>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Récapitulatif de la réservation</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Parking:</strong> Parking Central</p>
            <p><strong>Date:</strong> 12/04/2024</p>
            <p><strong>Heure:</strong> 14:00</p>
            <p><strong>Durée:</strong> 2 heures</p>
            <p><strong>Total à payer:</strong> 5.00€</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Méthode de paiement</h3>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                Carte bancaire
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                PayPal
              </label>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Numéro de carte</label>
                <input
                  type="text"
                  name="number"
                  value={cardDetails.number}
                  onChange={handleCardInputChange}
                  className="form-input"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nom sur la carte</label>
                <input
                  type="text"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleCardInputChange}
                  className="form-input"
                  placeholder="JEAN DUPONT"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Date d'expiration</label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleCardInputChange}
                    className="form-input"
                    placeholder="MM/AA"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    className="form-input"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="text-center py-4">
              <p className="mb-4">Vous serez redirigé vers PayPal pour finaliser votre paiement.</p>
              <button type="button" className="btn btn-secondary">
                Se connecter avec PayPal
              </button>
            </div>
          )}

          <div className="mt-8">
            <button type="submit" className="btn btn-primary w-full">
              Payer 5.00€
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Vos données de paiement sont sécurisées et cryptées.</p>
          <p>Nous n'avons jamais accès à vos informations bancaires.</p>
        </div>
      </div>
    </div>
  );
}

export default Payment; 