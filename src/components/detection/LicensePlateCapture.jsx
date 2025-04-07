import React, { useRef, useState } from 'react';
import { licensePlateService } from '../../services/api';

const LicensePlateCapture = ({ onPlateDetected }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setError('');
    } catch (err) {
      setError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current) return;

    setIsCapturing(true);
    setError('');

    try {
      // Créer un canvas pour capturer l'image
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

      // Convertir l'image en blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));

      // Envoyer l'image au backend
      const response = await licensePlateService.detectPlate(blob);
      
      if (response.plateNumber) {
        onPlateDetected(response.plateNumber);
      } else {
        setError('Aucune plaque d\'immatriculation détectée. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Erreur lors de la détection de la plaque. Veuillez réessayer.');
      console.error('Detection error:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Détection de Plaque d'Immatriculation</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="relative mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg bg-gray-100"
            style={{ display: stream ? 'block' : 'none' }}
          />
          {!stream && (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">La caméra n'est pas active</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {!stream ? (
            <button
              onClick={startCamera}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Démarrer la Caméra
            </button>
          ) : (
            <>
              <button
                onClick={captureImage}
                disabled={isCapturing}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isCapturing ? 'Détection en cours...' : 'Capturer la Plaque'}
              </button>
              <button
                onClick={stopCamera}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Arrêter la Caméra
              </button>
            </>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Instructions :</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Assurez-vous que la plaque est bien visible et éclairée</li>
            <li>Maintenez la caméra stable pendant la capture</li>
            <li>La plaque doit être parallèle au plan de l'image</li>
            <li>Évitez les reflets et les ombres sur la plaque</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LicensePlateCapture; 