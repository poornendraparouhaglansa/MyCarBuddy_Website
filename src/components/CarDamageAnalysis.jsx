import React, { useState, useEffect, useContext } from 'react';
import { GoogleGenAI, createUserContent } from '@google/genai';
import { FaCar, FaUpload, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import { useAlert } from '../context/AlertContext';
import SignIn from "./SignIn";

const CarDamageAnalysis = () => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showAlert } = useAlert();
  const [signInVisible, setSignInVisible] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const ai = new GoogleGenAI({ apiKey: 'AIzaSyAjQkNYws_C4FaDg6JOK0EdRq3yxg-k-Q4' }); // Replace with your actual API key

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!user || user.name === "GUEST") {
      // showAlert('Please login to analyze damage', 'warning');
      setSignInVisible(true);
      return;
    }
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      // Convert all images to base64
      const imageParts = await Promise.all(
        images.map(async (image) => {
          const base64Data = await convertToBase64(image);
          return {
            inlineData: {
              mimeType: image.type,
              data: base64Data,
            },
          };
        })
      );

      // Create the prompt with text and multiple images
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: createUserContent([
          'Analyze the body damage in these car images. Describe any visible dents, scratches, crashes, rust, or other damages in detail. Create a formatted short report on the damages',
          ...imageParts,
        ]),
      });

      setResult(response.text);
    } catch (err) {
      setError('Error analyzing images: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Revoke object URLs on unmount
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  useEffect(() => {
    const handleUserUpdate = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("userProfileUpdated", handleUserUpdate);

    return () => {
      window.removeEventListener("userProfileUpdated", handleUserUpdate);
    };
  }, []);

  return (
    <div>
      <div className="container-fluid">
        <div className="row mt-5 mb-5 justify-content-center" >
          {/* Left Side - Car Image */}
          <div className="col-lg-5 d-flex align-items-center justify-content-center position-relative" style={{
            background: 'linear-gradient(135deg, rgb(83 157 154) 0%, rgb(17 110 112) 100%)',
            borderRadius: '20px 0 0 20px',
          }}>
            <div className='position-absolute' style={{
              top: '20px',
              left: '20px',
              zIndex: 2
            }}>
              <h2 className='text-white fw-bold font-size-xxl' style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                AI Car Damage Analysis
              </h2>
              <p className='text-white '>
                Upload your car images and get instant AI-powered damage assessment
              </p>
            </div>

            <div className='position-relative' >
              <FaCar size={250} color="#fff" style={{ opacity: 0.9 , marginTop: '50px' }} />
            </div>

            {/* Decorative elements */}
            <div style={{
              position: 'absolute',
              top: '10%',
              right: '10%',
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              animation: 'float 6s ease-in-out infinite'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '20%',
              left: '15%',
              width: '60px',
              height: '60px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              animation: 'float 4s ease-in-out infinite reverse'
            }}></div>
          </div>

          {/* Right Side - Upload and Analysis Section */}
          <div className="col-lg-5 d-flex flex-column justify-content-center" >
            {/* Upload Section */}
            <div className="mb-4">
              <h4 style={{
                color: '#116d6e',
                marginBottom: '20px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                <FaUpload style={{ marginRight: '10px' }} />
                Upload Car Images
              </h4>

              <div
                style={{
                  border: '3px dashed #116d6e',
                  borderRadius: '20px',
                  padding: '15px 20px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: 'inset 0 0 20px rgba(17, 109, 110, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e9ecef';
                  e.target.style.boxShadow = 'inset 0 0 30px rgba(17, 109, 110, 0.2)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.boxShadow = 'inset 0 0 20px rgba(17, 109, 110, 0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <FaUpload size={30} color="#116d6e" style={{ marginBottom: '15px' }} />
                <p style={{
                  color: '#116d6e',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  marginBottom: '10px'
                }}>
                  Choose Files
                </p>
                <p style={{
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  Select multiple images for better analysis
                </p>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload" style={{
                  cursor: 'pointer',
                  color: '#116d6e',
                  fontWeight: '600',
                  textDecoration: 'underline'
                }}>
                  Click to browse
                </label>
              </div>
            </div>

            {/* Uploaded Images Preview */}
            {previews.length > 0 && (
              <div className="mb-4">
                <h5 style={{
                  color: '#116d6e',
                  marginBottom: '15px',
                  fontWeight: '600'
                }}>
                  <FaSearch style={{ marginRight: '8px' }} />
                  Uploaded Images ({previews.length})
                </h5>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '15px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '10px',
                  background: '#f8f9fa',
                  borderRadius: '10px'
                }}>
                  {previews.map((preview, index) => (
                    <div key={index} style={{
                      position: 'relative',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <div className="text-center mb-4">
              <button
                onClick={handleAnalyze}
                disabled={loading || images.length === 0}
                className='btn style2 btn-contact px-4 py-2'
                onMouseEnter={(e) => {
                  if (!loading && images.length > 0) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 35px rgba(17, 109, 110, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(17, 109, 110, 0.3)';
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaSearch style={{ marginRight: '10px' }} />
                    Analyze Damage
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid #f5c6cb',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <FaExclamationTriangle style={{ marginRight: '10px', fontSize: '1.2rem' }} />
                <span>{error}</span>
              </div>
            )}

            {/* Analysis Result */}
            {result && (
              <div style={{
                backgroundColor: '#d1ecf1',
                color: '#0c5460',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid #bee5eb',
                marginBottom: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <h5 style={{
                  marginBottom: '15px',
                  color: '#116d6e',
                  fontWeight: '600'
                }}>
                  <FaSearch style={{ marginRight: '8px' }} />
                  Analysis Report
                </h5>
                <div style={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      <SignIn
        isVisible={signInVisible}
        onClose={() => setSignInVisible(false)}
      />
    </div>
  );
};

export default CarDamageAnalysis;