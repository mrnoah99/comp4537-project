import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import backgroundImage from '../assets/spiral.png';
import brightBrainLogo from '../assets/bright-brain-logo.webp';
import { useNavigate } from 'react-router-dom';

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
    const [apiCalls, setApiCalls] = useState(0);
    const [hasExceededLimit, setHasExceededLimit] = useState(false);
    const navigate = useNavigate();
    let selectedPrompt = "";

    useEffect(() => {
        axiosInstance.get('/api/user/')
            .then((response) => {
                setApiCalls(response.data.api_calls);
                if (response.data.api_calls > 20) {
                    setHasExceededLimit(true);
                }
            })
            .catch(() => {
                alert('Failed to fetch user data');
                navigate('/login');
            });
    }, [navigate]);

    const setSelectedPrompt = () => {
        selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        let promptElement = document.getElementById('prompt');
        promptElement.textContent = selectedPrompt;
    };

    const setOutput = (responseString) => {
        let output = document.getElementById('output');
        output.value = responseString;
    };

    const handleGenerate = () => {
        setSelectedPrompt();
        setLoading(true);
        axiosInstance.post('https://bright-brain.ca/generate', { prompt: selectedPrompt })
            .then((response) => {
                console.log("API response:", response.data);
                setOutput(response.data.response);
            })
            .catch((error) => {
                console.error("Error:", error);
                setOutput("Error: Unable to fetch response. Please try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleLogout = () => {
        axiosInstance.post('/api/logout/')
            .then(() => navigate('/login'))
            .catch(() => alert('Logout failed'));
    };

    const pageStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
    };

    const containerStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '10px',
        padding: '20px',
        width: '90%',
        maxWidth: '800px',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    };

    const promptStyle = {
        fontSize: '1.2em',
        marginBottom: '20px',
    };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        marginBottom: '10px',
    };

    const textAreaStyle = {
        width: '90%',
        height: '200px',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        resize: 'none',
        fontSize: '1em',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
    };

    const logoStyle = {
        width: '100px',
        height: '100px',
        marginRight: '15px',
    };

    const headerBoxStyle = {
        maxWidth: '800px',
        marginBottom: '20px',
        padding: '30px',
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
        minHeight: '100px',
        minWidth: '800px',
    };

    const titleStyle = {
        margin: 0,
        fontSize: '2rem',
    };

    return (
        <div style={pageStyle}>
            <div style={headerBoxStyle}>
                <img src={brightBrainLogo} alt="Bright Brain Logo" style={logoStyle} />
                <h1 style={titleStyle}>Bright Brain</h1>
            </div>

            <div style={containerStyle}>
                <h3 style={{ marginBottom: '20px' }}>Random Prompt Generator</h3>
                <p style={promptStyle}><strong>Prompt:</strong> <span id="prompt"></span></p>
                <button onClick={handleGenerate} style={buttonStyle} disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Response'}
                </button>
                <textarea
                    id="output"
                    readOnly
                    placeholder="Output will appear here..."
                    style={textAreaStyle}
                />
                {hasExceededLimit && (
                    <p style={{ color: 'red', marginTop: '20px' }}>
                        You have exceeded your 20 API calls.
                    </p>
                )}
                <button
                    onClick={handleLogout}
                    style={{ ...buttonStyle, marginTop: '10px' }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default PromptGenerator;
