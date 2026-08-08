import React from 'react';

export default function Template3({ data = {} }) {
  // Maintaining your exact initial logic mapping structure for safety
  const hasSkills = data.skills?.some(skill => skill && typeof skill === 'string' && skill.trim());
  const hasLanguages = data.languages?.some(lang => lang && typeof lang === 'string' && lang.trim());
  const hasExperience = data.experience?.some(exp => exp && (exp.company?.trim() || exp.role?.trim() || exp.description?.trim()));
  const hasProjects = data.projects?.some(proj => proj && (proj.title?.trim() || proj.description?.trim()));
  const hasCertifications = data.certifications?.some(cert => cert && (cert.name?.trim() || cert.issuer?.trim()));
  const hasEducation = data.education?.some(edu => edu && (edu.school?.trim() || edu.degree?.trim()));

  return (
    <div className="resume-scroll-wrapper">
      <div className="template-timeline-container">
        
        {/* HEADER SECTION */}
        <header className="timeline-header">
          <h1 className="name">{data.personalInfo?.name || "YOUR NAME"}</h1>
          <p className="title">{data.personalInfo?.title || "The role you are applying for?"}</p>
          
          <div className="contact-info">
            {data.personalInfo?.phone && (
              <span className="contact-item">📞 {data.personalInfo.phone}</span>
            )}
            {data.personalInfo?.email && (
              <span className="contact-item">✉️ {data.personalInfo.email}</span>
            )}
            {data.personalInfo?.linkedin && (
              <span className="contact-item">🔗 {data.personalInfo.linkedin}</span>
            )}
            {data.personalInfo?.github && (
              <span className="contact-item">💻 {data.personalInfo.github}</span>
            )}
            {data.personalInfo?.location && (
              <span className="contact-item">📍 {data.personalInfo.location}</span>
            )}
          </div>
        </header>

        {/* SUMMARY SECTION */}
        {data.personalInfo?.summary && (
          <section className="timeline-section print-avoid-break">
            <h2 className="section-title">SUMMARY</h2>
            <p className="summary-text">{data.personalInfo.summary}</p>
          </section>
        )}

        {/* EXPERIENCE SECTION WITH SIDE TIMELINE BULLETS */}
        {hasExperience && (
          <section className="timeline-section">
            <h2 className="section-title">EXPERIENCE</h2>
            <div className="timeline-wrapper">
              {data.experience.map((exp, i) => (
                <div key={i} className="timeline-item print-avoid-break">
                  <div className="timeline-left-meta">
                    <span className="date-period">
                      {exp.startDate && `${exp.startDate} - ${exp.endDate || "Present"}`}
                    </span>
                    {exp.location && <span className="location-text">{exp.location}</span>}
                  </div>
                  
                  <div className="timeline-content-block">
                    <h3 className="exp-role">{exp.role || "Title"}</h3>
                    <h4 className="exp-company">{exp.company || "Company Name"}</h4>
                    {exp.description && <p className="item-description">• {exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS SECTION */}
        {hasSkills && (
          <section className="timeline-section print-avoid-break">
            <h2 className="section-title">SKILLS</h2>
            <div className="skills-pill-box">
              {data.skills
                .filter(skill => skill && skill.trim())
                .flatMap(skill => skill.split(','))
                .map((s, idx) => (
                  <div key={idx} className="skill-badge-tag">
                    {s.trim()}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* TRAINING / COURSES SECTION */}
        {hasProjects && (
          <section className="timeline-section">
            <h2 className="section-title">PROJECTS</h2>
            <div className="courses-grid-layout">
              {data.projects.map((project, i) => (
                <div key={i} className="course-card-cell print-avoid-break">
                  <h3 className="course-main-title">{project.title || "Course Title"}</h3>
                  {project.description && <p className="course-desc-text">{project.description}</p>}
                  {project.technologies && <div className="course-tech-sub">Tech: {project.technologies}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION SECTION WITH SIDE TIMELINE BULLETS */}
        {hasEducation && (
          <section className="timeline-section">
            <h2 className="section-title">EDUCATION</h2>
            <div className="timeline-wrapper">
              {data.education.map((edu, i) => (
                <div key={i} className="timeline-item print-avoid-break">
                  <div className="timeline-left-meta">
                    <span className="date-period">
                      {edu.startDate && `${edu.startDate} - ${edu.endDate || "Present"}`}
                    </span>
                    {edu.location && <span className="location-text">{edu.location}</span>}
                  </div>
                  
                  <div className="timeline-content-block">
                    <h3 className="edu-degree">{edu.degree || "Degree and Field of Study"}</h3>
                    <h4 className="edu-school">
                      {edu.school || "School or University"}
                      {edu.gpa && ` • GPA: {edu.gpa}`}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS SECTION */}
        {hasCertifications && (
          <section className="timeline-section">
            <h2 className="section-title">CERTIFICATIONS</h2>
            <div className="achievements-grid-layout">
              {data.certifications.map((cert, i) => (
                <div key={i} className="achievement-card-cell print-avoid-break">
                  <h3 className="achievement-main-title">{cert.name || "Your Achievement"}</h3>
                  <p className="achievement-desc-text">{cert.issuer} {cert.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LANGUAGES SECTION */}
        {hasLanguages && (
          <section className="timeline-section print-avoid-break">
            <h2 className="section-title">LANGUAGES</h2>
            <div className="languages-pill-box">
              {data.languages
                .filter(lang => lang && lang.trim())
                .map((lang, i) => (
                  <span key={i} className="lang-badge-tag">
                    {lang.trim()}
                  </span>
                ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}