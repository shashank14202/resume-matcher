const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://shashank14202:shashank14202@shashank.k0r1s6s.mongodb.net/resumeDB?retryWrites=true&w=majority&appName=shashank";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

client.connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("pdfFile"), async (req, res) => {
  try {
    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);

    const extractedText = pdfData.text;

    const db = client.db("resumeDB");
    const collection = db.collection("resumes");

    const result = await collection.insertOne({
      resumeText: extractedText,
      uploadedAt: new Date(),
    });

    res.json({
      message: "PDF uploaded and text extracted successfully!",
      extractedText,
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error uploading or parsing PDF:", error);
    res.status(500).json({ error: "Failed to upload or parse PDF" });
  }
});

app.post("/analyse", async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  const prompt = `
Compare the following resume and job description. Provide:
1. A match score (0-100).
2. Key strengths from the resume.
3. Weaknesses or missing skills.
4. Suggestions for improvement.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC438_5bIi-hKYjviIYua_MkIZq3C4o1iI",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const analysis = response.data.candidates[0].content.parts[0].text;

    res.json({ analysis });
  } catch (err) {
    console.error("Gemini API error:", err.message);
    res.status(500).json({ error: "Error analyzing resume" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
