import React, { useState, useEffect } from 'react'; // Add useEffect import
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import TemplateCard from "../components/TemplateCard"
import { templates } from "../data/sample"
import ResumePreview from '../components/ResumePreview';
import Navbar from '../components/Navbar';

export default function Details() {
  const navigate = useNavigate();
  const { 
    formData, 
    updatePersonalInfo, 
    updateArrayItem, 
    removeArrayItem,
    addArrayItem,
    updateFormData,
    setFormData,
    setTemplate // You need this function in your context
  } = useResume();
  
  const [activeSection, setActiveSection] = useState('personal');
  const [activePage, setActivePage] = useState('form'); // 'form' or 'template'

  useEffect(() => {
  const extractedData = localStorage.getItem('extractedResumeData');
  if (!extractedData) return;

  try {
    const parsedData = JSON.parse(extractedData);
    
    /* 1. MAP PERSONAL PROFILE FIELDS TO PREVENT BREAKAGES */
    if (parsedData.personal) {
      const rawName = parsedData.personal.name || "";
      // Split your name cleanly down space intersections safely
      const nameParts = rawName.trim().split(/\s+/);
      const fName = nameParts[0] || "";
      const lName = nameParts.slice(1).join(" ") || "";

      // Manually map fields to match the context personalInfo schema keys
      updatePersonalInfo('firstName', fName);
      updatePersonalInfo('lastName', lName);
      updatePersonalInfo('email', parsedData.personal.email || "");
      updatePersonalInfo('phone', parsedData.personal.phone || "");
      updatePersonalInfo('jobTitle', parsedData.personal.jobTitle || parsedData.personal.title || "");
      updatePersonalInfo('location', parsedData.personal.location || "");
      updatePersonalInfo('linkedin', parsedData.personal.linkedin || "");
      updatePersonalInfo('github', parsedData.personal.github || "");
      updatePersonalInfo('website', parsedData.personal.website || "");
      updatePersonalInfo('summary', parsedData.personal.summary || "");
    }
    
    /* 2. HYDRATE STRUCTURAL WORKSPACE ARRAYS WITH VALIDATED ENTRIES */
    const arraySections = ['education', 'experience', 'skills', 'projects', 'certifications', 'languages'];
    
    arraySections.forEach(section => {
      if (parsedData[section] && Array.isArray(parsedData[section]) && parsedData[section].length > 0) {
        
        // Ensure child nodes contain unique ID keys to prevent React mapping breakages
        const structuredItems = parsedData[section].map((item, index) => {
          if (typeof item === 'object' && item !== null) {
            return { ...item, id: item.id || Date.now() + index };
          }
          return item; // Keep primitive values for languages and skills arrays intact
        });

        updateFormData(section, structuredItems);
      }
    });
    
    /* 3. FLUSH TEMPORARY CACHE TRACES TO PREVENT HYDRATION RE-RUNS */
    localStorage.removeItem('extractedResumeData');
    
  } catch (error) {
    console.error('Error parsing extracted data:', error);
  }
}, [updatePersonalInfo, updateFormData]);

  const sections = [
    { id: 'personal', label: 'Personal Info'},
    { id: 'education', label: 'Education'},
    { id: 'experience', label: 'Experience'},
    { id: 'skills', label: 'Skills'},
    { id: 'projects', label: 'Projects'},
    { id: 'certifications', label: 'Certifications'},
    { id: 'languages', label: 'Languages'}
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/download');
  };

  const handleChangeTemplate = () => {
    setActivePage('template');
  };

  const handleBack = () => {
    activePage === 'template' ? setActivePage('form') : navigate('/resume-start');
  };

  // Remove entire sections
  const removeSection = (section) => {
    if (window.confirm(`Are you sure you want to remove the ${section} section?`)) {
      updateFormData(section, []);
    }
  };

  // Check if section has data
  const hasSectionData = (section) => {
    if (section === 'personal') return true;
    if (section === 'skills') return formData.skills.some(s => s.trim());
    if (section === 'languages') return formData.languages.some(l => l.trim());
    return formData[section] && formData[section].length > 0;
  };

  const renderPersonalInfo = () => (
    <div className="form-section-content">
      <div className="form-grid">
        <div className="form-group">
          <label>First Name *</label>
          <input
            type="text"
            value={formData.personalInfo.firstName}
            onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
            placeholder="John"
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input
            type="text"
            value={formData.personalInfo.lastName}
            onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
            placeholder="Doe"
            required
          />
        </div>
        <div className="form-group">
          <label>Job Title *</label>
          <input
            type="text"
            value={formData.personalInfo.jobTitle}
            onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
            placeholder="Software Engineer"
            required
          />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="(123) 456-7890"
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={formData.personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>
        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="url"
            value={formData.personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            placeholder="linkedin.com/in/username"
          />
        </div>
        <div className="form-group">
          <label>GitHub</label>
          <input
            type="url"
            value={formData.personalInfo.github}
            onChange={(e) => updatePersonalInfo('github', e.target.value)}
            placeholder="github.com/username"
          />
        </div>
        <div className="form-group">
          <label>Website</label>
          <input
            type="url"
            value={formData.personalInfo.website}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            placeholder="yourwebsite.com"
          />
        </div>
      </div>
      <div className="form-group full-width">
        <label>Professional Summary *</label>
        <textarea
          value={formData.personalInfo.summary}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          placeholder="Experienced software engineer with 5+ years in web development..."
          rows={4}
          required
        />
        <small>Briefly describe your professional background, skills, and career objectives (3-4 sentences)</small>
      </div>
    </div>
  )

  const renderEducation = () => (
    <div className="form-section-content">
      <div className="section-header">
        <h3>Education</h3>
        <button 
          type="button" 
          className="add-item-btn"
          onClick={() => addArrayItem('education', {
            id: Date.now(),
            school: "",
            degree: "",
            field: "",
            gpa: "",
            startDate: "",
            endDate: "",
            location: "",
            description: ""
          })}
        >
          + Add Education
        </button>
      </div>
      
      {formData.education.map((edu, index) => (
        <div key={edu.id} className="array-item">
          <div className="item-header">
            <h4>Education {formData.education.length > 1 ? index + 1 : ''}</h4>
            <div className="item-actions">
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeArrayItem('education', index)}
              >
                Remove
              </button>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>School/University *</label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => updateArrayItem('education', index, 'school', e.target.value)}
                placeholder="Stanford University"
                required
              />
            </div>
            <div className="form-group">
              <label>Degree *</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
                required
              />
            </div>
            <div className="form-group">
              <label>Field of Study</label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateArrayItem('education', index, 'field', e.target.value)}
                placeholder="Computer Science"
              />
            </div>
            <div className="form-group">
              <label>GPA</label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => updateArrayItem('education', index, 'gpa', e.target.value)}
                placeholder="3.8/4.0"
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="text"
                value={edu.startDate}
                onChange={(e) => updateArrayItem('education', index, 'startDate', e.target.value)}
                placeholder="Sep 2016"
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="text"
                value={edu.endDate}
                onChange={(e) => updateArrayItem('education', index, 'endDate', e.target.value)}
                placeholder="May 2020"
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={edu.location}
                onChange={(e) => updateArrayItem('education', index, 'location', e.target.value)}
                placeholder="Stanford, CA"
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              value={edu.description}
              onChange={(e) => updateArrayItem('education', index, 'description', e.target.value)}
              placeholder="Relevant coursework, honors, or achievements..."
              rows={3}
            />
          </div>
          {index < formData.education.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );

  const renderExperience = () => (
    <div className="form-section-content">
      <div className="section-header">
        <h3>Work Experience</h3>
        <div className="section-actions">
          <button 
            type="button" 
            className="add-item-btn"
            onClick={() => addArrayItem('experience', {
              id: Date.now(),
              company: "",
              role: "",
              location: "",
              startDate: "",
              endDate: "",
              description: "",
              achievements: ""
            })}
          >
            + Add Experience
          </button>
          {formData.experience.length > 0 && (
            <button
              type="button"
              className="remove-section-btn"
              onClick={() => removeSection('experience')}
            >
              Remove Section
            </button>
          )}
        </div>
      </div>
      
      {formData.experience.length === 0 ? (
        <div className="empty-section">
          <p>No work experience added. You can add experience or remove this section.</p>
          <button 
            type="button" 
            className="add-item-btn"
            onClick={() => addArrayItem('experience', {
              id: Date.now(),
              company: "",
              role: "",
              location: "",
              startDate: "",
              endDate: "",
              description: "",
              achievements: ""
            })}
          >
            + Add First Experience
          </button>
        </div>
      ) : (
        formData.experience.map((exp, index) => (
          <div key={exp.id} className="array-item">
            <div className="item-header">
              <h4>Experience {formData.experience.length > 1 ? index + 1 : ''}</h4>
              <div className="item-actions">
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeArrayItem('experience', index)}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Company *</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateArrayItem('experience', index, 'company', e.target.value)}
                  placeholder="Google"
                  required
                />
              </div>
              <div className="form-group">
                <label>Role/Title *</label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => updateArrayItem('experience', index, 'role', e.target.value)}
                  placeholder="Software Engineer"
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => updateArrayItem('experience', index, 'location', e.target.value)}
                  placeholder="Mountain View, CA"
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) => updateArrayItem('experience', index, 'startDate', e.target.value)}
                  placeholder="Jun 2020"
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="text"
                  value={exp.endDate}
                  onChange={(e) => updateArrayItem('experience', index, 'endDate', e.target.value)}
                  placeholder="Present"
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Job Description *</label>
              <textarea
                value={exp.description}
                onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
                required
              />
              <small>Use action verbs and quantify achievements when possible</small>
            </div>
            <div className="form-group full-width">
              <label>Key Achievements (Optional)</label>
              <textarea
                value={exp.achievements}
                onChange={(e) => updateArrayItem('experience', index, 'achievements', e.target.value)}
                placeholder="• Increased performance by 40%
• Led a team of 5 developers
• Implemented new features that improved user engagement"
                rows={3}
              />
              <small>List key achievements, one per line starting with •</small>
            </div>
            {index < formData.experience.length - 1 && <hr />}
          </div>
        ))
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="form-section-content">
      <div className="section-header">
        <h3>Skills</h3>
        <div className="section-actions">
          <button
            type="button"
            className="add-item-btn"
            onClick={() => addArrayItem('skills', '')}
          >
            + Add Skill
          </button>
          {formData.skills.some(s => s.trim()) && (
            <button
              type="button"
              className="remove-section-btn"
              onClick={() => removeSection('skills')}
            >
              Remove Section
            </button>
          )}
        </div>
      </div>
      
      {formData.skills.length === 0 || !formData.skills.some(s => s.trim()) ? (
        <div className="empty-section">
          <p>No skills added. Add your technical and soft skills.</p>
          <button
            type="button"
            className="add-item-btn"
            onClick={() => addArrayItem('skills', '')}
          >
            + Add First Skill
          </button>
        </div>
      ) : (
        <>
          <div className="form-group full-width">
            <label>Add Your Skills *</label>
            <div className="skills-input-container">
              {formData.skills.map((skill, index) => (
                <div key={index} className="skill-input-row">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => updateArrayItem('skills', index, 0, e.target.value)}
                    placeholder="JavaScript, React, Node.js"
                    required={index === 0}
                  />
                  {formData.skills.length > 1 && (
                    <button
                      type="button"
                      className="remove-skill-btn"
                      onClick={() => removeArrayItem('skills', index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="add-skill-btn"
              onClick={() => addArrayItem('skills', '')}
            >
              + Add More Skills
            </button>
            <small>Separate multiple skills with commas. Group related skills together.</small>
          </div>
          
          <div className="skills-categories">
            <h4>Skill Categories (Optional)</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Programming Languages</label>
                <input
                  type="text"
                  placeholder="JavaScript, Python, Java"
                />
              </div>
              <div className="form-group">
                <label>Frameworks & Libraries</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Express"
                />
              </div>
              <div className="form-group">
                <label>Tools & Technologies</label>
                <input
                  type="text"
                  placeholder="Git, Docker, AWS"
                />
              </div>
              <div className="form-group">
                <label>Soft Skills</label>
                <input
                  type="text"
                  placeholder="Leadership, Communication, Problem-solving"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="form-section-content">
      <div className="section-header">
        <h3>Projects</h3>
        <div className="section-actions">
          <button 
            type="button" 
            className="add-item-btn"
            onClick={() => addArrayItem('projects', {
              id: Date.now(),
              title: "",
              description: "",
              link: "",
              technologies: "",
              startDate: "",
              endDate: ""
            })}
          >
            + Add Project
          </button>
          {formData.projects.length > 0 && (
            <button
              type="button"
              className="remove-section-btn"
              onClick={() => removeSection('projects')}
            >
              Remove Section
            </button>
          )}
        </div>
      </div>
      
      {formData.projects.length === 0 ? (
        <div className="empty-section">
          <p>No projects added. Add your personal or professional projects.</p>
          <button 
            type="button" 
            className="add-item-btn"
            onClick={() => addArrayItem('projects', {
              id: Date.now(),
              title: "",
              description: "",
              link: "",
              technologies: "",
              startDate: "",
              endDate: ""
            })}
          >
            + Add First Project
          </button>
        </div>
      ) : (
        formData.projects.map((project, index) => (
          <div key={project.id} className="array-item">
            <div className="item-header">
              <h4>Project {formData.projects.length > 1 ? index + 1 : ''}</h4>
              <div className="item-actions">
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeArrayItem('projects', index)}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => updateArrayItem('projects', index, 'title', e.target.value)}
                  placeholder="E-commerce Website"
                  required
                />
              </div>
              <div className="form-group">
                <label>Technologies Used</label>
                <input
                  type="text"
                  value={project.technologies}
                  onChange={(e) => updateArrayItem('projects', index, 'technologies', e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="text"
                  value={project.startDate}
                  onChange={(e) => updateArrayItem('projects', index, 'startDate', e.target.value)}
                  placeholder="Jan 2023"
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="text"
                  value={project.endDate}
                  onChange={(e) => updateArrayItem('projects', index, 'endDate', e.target.value)}
                  placeholder="Apr 2023"
                />
              </div>
              <div className="form-group">
                <label>Project Link</label>
                <input
                  type="url"
                  value={project.link}
                  onChange={(e) => updateArrayItem('projects', index, 'link', e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Project Description *</label>
              <textarea
                value={project.description}
                onChange={(e) => updateArrayItem('projects', index, 'description', e.target.value)}
                placeholder="Describe the project, your role, technologies used, and outcomes..."
                rows={4}
                required
              />
              <small>Focus on what you built, how you built it, and the impact it had</small>
            </div>
            {index < formData.projects.length - 1 && <hr />}
          </div>
        ))
      )}
    </div>
  );

  const renderCertifications = () => (
    <div className="form-section-content">
      <div className="section-header">
        <h3>Certifications</h3>
        <div className="section-actions">
          <button 
            type="button" 
            className="add-item-btn"
            onClick={() => addArrayItem('certifications', {
              id: Date.now(),
              name: "",
              issuer: "",
              date: "",
              credentialId: ""
            })}
          >
            + Add Certification
          </button>
          {formData.certifications.length > 0 && (
            <button
              type="button"
              className="remove-section-btn"
              onClick={() => removeSection('certifications')}
            >
              Remove Section
            </button>
          )}
        </div>
      </div>
      
      {formData.certifications.length === 0 ? (
        <div className="empty-section">
          <p>No certifications added. Add your professional certifications.</p>
          <button 
            type="button" 
            className="add-item-btn"
            onClick={() => addArrayItem('certifications', {
              id: Date.now(),
              name: "",
              issuer: "",
              date: "",
              credentialId: ""
            })}
          >
            + Add First Certification
          </button>
        </div>
      ) : (
        formData.certifications.map((cert, index) => (
          <div key={cert.id} className="array-item">
            <div className="item-header">
              <h4>Certification {formData.certifications.length > 1 ? index + 1 : ''}</h4>
              <div className="item-actions">
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeArrayItem('certifications', index)}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Certification Name</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateArrayItem('certifications', index, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>
              <div className="form-group">
                <label>Issuing Organization</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateArrayItem('certifications', index, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </div>
              <div className="form-group">
                <label>Issue Date</label>
                <input
                  type="text"
                  value={cert.date}
                  onChange={(e) => updateArrayItem('certifications', index, 'date', e.target.value)}
                  placeholder="Mar 2023"
                />
              </div>
              <div className="form-group">
                <label>Credential ID</label>
                <input
                  type="text"
                  value={cert.credentialId}
                  onChange={(e) => updateArrayItem('certifications', index, 'credentialId', e.target.value)}
                  placeholder="AWS-123456"
                />
              </div>
            </div>
            {index < formData.certifications.length - 1 && <hr />}
          </div>
        ))
      )}
    </div>
  );

  const renderLanguages = () => (
    <div className="form-section-content">
      <div className="section-header">
        <h3>Languages</h3>
        <div className="section-actions">
          <button
            type="button"
            className="add-item-btn"
            onClick={() => addArrayItem('languages', '')}
          >
            + Add Language
          </button>
          {formData.languages.some(l => l.trim()) && (
            <button
              type="button"
              className="remove-section-btn"
              onClick={() => removeSection('languages')}
            >
              Remove Section
            </button>
          )}
        </div>
      </div>
      
      {formData.languages.length === 0 || !formData.languages.some(l => l.trim()) ? (
        <div className="empty-section">
          <p>No languages added. Add languages you speak and proficiency level.</p>
          <button
            type="button"
            className="add-item-btn"
            onClick={() => addArrayItem('languages', '')}
          >
            + Add First Language
          </button>
        </div>
      ) : (
        <div className="form-group full-width">
          <label>Languages</label>
          <div className="skills-input-container">
            {formData.languages.map((language, index) => (
              <div key={index} className="skill-input-row">
                <input
                  type="text"
                  value={language}
                  onChange={(e) => updateArrayItem('languages', index, 0, e.target.value)}
                  placeholder="English (Native), Spanish (Fluent)"
                />
                {formData.languages.length > 1 && (
                  <button
                    type="button"
                    className="remove-skill-btn"
                    onClick={() => removeArrayItem('languages', index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="add-skill-btn"
            onClick={() => addArrayItem('languages', '')}
          >
            + Add More Languages
          </button>
          <small>Include proficiency level: Native, Fluent, Intermediate, Basic</small>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="details-page">
        <div className="details-container">
          <div className="form-section">
            <header className="form-header">
              <div className="header-actions">
                <button className="back-btn" onClick={handleBack}>
                ← Back
                </button>
                <button className='btn-secondary' onClick={handleChangeTemplate}>Change Template</button>
              </div>
            </header>

            <form onSubmit={handleSubmit} style={{ display: activePage === 'form' ? 'block' : 'none' }}>
              <h1 style={{ marginTop: '10px', marginBottom: '10px' }}>Fill Your Details</h1>
              <p className="form-subtitle">Complete all sections to generate your resume</p>
              <div className="form-navigation">
                {sections.map(section => (
                  <button
                    key={section.id}
                    type="button"
                    className={`nav-btn ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.label}
                    {/* {hasSectionData(section.id) && <span className="nav-indicator">✓</span>} */}
                  </button>
                ))}
              </div>

              <div className="form-main">
                {activeSection === 'personal' && renderPersonalInfo()}
                {activeSection === 'education' && renderEducation()}
                {activeSection === 'experience' && renderExperience()}
                {activeSection === 'skills' && renderSkills()}
                {activeSection === 'projects' && renderProjects()}
                {activeSection === 'certifications' && renderCertifications()}
                {activeSection === 'languages' && renderLanguages()}
              </div>

              <div className="form-actions">
                <div className="progress-indicator">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '60%' }}></div>
                  </div>
                  <span>60% Complete</span>
                </div>
                <div className="action-buttons">
                  <button type="submit" className="btn-primary">
                    Continue to Preview →
                  </button>
                </div>
              </div>
            </form>
            <div style={{ display: activePage === 'template' ? 'block' : 'none', textAlign: 'center' }}>
              <div className="templates-grid">
                {templates.map(t => (
                  <TemplateCard
                    key={t.id}
                    image={t.image}
                    name={t.name}
                    onClick={() => {
                      setTemplate(t.id)
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="preview-section">
            <div className="preview-container">
              <ResumePreview />
              {/* <div className="preview-actions">
                <button className="preview-zoom-btn" title="Zoom In">+</button>
                <button className="preview-zoom-btn" title="Zoom Out">-</button>
                <button className="preview-reset-btn" title="Reset View">↻</button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}