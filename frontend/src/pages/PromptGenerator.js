import React, { useState } from 'react';
import axios from 'axios';

function PromptGenerator() {
    const prompts = [
        "Tell me a story about a brave knight.",
        "What are some interesting facts about space?",
        "Explain the theory of relativity in simple terms.",
        "Give me some advice for staying productive.",
        "What are the benefits of learning a new language?",
    ];

    const [loading, setLoading] = useState(false);
    let selectedPrompt = "";

    const setSelectedPrompt = () => {
        selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        let promptElement = document.getElementById('prompt');
        promptElement.textContent = selectedPrompt;
    }

    const setOutput = (responseString) => {
        let output = document.getElementById('output');
        output.value = responseString;
    }

    const handleGenerate = () => {
        setSelectedPrompt();
        setLoading(true);
        axios.post('http://3.81.53.175:8000/generate', { prompt: selectedPrompt })
            .then((response) => {
                console.log("API response:", response.data); // Log for debugging
                setOutput(response.data.response); // Adjust the key if needed
            })
            .catch((error) => {
                console.error("Error:", error);
                setOutput("Error: Unable to fetch response. Please try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Random Prompt Generator</h2>
            <p style={promptStyle}><strong>Prompt:</strong><span id="prompt"></span></p>
            <button onClick={handleGenerate} style={buttonStyle} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Response'}
            </button>
            <textarea
                id="output"
                readOnly
                placeholder="Output will appear here..."
                style={textAreaStyle}
            />
        </div>
    );
}

// Inline styles
const containerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
};

const promptStyle = {
    fontSize: '1.2em',
    marginBottom: '20px',
};

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '20px',
};

const textAreaStyle = {
    width: '100%',
    height: '200px',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    resize: 'none',
    fontSize: '1em',
};

export default PromptGenerator;
