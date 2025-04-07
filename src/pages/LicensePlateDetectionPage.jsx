import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaUpload, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import '../styles/licensePlateDetection.css';

const LicensePlateDetectionPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
      } else {
        setError('Veuillez sélectionner une image valide');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
      } else {
        setError('Veuillez sélectionner une image valide');
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('upload', selectedImage);

    try {
      const response = await axios.post('http://localhost:8080/api/plates/recognize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.results && response.data.results.length > 0) {
        const detectedPlate = response.data.results[0].plate;
        navigate('/detection-result', { 
          state: { 
            plate: detectedPlate,
            imageUrl: previewUrl,
            vehicleType: response.data.results[0].vehicle?.type || 'Non détecté'
          } 
        });
      } else {
        setError('Aucune plaque d\'immatriculation détectée');
      }
    } catch (err) {
      console.error('Erreur de détection:', err);
      setError(
        err.response?.data?.message || 
        'Une erreur est survenue lors de la détection. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 license-plate-detection">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Détection de Plaque d'Immatriculation
          </h1>
          <p className="text-gray-600">
            Prenez en photo ou téléchargez une image de votre plaque d'immatriculation
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Zone de preview */}
          <div className="mb-8">
            {previewUrl ? (
              <div className="preview-container">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover preview-image"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl(null);
                  }}
                  className="remove-button absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full
                           hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                className={`dropzone p-12 text-center ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-gray-500">
                  <FaUpload className="mx-auto h-12 w-12 mb-4" />
                  <p className="text-lg mb-2">Déposez votre image ici ou</p>
                  <label className="cursor-pointer text-blue-600 hover:text-blue-700">
                    parcourez vos fichiers
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="instructions p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Conseils pour une meilleure détection :
            </h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li className="instruction-item">• Assurez-vous que la plaque est bien éclairée</li>
              <li className="instruction-item">• Évitez les reflets et les ombres</li>
              <li className="instruction-item">• Prenez la photo de face</li>
              <li className="instruction-item">• La plaque doit être propre et lisible</li>
            </ul>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="error-message p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 action-buttons">
            <button
              type="button"
              onClick={() => document.querySelector('input[type="file"]').click()}
              className="action-button flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6
                       rounded-xl font-medium hover:bg-gray-50 transition-colors
                       flex items-center justify-center gap-2"
            >
              <FaUpload />
              Choisir une image
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedImage || loading}
              className={`
                action-button flex-1 py-3 px-6 rounded-xl font-medium
                flex items-center justify-center gap-2
                ${!selectedImage || loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Détection en cours...
                </>
              ) : (
                <>
                  <FaCamera />
                  Détecter la plaque
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicensePlateDetectionPage;
