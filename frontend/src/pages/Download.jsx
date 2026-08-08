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

    // Try to generate a TRUE, ATS-friendly PDF via the Extension Backend (Puppeteer)
    try {
      const response = await fetch("http://localhost:5001/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: { ...formData, templateId } })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.pdfUrl) {
          // Trigger download of the generated PDF
          const link = document.createElement("a");
          link.href = result.data.pdfUrl;
          link.download = "resume.pdf";
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Save to Axyres backend too (optional, or we can just skip for now)
          setDownloading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not reach ATS-friendly PDF generator. Falling back to basic PDF.", err);
    }

    // Temporarily remove height/overflow restrictions to capture full resume
    const originalHeight = resumeElement.style.height;
    const originalOverflow = resumeElement.style.overflow;
    const originalTransform = resumeElement.style.transform;
    const childElement = resumeElement.firstElementChild;
    const childOriginalOverflow = childElement ? childElement.style.overflow : "";
    const childOriginalHeight = childElement ? childElement.style.height : "";

    resumeElement.style.height = "auto";
    resumeElement.style.overflow = "visible";
    resumeElement.style.transform = "none";
    if (childElement) {
      childElement.style.overflow = "visible";
      childElement.style.height = "auto";
    }

    // Capture canvas
    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
      windowHeight: resumeElement.scrollHeight
    });

    // Restore original styles
    resumeElement.style.height = originalHeight;
    resumeElement.style.overflow = originalOverflow;
    resumeElement.style.transform = originalTransform;
    if (childElement) {
      childElement.style.overflow = childOriginalOverflow;
      childElement.style.height = childOriginalHeight;
    }

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297;

    let finalImgWidth = imgWidth;
    let finalImgHeight = (canvas.height * imgWidth) / canvas.width;

    // Strict 1-page fit
    if (finalImgHeight > pageHeight) {
      const scaleRatio = pageHeight / finalImgHeight;
      finalImgHeight = pageHeight;
      finalImgWidth = finalImgWidth * scaleRatio;
    }

    const xOffset = (imgWidth - finalImgWidth) / 2;

    // Add image scaled to fit perfectly on 1 page
    pdf.addImage(imgData, "PNG", xOffset, 0, finalImgWidth, finalImgHeight);

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