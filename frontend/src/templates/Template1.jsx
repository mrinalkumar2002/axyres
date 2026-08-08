import React from 'react'

export default function Template1({ data = {} }) {
  // Original conditional verification rules
  const hasSkills = data.skills?.some(skill => skill && typeof skill === 'string' && skill.trim());
  const hasLanguages = data.languages?.some(lang => lang && typeof lang === 'string' && lang.trim());
  const hasExperience = data.experience?.some(exp => exp && (exp.company?.trim() || exp.role?.trim() || exp.description?.trim()));
  const hasProjects = data.projects?.some(proj => proj && (proj.title?.trim() || proj.description?.trim()));
  const hasCertifications = data.certifications?.some(cert => cert && (cert.name?.trim() || cert.issuer?.trim()));
  const hasEducation = data.education?.some(edu => edu && (edu.school?.trim() || edu.degree?.trim()));

  return (
    <div className="resume-scroll-wrapper">
      <div className="template-classic-container">
        
        {/* HEADER SECTION */}
        <header className="classic-header">
          <h1 className="name">{data.personalInfo?.name || "YOUR NAME"}</h1>
          <p className="title">{data.personalInfo?.title || "The role you are applying for?"}</p>
          <div className="contact-info">
            {data.personalInfo?.phone && (
              <span className="contact-item">• {data.personalInfo.phone}</span>
            )}
            {data.personalInfo?.email && (
              <span className="contact-item">• {data.personalInfo.email}</span>
            )}
            {data.personalInfo?.linkedin && (
              <span className="contact-item">• {data.personalInfo.linkedin}</span>
            )}
            {data.personalInfo?.github && (
              <span className="contact-item">• {data.personalInfo.github}</span>
            )}
            {data.personalInfo?.location && (
              <span className="contact-item">• {data.personalInfo.location}</span>
            )}
          </div>
        </header>

        {/* SUMMARY SECTION */}
        {data.personalInfo?.summary && (
          <section className="classic-section print-avoid-break">
            <h2 className="section-title">Summary</h2>
            <p className="summary-text">{data.personalInfo.summary}</p>
          </section>
        )}

        {/* EXPERIENCE SECTION */}
        {hasExperience && (
          <section className="classic-section">
            <h2 className="section-title">Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="experience-item print-avoid-break">
                <div className="item-row-header">
                  <span className="company-name">{exp.company || "Company Name"}</span>
                  <span className="location-text">{exp.location || "Location"}</span>
                </div>
                <div className="item-row-subheader">
                  <span className="role-title">{exp.role || "Title"}</span>
                  <span className="date-text">
                    {exp.startDate && `${exp.startDate} - ${exp.endDate || "Present"}`}
                  </span>
                </div>
                {exp.description && <p className="item-description">• {exp.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* SKILLS SECTION */}
        {hasSkills && (
          <section className="classic-section print-avoid-break">
            <h2 className="section-title">Skills</h2>
            <div className="skills-comma-list">
              {data.skills
                .filter(skill => skill && skill.trim())
                .flatMap(skill => skill.split(','))
                .map((s, idx, arr) => (
                  <span key={idx} className="skill-text-item">
                    {s.trim()}{idx < arr.length - 1 ? ', ' : ''}
                  </span>
                ))}
            </div>
          </section>
        )}

        {/* TRAINING / COURSES (PROJECTS) SECTION */}
        {hasProjects && (
          <section className="classic-section">
            <h2 className="section-title">Projects</h2>
            {data.projects.map((project, i) => (
              <div key={i} className="course-item print-avoid-break">
                <span className="course-title">{project.title || "Course Title"}</span>
                {project.description && (
                  <span className="course-provider"> — {project.description}</span>
                )}
                {project.technologies && (
                  <div className="course-tech-meta">Tech: {project.technologies}</div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* EDUCATION SECTION */}
        {hasEducation && (
          <section className="classic-section">
            <h2 className="section-title">Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="education-block print-avoid-break">
                <div className="item-row-header">
                  <span className="school-name">{edu.school || "School or University"}</span>
                  <span className="location-text">{edu.location || "Location"}</span>
                </div>
                <div className="item-row-subheader">
                  <span className="degree-title">
                    {edu.degree || "Degree and Field of Study"}
                    {edu.gpa && ` (GPA: ${edu.gpa})`}
                  </span>
                  <span className="date-text">
                    {edu.startDate && `${edu.startDate} - ${edu.endDate || "Present"}`}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* CERTIFICATIONS SECTION */}
        {hasCertifications && (
          <section className="classic-section">
            <h2 className="section-title">Certifications</h2>
            <div className="achievements-flex-row">
              {data.certifications.map((cert, i) => (
                <div key={i} className="achievement-box-column print-avoid-break">
                  <h3 className="achievement-title">{cert.name || "Your Achievement"}</h3>
                  <p className="achievement-desc">
                    {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LANGUAGES SECTION */}
        {hasLanguages && (
          <section className="classic-section print-avoid-break">
            <h2 className="section-title">Languages</h2>
            <div className="languages-comma-list">
              {data.languages
                .filter(lang => lang && lang.trim())
                .map((lang, i, arr) => (
                  <span key={i} className="lang-text-item">
                    {lang.trim()}{i < arr.length - 1 ? ', ' : ''}
                  </span>
                ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}