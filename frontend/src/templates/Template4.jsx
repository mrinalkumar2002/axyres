export default function Template4({ data = {} }) {
  const getFullName = () => {
    return data.personalInfo?.name || "John Doe";
  };
  
  const hasSkills = data.skills?.some(skill => skill && typeof skill === 'string' && skill.trim());
  const hasLanguages = data.languages?.some(lang => lang && typeof lang === 'string' && lang.trim());
  const hasExperience = data.experience?.some(exp => exp && (exp.company?.trim() || exp.role?.trim() || exp.description?.trim()));
  const hasProjects = data.projects?.some(proj => proj && (proj.title?.trim() || proj.description?.trim()));
  const hasCertifications = data.certifications?.some(cert => cert && (cert.name?.trim() || cert.issuer?.trim()));
  const hasEducation = data.education?.some(edu => edu && (edu.school?.trim() || edu.degree?.trim()));
  
  return (
    <div className="template-professional">
      <header className="resume-header">
        <div className="header-left">
          <h1 className="name">{getFullName()}</h1>
          <p className="title">{data.personalInfo?.title || "Professional Title"}</p>
        </div>
        
        <div className="header-right">
          <div className="contact-info">
            {data.personalInfo?.email && (
              <div className="contact-item">
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo?.phone && (
              <div className="contact-item">
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo?.location && (
              <div className="contact-item">
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo?.linkedin && (
              <div className="contact-item">
                <span>{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo?.github && (
              <div className="contact-item">
                <span>{data.personalInfo.github}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="resume-body">
        <aside className="sidebar">
          {data.personalInfo?.summary && (
            <section className="section">
              <h2 className="section-title">Summary</h2>
              <p className="summary-text">{data.personalInfo.summary}</p>
            </section>
          )}

          {hasSkills && (
            <section className="section">
              <h2 className="section-title">Skills</h2>
              <div className="skills-list">
                {data.skills
                  .filter(skill => skill && skill.trim())
                  .map((skill, i) => (
                    <div key={i} className="skill-category">
                      <div className="skill-items">{skill}</div>
                    </div>
                  ))}
              </div>
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
                    {edu.location && <div>{edu.location}</div>}
                    {edu.year && <div>{edu.year}</div>}
                  </div>
                </div>
              ))}
            </section>
          )}

          {hasCertifications && (
            <section className="section">
              <h2 className="section-title">Certifications</h2>
              {data.certifications.map((cert, i) => (
                <div key={i} className="cert-item">
                  <div className="cert-name">{cert.name || "Certification"}</div>
                  <div className="cert-details">
                    <span>{cert.issuer || "Issuer"}</span>
                    {cert.date && <span>{cert.date}</span>}
                  </div>
                </div>
              ))}
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
                      <span className="language-name">{lang}</span>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </aside>

        <main className="main-content">
          {hasExperience && (
            <section className="section">
              <h2 className="section-title">Experience</h2>
              {data.experience.map((exp, i) => (
                <div key={i} className="experience-item">
                  <div className="exp-header">
                    <div className="exp-left">
                      <div className="exp-role">{exp.role || "Position"}</div>
                      <div className="exp-company">{exp.company || "Company"}</div>
                      {exp.location && <div className="exp-location">{exp.location}</div>}
                    </div>
                    {(exp.startDate || exp.endDate) && (
                      <div className="exp-dates">
                        {exp.startDate && `${exp.startDate} - ${exp.endDate || "Present"}`}
                      </div>
                    )}
                  </div>
                  {exp.description && <p className="exp-description">{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {hasProjects && (
            <section className="section">
              <h2 className="section-title">Projects</h2>
              {data.projects.map((project, i) => (
                <div key={i} className="project-item">
                  <div className="project-header">
                    <div className="project-title">{project.title || "Project Title"}</div>
                    {(project.startDate || project.endDate) && (
                      <div className="project-dates">
                        {project.startDate && `${project.startDate} - ${project.endDate || "Present"}`}
                      </div>
                    )}
                  </div>
                  {project.description && <p className="project-description">{project.description}</p>}
                  {project.technologies && <div className="project-tech">Technologies: {project.technologies}</div>}
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}