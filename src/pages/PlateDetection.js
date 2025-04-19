import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { licensePlateService } from '../services/api';

function PlateDetection() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedPlate, setDetectedPlate] = useState(null);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setDetectedPlate(null);
      setError(null);
    }
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelectedImage(imageSrc);
    setDetectedPlate(null);
    setError(null);
  };

  const handleDetectPlate = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
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
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        imageFile = new File([blob], 'uploaded-image.jpg', { type: 'image/jpeg' });
      }
      
      // Appel à l'API de détection
      const response = await licensePlateService.recognize(imageFile);
      
      if (response.data && response.data.plateNumber) {
        setDetectedPlate(response.data.plateNumber);
        // Rediriger vers la page de réservation avec la plaque détectée
        navigate('/booking', { state: { plateNumber: response.data.plateNumber } });
      } else {
        setError('Aucune plaque d\'immatriculation détectée. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de la détection:', error);
      setError('Erreur lors de la détection de la plaque. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="plate-detection">
        <h1 className="text-3xl font-bold text-center mb-8">
          Détection de Plaque d'Immatriculation
        </h1>

        <div className="webcam-container mb-8">
          {!selectedImage ? (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg"
            />
          ) : (
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full rounded-lg"
            />
          )}
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {!selectedImage ? (
            <>
              <button
                onClick={capturePhoto}
                className="btn btn-primary"
              >
                Prendre une photo
              </button>
              <label className="btn btn-secondary">
                Télécharger une image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedImage(null)}
                className="btn btn-secondary"
              >
                Nouvelle photo
              </button>
              <button
                onClick={handleDetectPlate}
                disabled={isProcessing}
                className="btn btn-primary"
              >
                {isProcessing ? 'Détection en cours...' : 'Détecter la plaque'}
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="text-center p-4 bg-red-100 rounded-lg mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {detectedPlate && (
          <div className="text-center p-4 bg-green-100 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-2">Plaque détectée :</h2>
            <p className="text-2xl font-bold text-green-600">{detectedPlate}</p>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Conseils pour une meilleure détection :</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Assurez-vous que la plaque est bien éclairée</li>
            <li>Évitez les reflets et les ombres</li>
            <li>Prenez la photo de face</li>
            <li>La plaque doit être propre et lisible</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PlateDetection; 