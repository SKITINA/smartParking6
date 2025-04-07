import React, { useState } from 'react';

const PaymentForm = ({ reservation, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const endpoint = paymentMethod === 'credit-card' 
        ? '/api/payments/credit-card'
        : '/api/payments/bank-transfer';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservationId: reservation.id,
          amount: reservation.totalAmount,
          // Add other payment-specific data based on the method
          ...(paymentMethod === 'credit-card' && {
            cardNumber: e.target.cardNumber.value,
            expiryDate: e.target.expiryDate.value,
            cvv: e.target.cvv.value,
            cardholderName: e.target.cardholderName.value,
          }),
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data = await response.json();
      onPaymentComplete(data);
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2">Reservation Summary</h3>
        <p>Parking: {reservation.parkingName}</p>
        <p>Duration: {reservation.duration} hours</p>
        <p className="text-xl font-bold text-blue-600">
          Total Amount: ${reservation.totalAmount}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('credit-card')}
            className={`px-4 py-2 rounded-md ${
              paymentMethod === 'credit-card'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Credit Card
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('bank-transfer')}
            className={`px-4 py-2 rounded-md ${
              paymentMethod === 'bank-transfer'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Bank Transfer
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {paymentMethod === 'credit-card' ? (
          <>
            <div>
              <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
                Cardholder Name
              </label>
              <input
                type="text"
                id="cardholderName"
                name="cardholderName"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                required
                pattern="[0-9]{16}"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  required
                  pattern="[0-9]{2}/[0-9]{2}"
                  placeholder="MM/YY"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  required
                  pattern="[0-9]{3,4}"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Please transfer the amount to the following bank account:
            </p>
            <div className="mt-2">
              <p>Bank: Smart Parking Bank</p>
              <p>Account Number: 1234-5678-9012-3456</p>
              <p>IBAN: SP12 3456 7890 1234 5678 9012 34</p>
              <p className="font-semibold mt-2">
                Please use your reservation ID ({reservation.id}) as the payment reference.
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm; 