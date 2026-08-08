export default function Template2({ data = {} }) {
  const getFullName = () => {
    return data.personalInfo?.name || "John Doe";
  };
  
  const hasSkills = data.skills?.some(skill => skill && typeof skill === 'string' && skill.trim());
  const hasLanguages = data.languages?.some(lang => lang && typeof lang === 'string' && lang.trim());
  const hasExperience = data.experience?.some(exp => exp && (exp.company?.trim() || exp.role?.trim() || exp.description?.trim()));
  const hasProjects = data.projects?.some(proj => proj && (proj.title?.trim() || proj.description?.trim()));
  const hasCertifications = data.certifications?.some(cert => cert && (cert.name?.trim() || cert.issuer?.trim()));
  const hasEducation = data.education?.some(edu => edu && (edu.school?.trim() || edu.degree?.trim()));
  
  const contactInfo = [
    data.personalInfo?.email,
    data.personalInfo?.phone,
    data.personalInfo?.location,
    data.personalInfo?.linkedin,
    data.personalInfo?.github
  ].filter(Boolean);
  
  return (
    <div className="template-classic">
      <header className="resume-header">
        <h1 className="name">{getFullName()}</h1>
        <p className="title">{data.personalInfo?.title || "Professional Title"}</p>
        
        {contactInfo.length > 0 && (
          <div className="contact-info">
            {contactInfo.map((item, i) => (
              <div key={i} className="contact-item">
                {item}
              </div>
            ))}
          </div>
        )}
      </header>

      {data.personalInfo?.summary && (
        <section className="section">
          <h2 className="section-title">Professional Summary</h2>
          <p className="summary-text">{data.personalInfo.summary}</p>
        </section>
      )}

      {hasExperience && (
        <section className="section">
          <h2 className="section-title">Professional Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="experience-item">
              <div className="exp-header">
                <span className="exp-role">{exp.role || "Position"}</span>
                {exp.company && <span className="exp-company">{exp.company}</span>}
              </div>
              <div className="exp-details">
                {exp.location && <span className="exp-location">{exp.location}</span>}
                {(exp.startDate || exp.endDate) && (
                  <span className="exp-dates">
                    {exp.startDate && `${exp.startDate} - ${exp.endDate || "Present"}`}
                  </span>
                )}
              </div>
              {exp.description && <p className="exp-description">{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {hasEducation && (
        <section className="section">
          <h2 className="section-title">Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="education-item">
              <div className="edu-degree">{edu.degree || "Degree"}</div>
              <div className="edu-school">{edu.school || "Institution"}</div>
              <div className="edu-details">
                {edu.location && <span className="edu-location">{edu.location}</span>}
                {edu.year && <span className="edu-year">{edu.year}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {hasSkills && (
        <section className="section">
          <h2 className="section-title">Skills & Expertise</h2>
          <div className="skills-list">
            {data.skills
              .filter(skill => skill && skill.trim())
              .map((skill, i) => (
                <div key={i} className="skill-item">
                  <div className="skill-items">{skill}</div>
                </div>
              ))}
          </div>
        </section>
      )}

      {hasProjects && (
        <section className="section">
          <h2 className="section-title">Projects</h2>
          {data.projects.map((project, i) => (
            <div key={i} className="project-item">
              <div className="project-title">{project.title || "Project Title"}</div>
              {project.description && <p className="project-description">{project.description}</p>}
              {project.technologies && <div className="project-tech">{project.technologies}</div>}
            </div>
          ))}
        </section>
      )}

      {hasCertifications && (
        <section className="section">
          <h2 className="section-title">Certifications</h2>
          <div className="certifications">
            {data.certifications.map((cert, i) => (
              <div key={i} className="cert-item">
                <div className="cert-name">{cert.name || "Certification Name"}</div>
                <div className="cert-issuer">{cert.issuer || "Issuing Organization"}</div>
                {cert.date && <div className="cert-date">{cert.date}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {hasLanguages && (
        <section className="section">
          <h2 className="section-title">Languages</h2>
          <div className="languages-list">
            {data.languages
              .filter(lang => lang && lang.trim())
              .map((lang, i) => (
                <div key={i} className="language-item">
                  <div className="language-name">{lang}</div>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}