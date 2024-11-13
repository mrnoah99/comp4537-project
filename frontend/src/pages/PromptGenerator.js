import React, { useState } from 'react';
import axios from 'axios';

function PromptGenerator() {
    const prompts = [
        "Tell me a story about a brave knight.",
        "What is an interesting fact about space?",
        "Explain the theory of relativity in simple terms.",
        "Give me some advice for staying productive.",
        "What are the benefits of learning a new language?",
        "What is the most popular video game in the world?",
        "What is the most popular song in the world?",
        "Who is the most popular singer/band in the world?",
        "What is the most successful video game of all time?",
        "What is the most successful board game of all time?",
        "Tell me a story about a misunderstood scary monster.",
        "Give me some advice on budgeting.",
        "How many planets, dwarf planets, and stars are in our solar system? What colours are they? Answer in a list format.",
        "What year was the United States founded? What year did it gain its independence from Britain?",
        "What year was Canada founded? What year did it gain its independence from Britain?",
        "What company developed the Starcraft series of video games?",
        "What is the company Valve known most for?",
        "What company develops the Call of Duty series of video games?",
        "What is the YouTube platform? Who is the most popular creator on it?",
        "How old is the oldest video game?",
        "When was the first computer invented?",
        "What year did the United States land a man on the moon?",
        "What exponent base is used most often in computing?",
        "Tell me a story of a pretty princess.",
        "How many pieces of hardware compose a FULL computer setup? What are each of their names?",
        "What company developed the original Halo video game trilogy?",
        "What company develops the newest Halo video games?",
        "How many Halo video games are there? What are their names? Answer in a list format.",
        "What does RAM stand for in computing?",
        "What does the CPU do in a computer?",
        "What does the GPU do in a computer?",
        "What are the most common Operating Systems for a computer?",
        "Who is the British Army man from World War 2 that is accredited as 'the father of the modern computer'?",
        "What is the difference between RAM and ROM in computing?"
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
        axios.post('https://bright-brain.ca/generate', { prompt: selectedPrompt })
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
