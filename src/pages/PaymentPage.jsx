import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCar, FaTruck, FaMotorcycle, FaGoogle, FaPaypal, FaCreditCard } from 'react-icons/fa';

const PaymentMethodOption = ({ icon: Icon, label, selected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`
        flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
        ${selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 hover:border-blue-200'
        }
      `}
    >
      <div className={`mr-3 ${selected ? 'text-blue-600' : 'text-gray-400'}`}>
        <Icon size={24} />
      </div>
      <span className={`flex-grow ${selected ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
        {label}
      </span>
      <div className={`
        w-6 h-6 rounded-full border-2 flex items-center justify-center
        ${selected
          ? 'border-blue-600 bg-blue-600'
          : 'border-gray-300'
        }
      `}>
        {selected && (
          <div className="w-2 h-2 bg-white rounded-full"></div>
        )}
      </div>
    </div>
  );
};

const VehicleTypeOption = ({ icon: Icon, label, value, selected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(value)}
      className={`
        p-4 rounded-xl border-2 cursor-pointer transition-all text-center
        ${selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 hover:border-blue-200'
        }
      `}
    >
      <div className={`mb-2 ${selected ? 'text-blue-600' : 'text-gray-400'}`}>
        <Icon size={32} />
      </div>
      <span className={selected ? 'text-blue-600 font-medium' : 'text-gray-700'}>
        {label}
      </span>
    </div>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [vehicleType, setVehicleType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // Simuler un appel API de paiement
    setTimeout(() => {
      setLoading(false);
      navigate('/confirmation');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Finaliser la réservation
          </h1>
        </div>

        {/* Vehicle Type Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Type de véhicule
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <VehicleTypeOption
              icon={FaCar}
              label="Voiture"
              value="car"
              selected={vehicleType === 'car'}
              onSelect={setVehicleType}
            />
            <VehicleTypeOption
              icon={FaMotorcycle}
              label="Moto"
              value="motorcycle"
              selected={vehicleType === 'motorcycle'}
              onSelect={setVehicleType}
            />
            <VehicleTypeOption
              icon={FaTruck}
              label="Utilitaire"
              value="truck"
              selected={vehicleType === 'truck'}
              onSelect={setVehicleType}
            />
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Moyen de paiement
          </h2>
          <div className="space-y-4">
            <PaymentMethodOption
              icon={FaGoogle}
              label="Google Pay"
              selected={paymentMethod === 'google-pay'}
              onSelect={() => setPaymentMethod('google-pay')}
            />
            <PaymentMethodOption
              icon={FaPaypal}
              label="PayPal"
              selected={paymentMethod === 'paypal'}
              onSelect={() => setPaymentMethod('paypal')}
            />
            <PaymentMethodOption
              icon={FaCreditCard}
              label="Carte bancaire"
              selected={paymentMethod === 'credit-card'}
              onSelect={() => setPaymentMethod('credit-card')}
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePayment}
          disabled={!vehicleType || !paymentMethod || loading}
          className={`
            w-full py-4 rounded-xl font-medium transition-all duration-200
            ${(!vehicleType || !paymentMethod || loading)
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {loading ? 'Traitement en cours...' : 'Payer et réserver'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage; 