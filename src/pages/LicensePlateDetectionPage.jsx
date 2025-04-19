import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaUpload, FaSpinner } from 'react-icons/fa';
import { licensePlateService } from '../services/api';
import '../styles/licensePlateDetection.css';

const LicensePlateDetectionPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const webcamRef = useRef(null);

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

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelectedImage(imageSrc);
    setPreviewUrl(imageSrc);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convertir l'image en fichier pour l'envoyer à l'API
      let imageFile;
      
      if (selectedImage.startsWith('data:')) {
        // Si c'est une capture webcam (base64)
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        imageFile = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
      } else {
        // Si c'est un fichier uploadé
        imageFile = selectedImage;
      }
      
      // Appel à l'API de détection
      const response = await licensePlateService.recognize(imageFile);
      
      if (response.data && response.data.plateNumber) {
        // Rediriger vers la page de réservation avec la plaque détectée
        navigate('/booking', { 
          state: { 
            plateNumber: response.data.plateNumber,
            imageUrl: previewUrl
          } 
        });
      } else {
        setError('Aucune plaque d\'immatriculation détectée. Veuillez réessayer.');
      }
    } catch (err) {
      console.error('Erreur lors de la détection:', err);
      setError('Erreur lors de la détection de la plaque. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Détection de Plaque d'Immatriculation
          </h1>
          <p className="text-lg text-blue-700">
            Prenez en photo ou téléchargez une image de votre plaque d'immatriculation
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Zone de preview */}
          <div className="mb-8">
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full
                           hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors
                          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-gray-500">
                  <FaUpload className="mx-auto h-12 w-12 mb-4 text-blue-500" />
                  <p className="text-lg mb-2">Déposez votre image ici ou</p>
                  <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
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
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Conseils pour une meilleure détection :
            </h3>
            <ul className="text-blue-800 space-y-1">
              <li>• Assurez-vous que la plaque est bien éclairée</li>
              <li>• Évitez les reflets et les ombres</li>
              <li>• Prenez la photo de face</li>
              <li>• La plaque doit être propre et lisible</li>
            </ul>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => document.querySelector('input[type="file"]').click()}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6
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
                flex-1 py-3 px-6 rounded-xl font-medium
                flex items-center justify-center gap-2
                ${!selectedImage || loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
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
