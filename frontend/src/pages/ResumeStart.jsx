import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import Navbar from "../components/Navbar";
import { Upload } from "lucide-react";

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL

export default function ResumeStart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTemplate } = useResume();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
  
  // Get template ID from URL or location state
  const queryParams = new URLSearchParams(location.search);
  const templateId = queryParams.get('template') || location.state?.templateId || 1;

  // Modal State for missing resume alert
  const [showMissingResumeModal, setShowMissingResumeModal] = useState(false);

  React.useEffect(() => {
    if (queryParams.get('alert') === 'missing_resume') {
      setShowMissingResumeModal(true);
    }
  }, [location.search]);

  const handleBuildFromScratch = () => {
    navigate("/details");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      setUploadError("Only PDF and DOCX files are supported");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch(`${BASE_URL}/api/ai/parse-resume`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Resume parsing failed");
      }

      const parsedData = await res.json();

      // Save template & parsed resume
      setTemplate(parseInt(templateId));
      localStorage.setItem(
        "extractedResumeData",
        JSON.stringify(parsedData)
      );

      setUploadSuccess(true);

      setTimeout(() => {
        navigate("/details");
      }, 1200);

    } catch (err) {
      console.error(err);
      setUploadError("Failed to analyze resume. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const event = { target: { files: [file] } };
      handleFileUpload(event);
    }
  };

  return (
    <>
      {showMissingResumeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 99999, backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'white', padding: '40px', borderRadius: '16px', maxWidth: '500px', width: '90%',
            textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '2px solid #000'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#111' }}>
              Action Required
            </h2>
            <p style={{ fontSize: '16px', color: '#555', marginBottom: '30px', lineHeight: '1.5' }}>
              You tried to <strong>Review</strong> or <strong>Download</strong> your resume using the Axyres Chrome Extension, but we couldn't find one on your account. 
              <br/><br/>
              Please upload your existing resume here or build one from scratch to continue.
            </p>
            <button 
              onClick={() => setShowMissingResumeModal(false)}
              style={{
                backgroundColor: '#111', color: 'white', padding: '14px 28px', border: 'none',
                borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              I Understand, Let's Build
            </button>
          </div>
        </div>
      )}

      <Navbar />
      <div className="resume-start-page">
        <div className="resume-start-container">
          <header className="resume-start-header">
            <h1>Choose How to Create Your Resume</h1>
            <p className="subtitle">Select your preferred method to build a professional resume</p>
          </header>

          <div className="options-grid">
            {/* Option 1: Build from Scratch */}
            <div className="option-card build-from-scratch">
              <div className="option-content" style={{ marginBottom: 0 }}>
                <h2>Build from Scratch</h2>
                <p className="option-description">
                  Start with a blank template and fill in your details manually. 
                  Perfect if you want complete control over your resume content.
                </p>
                <ul className="option-features">
                  <li>✓ Complete control over content</li>
                  <li>✓ Step-by-step guidance</li>
                  <li>✓ ATS-optimized templates</li>
                  <li>✓ Real-time preview</li>
                </ul>
              </div>
              <div className="option-actions">
                <button 
                  className="spl_btn"
                  onClick={handleBuildFromScratch}
                >
                  Start Building
                </button>
              </div>
            </div>

            {/* Option 2: Upload Existing Resume */}
            <div 
              className={`option-card upload-resume ${uploading ? 'uploading' : ''} ${uploadSuccess ? 'success' : ''}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="option-content">
                <h2>Upload Existing Resume</h2>
                <p className="option-description">
                  Upload your current resume and let our AI extract and organize your information. 
                  We'll pre-fill the form for you to review and edit.
                </p>
                
                <div className="upload-area">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    className="file-input"
                    id="resume-upload"
                  />
                  
                  {!uploading && !uploadSuccess && (
                    <>
                      <div className="upload-prompt">
                        <div className="upload-icon"><Upload size={20} /></div>
                        <h3>Click to Upload Your Resume</h3>
                        <p className="upload-hint">Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)</p>
                        <button 
                          className="spl_btn"
                          onClick={triggerFileUpload}
                        >
                          Choose File
                        </button>
                      </div>
                      <div className="supported-formats">
                        <span className="format-badge">PDF</span>
                        <span className="format-badge">DOC</span>
                        <span className="format-badge">DOCX</span>
                        <span className="format-badge">TXT</span>
                      </div>
                    </>
                  )}

                  {uploading && (
                    <div className="upload-progress">
                      <div className="progress-spinner"></div>
                      <h3>Analyzing Your Resume</h3>
                      <p className="progress-text">Our AI is extracting information from your resume...</p>
                      <div className="progress-steps">
                        <div className="progress-step active">Uploading</div>
                        <div className="progress-step active">Processing</div>
                        <div className="progress-step">Extracting</div>
                        <div className="progress-step">Structuring</div>
                      </div>
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="upload-success">
                      <div className="success-icon">✅</div>
                      <h3>Resume Analyzed Successfully!</h3>
                      <p className="success-text">Your information has been extracted and pre-filled. Redirecting to edit...</p>
                    </div>
                  )}

                  {uploadError && (
                    <div className="upload-error">
                      <div className="error-icon">❌</div>
                      <p className="error-text">{uploadError}</p>
                      <button 
                        className="retry-btn"
                        onClick={() => {
                          setUploadError("");
                          triggerFileUpload();
                        }}
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="ai-features">
                <h4>AI-Powered Extraction</h4>
                <ul>
                  <li>✓ Extracts contact information</li>
                  <li>✓ Identifies work experience</li>
                  <li>✓ Pulls education details</li>
                  <li>✓ Recognizes skills & certifications</li>
                  <li>✓ Maintains formatting</li>
                </ul>
              </div> */}
            </div>
          </div>

          <div className="comparison-section">
            <h2>Which Option is Right for You?</h2>
            <div className="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Build from Scratch</th>
                    <th>Upload & Extract</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Time Required</td>
                    <td>10-15 minutes</td>
                    <td>2-3 minutes</td>
                  </tr>
                  <tr>
                    <td>Best For</td>
                    <td>First-time resume builders</td>
                    <td>Updating existing resumes</td>
                  </tr>
                  <tr>
                    <td>Control Level</td>
                    <td>Complete control</td>
                    <td>AI-assisted</td>
                  </tr>
                  <tr>
                    <td>Accuracy</td>
                    <td>100% (your input)</td>
                    <td>95% (AI + review)</td>
                  </tr>
                  <tr>
                    <td>ATS Optimization</td>
                    <td>✓ Built-in</td>
                    <td>✓ Automatic</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="back-section">
            <button 
              className="back-btn"
              onClick={() => navigate("/templates")}
            >
              ← Back to Templates
            </button>
            <p className="back-hint">Not sure which to choose? <strong>Build from Scratch</strong> is recommended for most users.</p>
          </div>
        </div>
      </div>
    </>
  );
}