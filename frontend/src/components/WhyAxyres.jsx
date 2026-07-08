import React from 'react';
import { FileText, Brain, SlidersHorizontal, ShieldCheck, Download, Check } from 'lucide-react';

export default function WhyAxyres() {
  return (
    <section id="why-axyres" className="why-axyres-section">
        <span className="section-number">03 · WHY AXYRES</span>
        <h2 className="section-title">
          A resume engine, not <span className="title-italic">just another editor.</span>
        </h2>

      {/* Row 1: Two Large Feature Cards */}
      <div className="features-grid-row-1">
        {/* Card 1: One Master Resume */}
        <div className="feature-card-large">
          <div className="icon-wrapper">
            <FileText size={20} strokeWidth={2} />
          </div>
          <h3>One Master Resume</h3>
          <p className="card-desc">
            Upload your existing CV — we extract structure with AI. 
            From that single source of truth, every tailored version stays honest and consistent.
          </p>
        </div>

        {/* Card 2: ATS Engine */}
        <div className="feature-card-large">
          <div className="icon-wrapper">
            <Brain size={20} strokeWidth={2} />
          </div>
          <h3>ATS engine, tuned for recruiters</h3>
          <p className="card-desc">
            Real scoring beyond keyword stuffing — section formatting, verb fit, 
            seniority alignment, and recruiter perception.
          </p>
        </div>
      </div>

      {/* Row 2: Three Smaller Feature Cards */}
      <div className="features-grid-row-2">
        {/* Card 3: Turbo + Precision */}
        <div className="feature-card-small">
          <div className="icon-wrapper">
            <SlidersHorizontal size={18} strokeWidth={2} />
          </div>
          <h3>Turbo + Precision</h3>
          <p>
            <strong>Turbo:</strong> 1-click, conservative edits.<br />
            <strong>Precision:</strong> conversational AI rewrites with full ATS depth and gap reporting.
          </p>
        </div>

        {/* Card 4: Save or don't */}
        <div className="feature-card-small">
          <div className="icon-wrapper">
            <ShieldCheck size={18} strokeWidth={2} />
          </div>
          <h3>Save · or don't</h3>
          <p>
            Every generation is private by default. Your master is encrypted at rest. 
            We don't sell. We don't train on you.
          </p>
        </div>

        {/* Card 5: Formats */}
        <div className="feature-card-small">
          <div className="icon-wrapper">
            <Download size={18} strokeWidth={2} />
          </div>
          <h3>PDF · DOCX · TXT</h3>
          <p>
            Recruiter-friendly exports, no branding. Three clean exports free, 
            unlimited on paid.
          </p>
        </div>
      </div>
    </section>
  );
}