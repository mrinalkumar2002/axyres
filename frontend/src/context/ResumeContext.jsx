import { createContext, useContext, useState, useEffect } from "react";
import Cookie from "js-cookie";

const ResumeContext = createContext(null);

const initialFormData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    linkedin: "",
    github: "",
    website: "",
    summary: ""
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: []
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

  const [isBackendSynced, setIsBackendSynced] = useState(false);

  // 🔥 Fetch from backend on initial load
  useEffect(() => {
    const fetchLatest = async () => {
      if (Cookie.get("axyres_user") === "LoggedIn") {
        try {
          const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
          const res = await fetch(`${BASE_URL}/api/resume/latest`, { credentials: "include" });
          const data = await res.json();
          if (data.success && data.resume && data.resume.resumeData) {
            // Only overwrite if backend actually has data
            if (Object.keys(data.resume.resumeData).length > 0) {
              setFormData(data.resume.resumeData);
              setTemplate(data.resume.templateId || 1);
              localStorage.setItem("resumeData", JSON.stringify(data.resume.resumeData));
              localStorage.setItem("selectedTemplate", data.resume.templateId || 1);
            }
          }
        } catch (e) {
          console.error("Failed to fetch latest resume", e);
        }
      }
      setIsBackendSynced(true);
    };
    fetchLatest();
  }, []);

  // 🔥 Auto-save formData & template to localStorage & Backend
  useEffect(() => {
    if (Cookie.get("axyres_user") === "LoggedIn") {
      localStorage.setItem("resumeData", JSON.stringify(formData));
      localStorage.setItem("selectedTemplate", template);
      
      if (isBackendSynced) {
        const timer = setTimeout(() => {
          const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
          const formDataToSend = new FormData();
          formDataToSend.append("templateId", template);
          formDataToSend.append("resumeData", JSON.stringify(formData));
          
          fetch(`${BASE_URL}/api/resume/save-latest`, {
            method: "POST",
            body: formDataToSend,
            credentials: "include",
          }).catch(e => console.error("Auto-save failed", e));
        }, 2500); // 2.5s debounce
        
        return () => clearTimeout(timer);
      }
    } else {
      localStorage.setItem("resumeData", JSON.stringify(formData));
      localStorage.setItem("selectedTemplate", template);
    }
  }, [formData, template, isBackendSynced]);

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