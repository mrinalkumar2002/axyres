import { createContext, useContext, useState, useEffect } from "react";
import Cookie from "js-cookie";

const ResumeContext = createContext(null);

const initialFormData = {
  personalInfo: {
    firstName: "Michael",
    lastName: "Johnson",
    jobTitle: "Full Stack Developer",
    email: "michael123@gmail.com",
    phone: "+91 98765 43210",
    address: "Mumbai",
    city: "Mumbai",
    state: "Maharastra",
    zipCode: "400001",
    linkedin: "https://www.linkedin.com/in/michael-johnson",
    github: "https://github.com/michael",
    website: "https://michaeljohnson.vercel.com",
    summary: "Innovative Full Stack Web Developer passionate about bridging the gap between sophisticated backend logic and intuitive frontend design. Experienced in agile methodologies, collaborating with cross-functional teams to deliver high-quality, ATS-optimized software solutions from concept to deployment."
  },

  education: [
    {
      id: 1,
      school: "National Institute of Technology, Srinagar",
      degree: "B.Tech",
      field: "Electrical Engineering",
      gpa: "8.2",
      startDate: "2021",
      endDate: "2025",
      location: "Srinagar, J&K",
      description: "Focused on core computational engineering, data structures, and algorithmic systems engineering."
    },
    {
      id: 2,
      school: "Industry Ready Certification",
      degree: "Advanced Certification",
      field: "Full-stack Development",
      gpa: "N/A",
      startDate: "2025",
      endDate: "2025",
      location: "Online",
      description: "Intensive specialization program mastering modern JavaScript frameworks, MERN stack application design, and responsive interface building."
    }
  ],

  experience: [
    {
      id: 3,
      company: "Advith Itec Private Limited",
      role: "Frontend Web Developer Intern",
      location: "Remote",
      startDate: "Sept 2025",
      endDate: "Dec 2025",
      description: "Collaborated on production-level UI feature development using React.js and modern state management principles.",
      achievements: "Optimized dashboard interface rendering speeds by 20% and resolved critical state propagation bottlenecks across application routes."
    }
  ],

  skills: [
    "Frontend: HTML, CSS, Bootstrap, JavaScript, React.js",
    "Backend: Node.js, Express, Python",
    "Databases & Tools: MongoDB, SQLite, Git, DSA, C++, OOPS"
  ],

  projects: [
    {
      id: 4,
      title: "Nxt Watch",
      description: "Developed a comprehensive video streaming platform inspired by YouTube. Features dynamic video category tabs (Trending, Gaming, Saved videos), customized theme switching (Light/Dark mode), user search queries, and sticky video player layouts.",
      link: "https://github.com/jaganmohan-j/nxt-watch",
      technologies: "React.js, JavaScript, CSS, Bootstrap, REST APIs, JWT Token, Client-side Routing",
      startDate: "Jan 2026",
      endDate: "Feb 2026"
    },
    {
      id: 5,
      title: "YatraYaan",
      description: "Built a robust, full-stack tour, travel, and vehicle rental web platform enabling users to seamlessly look up travel configurations, organize vehicle itineraries, and manage secure rental bookings over a clean custom dashboard context.",
      link: "https://github.com/jaganmohan-j/yatrayaan",
      technologies: "HTML, CSS, JavaScript, React.js, Node.js, Express, MongoDB",
      startDate: "Mar 2026",
      endDate: "Apr 2026"
    }
  ],

  certifications: [],

  languages: ["English", "Hindi"]
};

export function ResumeProvider({ children }) {
  const [template, setTemplate] = useState(() => {
    return localStorage.getItem("selectedTemplate") || 1;
  });

  // 🔥 Load formData from localStorage on first render
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("resumeData");
    if (Cookie.get("axyres_user") === "LoggedIn") {
      return savedData ? JSON.parse(savedData) : initialFormData;
    }
    return initialFormData;
  });

  // 🔥 Auto-save formData
  useEffect(() => {
    if (Cookie.get("axyres_user") === "LoggedIn") {
      localStorage.setItem("resumeData", JSON.stringify(formData));
    }
  }, [formData]);

  // 🔥 Auto-save template
  useEffect(() => {
    localStorage.setItem("selectedTemplate", template);
  }, [template]);

  /* ---------------- BASIC UPDATERS ---------------- */

  const setAllFormData = (data) => {
    setFormData(data);
  };

  const updateFormData = (section, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: value
    }));
  };

  /* ---------------- PERSONAL INFO ---------------- */

  const updatePersonalInfo = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  /* ---------------- ARRAY HELPERS ---------------- */

  const addArrayItem = (section, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev[section]];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return {
        ...prev,
        [section]: updated
      };
    });
  };

  const removeArrayItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  return (
    <ResumeContext.Provider
      value={{
        template,
        setTemplate,
        formData,
        setFormData,
        setAllFormData,
        updateFormData,
        updatePersonalInfo,
        addArrayItem,
        updateArrayItem,
        removeArrayItem
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within ResumeProvider");
  }
  return context;
}