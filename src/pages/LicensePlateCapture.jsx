import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { licensePlateService } from '../services/api';

const LicensePlateCapture = ({ onPlateDetected }) => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [mode, setMode] = useState(null); // "camera" | "upload"

  // 📸 Capture via webcam
  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const blob = await fetch(imageSrc).then(res => res.blob());
    const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });

    await detectPlate(file);
  };

  // 📤 Upload d'image
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadPreview(URL.createObjectURL(file));
    await detectPlate(file);
  };
  const detectPlate = async (file) => {
    setLoading(true);
    try {
      const response = await licensePlateService.recognize(file);
  
      console.log("Réponse de l'API :", response);
  
      // ✅ Initialisation de rawPlate
      let rawPlate = "";
  
      if (typeof response.data === "string") {
        rawPlate = response.data;
      } else if (typeof response.data?.plate === "string") {
        rawPlate = response.data.plate;
      } else {
        alert("Réponse inattendue du serveur.");
        return;
      }
  
      // ✅ Extraction de la plaque depuis un message texte (ex: "✅ Plaque détectée : ABC123")
      const match = rawPlate.match(/:\s*([A-Z0-9\-]{4,})/i);
      if (match) {
        const plate = match[1].toUpperCase();
        onPlateDetected(plate);
      } else {
        alert("Aucune plaque détectée.");
      }
    } catch (err) {
      console.error("Erreur détection :", err);
      alert("Échec de la détection.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="text-center space-y-6 p-4">
      <h2 className="text-xl font-bold">Choisissez une méthode de détection</h2>

      {!mode && (
        <div className="flex justify-center gap-6">
          <button
            onClick={() => setMode('camera')}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Utiliser la caméra
          </button>
          <button
            onClick={() => setMode('upload')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Uploader une image
          </button>
        </div>
      )}

      {mode === 'camera' && (
        <div className="flex flex-col items-center">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="mx-auto rounded-lg max-w-md"
          />
          <button
            onClick={captureImage}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Détection...' : 'Scanner maintenant'}
          </button>
          <button
            onClick={() => setMode(null)}
            className="mt-2 text-sm text-gray-500 underline"
          >
            ⬅ Revenir au choix
          </button>
        </div>
      )}

      {mode === 'upload' && (
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="mt-2"
          />
          {uploadPreview && (
            <div className="mt-4">
              <img src={uploadPreview} alt="Preview" className="max-w-sm mx-auto rounded" />
            </div>
          )}
          <button
            onClick={() => setMode(null)}
            className="mt-4 text-sm text-gray-500 underline"
          >
            ⬅ Revenir au choix
          </button>
        </div>
      )}
    </div>
  );
};

export default LicensePlateCapture;
