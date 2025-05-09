import React, { useState } from "react";
import axios from "axios";

function App() {
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("pdfFile", file);

        try {
            const response = await axios.post("http://localhost:5000/upload", formData);
            setResumeText(response.data.extractedText);
        } catch (err) {
            console.error("Error uploading file:", err);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:5000/analyse", {
                resumeText,
                jobDescription,
            });
            setAnalysis(response.data.analysis);
        } catch (err) {
            console.error("Error during analysis:", err);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Resume Matcher</h1>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Resume</button>

            <br /><br />
            <textarea
                rows="6"
                cols="60"
                placeholder="Enter job description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
            <br />
            <button onClick={handleSubmit}>Analyze Resume</button>

            <br /><br />
            <h3>Analysis Result:</h3>
            <pre>{analysis}</pre>
        </div>
    );
}

export default App;
