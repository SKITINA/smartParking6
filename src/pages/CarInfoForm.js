import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaUpload, FaCar, FaSpinner } from 'react-icons/fa';
import { licensePlateService } from '../services/api';
import '../styles/CarInfoForm.css';

const CarInfoForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    color: '',
    plateNumber: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const webcamRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (selectedImage) {
        // Convertir l'image en fichier pour l'envoyer à l'API
        let imageFile;
        
        if (selectedImage.startsWith('data:')) {
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          imageFile = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
        } else {
          imageFile = selectedImage;
        }
        
        // Appel à l'API de détection
        const response = await licensePlateService.recognize(imageFile);
        
        if (response.data && response.data.plateNumber) {
          setFormData(prev => ({
            ...prev,
            plateNumber: response.data.plateNumber
          }));
        }
      }

      // Vérifier que tous les champs requis sont remplis
      if (!formData.brand || !formData.model || !formData.color || !formData.plateNumber) {
        throw new Error('Veuillez remplir tous les champs requis');
      }

      // Sauvegarder les informations de la voiture
      localStorage.setItem('carInfo', JSON.stringify(formData));
      
      // Rediriger vers la page de réservation
      navigate('/booking');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-info-form">
      <div className="form-header">
        <h1>Informations du véhicule</h1>
        <p>Remplissez les informations de votre véhicule ou scannez la plaque d'immatriculation</p>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h2>Informations manuelles</h2>
          <div className="form-group">
            <label htmlFor="brand">Marque</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="model">Modèle</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Couleur</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="plateNumber">Numéro de plaque</label>
            <input
              type="text"
              id="plateNumber"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Scanner la plaque d'immatriculation</h2>
          <div className="scan-options">
            <div className="scan-option">
              <button type="button" onClick={capturePhoto} className="btn btn-primary">
                <FaCamera /> Prendre une photo
              </button>
            </div>
            <div className="scan-option">
              <label className="btn btn-secondary">
                <FaUpload /> Importer une image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {previewUrl && (
            <div className="preview-container">
              <img src={previewUrl} alt="Preview" className="preview-image" />
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  setPreviewUrl(null);
                }}
                className="remove-button"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <FaCar />
                Enregistrer et continuer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarInfoForm; 