import React, { useEffect, useState } from "react";
import ResumePreview from "../components/ResumePreview";
import { useResume } from "../context/ResumeContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DownloadIcon, RefreshCw, Share, Edit } from "lucide-react";

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL

export default function Download() {
  const { formData, template, setTemplate, setFormData } = useResume();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const { user } = useAuth();

  // 🔥 Restore resume after refresh
  useEffect(() => {
    const saved = localStorage.getItem("resumeData");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);


const handleDownload = async () => {
  if (!user) {
    navigate("/login", {
      state: { from: "/download", action: "download" },
    });
    return;
  }

  setDownloading(true);

  try {
    const resumeElement = document.querySelector(".resume-preview");

    if (!resumeElement) {
      alert("Resume not found.");
      setDownloading(false);
      return;
    }

    const templateId = localStorage.getItem("selectedTemplate") || 1;

    // Capture canvas
    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297;

    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Extra pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const pdfBlob = pdf.output("blob");

    // Download file
    pdf.save("resume.pdf");

    // Save to backend
    const formDataToSend = new FormData();
    formDataToSend.append("resume", pdfBlob, "resume.pdf");
    formDataToSend.append("templateId", templateId);
    formDataToSend.append("resumeData", JSON.stringify(formData));

    await fetch(`${BASE_URL}/api/resume/save-latest`, {
      method: "POST",
      body: formDataToSend,
      credentials: "include",
    });

  } catch (err) {
    console.error("Download error:", err);
    alert("Failed to download resume.");
  } finally {
    setDownloading(false);
  }
};

  const handleEdit = () => {
    navigate("/details");
  };

  const handleNewResume = () => {
    navigate("/templates");
  };

  const handleShare = () => {
    // In a real app, this would share the resume
    alert('Share functionality would be implemented here!');
  };

  return (
    <>
      <Navbar />
      <div className="download-page">
        <div className="download-container">
          <header className="download-header">
            <h1>🎉 Your Resume is Ready!</h1>
            <p className="download-subtitle">
              Preview, download, and share your professionally crafted resume
            </p>
          </header>

          <div className="download-main">
            <div className="resume-preview-section">
              <div className="resume-preview-container">
                <ResumePreview />
              </div>
            </div>

            <div className="download-options">
              <div className="options-header">
                <p>Choose how you want to save or share your resume</p>
              </div>

              <div className="options-grid">
                <div className="option-card">
                  <div className="option-icon"><DownloadIcon size={20} /></div>
                  <div className="option-content">
                    <h3>Download as PDF</h3>
                    <p>Best for ATS and professional submissions</p>
                  </div>
                  <button 
                    className={`download-btn ${downloading ? 'downloading' : ''}`}
                    onClick={handleDownload}
                    disabled={downloading}
                  >
                    {downloading ? 'Generating...' : 'Download PDF'}
                  </button>
                </div>

                <div className="option-card">
                  <div className="option-icon"><Edit size={20} /></div>
                  <div className="option-content">
                    <h3>Edit Resume</h3>
                    <p>Make changes to your information</p>
                  </div>
                  <button className="edit-btn" onClick={handleEdit}>
                    Edit Details
                  </button>
                </div>

                <div className="option-card">
                  <div className="option-icon"><RefreshCw size={20} /></div>
                  <div className="option-content">
                    <h3>Change Template</h3>
                    <p>Try a different template design</p>
                  </div>
                  <button className="template-btn" onClick={handleNewResume}>
                    Select Template
                  </button>
                </div>

                <div className="option-card">
                  <div className="option-icon"><Share size={20} /></div>
                  <div className="option-content">
                    <h3>Share Resume</h3>
                    <p>Send your resume via email or link</p>
                  </div>
                  <button className="share-btn" onClick={handleShare}>
                    Share
                  </button>
                </div>
              </div>

              {/* <div className="tips-section">
                <h3>💡 Before You Submit</h3>
                <ul className="tips-list">
                  <li>✅ <strong>Check for errors:</strong> Review spelling and grammar</li>
                  <li>✅ <strong>ATS Optimization:</strong> Use keywords from job description</li>
                  <li>✅ <strong>File naming:</strong> Use format: FirstName_LastName_Resume.pdf</li>
                  <li>✅ <strong>Test ATS:</strong> Use free ATS checkers to verify compatibility</li>
                  <li>✅ <strong>Print test:</strong> Print a copy to check formatting</li>
                </ul>
              </div> */}

              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn print" onClick={window.print}>
                    🖨️ Print Resume
                  </button>
                  <button className="action-btn copy" onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/resume`);
                    alert('Resume link copied to clipboard!');
                  }}>
                    📋 Copy Link
                  </button>
                  <button className="action-btn email" onClick={() => {
                    const subject = `Resume - ${formData.personalInfo?.firstName || ''} ${formData.personalInfo?.lastName || ''}`;
                    const body = `Hi,\n\nPlease find my resume attached.\n\nBest regards,\n${formData.personalInfo?.firstName || ''} ${formData.personalInfo?.lastName || ''}`;
                    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }}>
                    📧 Email Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}