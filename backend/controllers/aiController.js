import fs from "fs";
import mammoth from "mammoth";
import Groq from "groq-sdk";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }

    let resumeText = "";
    const file = req.file;

    // ✅ PDF Processing
    if (file.mimetype === "application/pdf") {
      const data = new Uint8Array(fs.readFileSync(file.path));
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        resumeText += strings.join(" ") + "\n";
      }
    }
    // ✅ DOCX Processing
    else if (
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: file.path });
      resumeText = result.value;
    } else {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // Clean up uploaded file
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `You are a professional resume parser. Extract information into a clean JSON format.
          
RULES:
- Return ONLY valid JSON.
- No conversational text or markdown code blocks.
- Use empty strings or empty arrays if data is missing.

JSON FORMAT:
{
  "personal": {
    "name": "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": "",
    "summary": ""
  },
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": "",
      "location": ""
    }
  ],
  "experience": [
    {
      "role": "",
      "company": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "skills": [],
  "projects": [
    {
      "title": "",
      "description": "",
      "technologies": "",
      "link": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "year": ""
    }
  ]
}`
        },
        {
          role: "user",
          content: `Parse this resume text:\n\n${resumeText}`
        }
      ]
    });

    // 🛠️ THE FIX: Extract and Clean the string before parsing
    let content = completion.choices[0].message.content;

    // Remove markdown blocks if they exist (```json ... ```)
    const cleanedContent = content.replace(/```json|```/g, "").trim();

    try {
      const parsedJSON = JSON.parse(cleanedContent);
      return res.status(200).json(parsedJSON);
    } catch (parseErr) {
      console.error("Failed to parse AI output directly. Raw output:", content);
      return res.status(500).json({ 
        message: "Failed to process resume format",
        error: parseErr.message 
      });
    }

  } catch (err) {
    console.error("❌ Resume parsing error:", err);
    return res.status(500).json({ message: "Resume parsing failed" });
  }
};