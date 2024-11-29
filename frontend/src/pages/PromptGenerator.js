import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import backgroundImage from '../assets/spiral.png';
import brightBrainLogo from '../assets/bright-brain-logo.webp';
import { useNavigate } from 'react-router-dom';

function PromptGenerator() {
    const prompts = [
        {
            Question: "When was the first computer invented?",
            Options: ["A. 1960", "B. 1892", "C. 1871", "D. 1937"],
            Answer: "C"
        },
        {
            Question: "What exponent base is used most often in computing?",
            Options: ["A. 1", "B. 4", "C. 10", "D. 2"],
            Answer: "D"
        },
        {
            Question: "How many pieces of hardware compose a full computer setup? What are each of their names?",
            Options: [
                "A. 72. Too many to name.",
                "B. 8. CPU, GPU, Storage, Keyboard, Mouse, Sound Device, Monitor(s), Hardware Controller.",
                "C. 6. Computer, Monitor(s), Keyboard, Mouse, Hard Drive(s), Audio Device.",
                "D. 11. CPU, GPU, RAM, Motherboard, Hard Drive(s), Power Supply, Case, Monitor(s), Keyboard, Mouse, Audio Device."
            ],
            Answer: "D"
        },
        {
            Question: "What does RAM stand for in computing?",
            Options: ["A. Rapid Access Memory", "B. Rated Area Memory", "C. Random Access Memory", "D. Read Area Memory"],
            Answer: "C"
        },
        {
            Question: "What does the CPU do in a computer?\n",
            Options: [
                "A. Process thousands to millions of math calculations per second.",
                "B. Count processes and track them.",
                "C. Calculate Potential Underperformances",
                "D. Centralize all computing to one place."
            ],
            Answer: "A"
        },
        {
            Question: "What does the GPU do in a computer?",
            Options: [
                "A. Process graphic data to make it less disturbing.",
                "B. Process thousands to millions of math calculations per second.",
                "C. Process thousands to millions of math calculations per second, specifically relating to graphics.",
                "D. Graph your computer's power consumption over time."],
            Answer: "C"
        },
        {
            Question: "What are the most common Operating Systems for a computer?",
            Options: ["A. Microsoft, Apple, Ubuntu", "B. Windows, Mac, Linux", "C. Mint, GNU, Ubuntu", "D. None, operating systems are fake."],
            Answer: "B"
        },
        {
            Question: "What is the difference between RAM and ROM in computing?",
            Options: [
                "A. RAM is memory used to quickly store and retrieve data, while ROM is used for storing hard-coded instructions and can only be retrieved.",
                "B. RAM is internal memory and therefore faster, while ROM is external and therefore slower.",
                "C. RAM is Random Access and therefore cannot be used to store important data, while ROM is Read Only and cannot be written to in the first place.",
                "D. RAM stores information, while ROM is used to retrieve it."
            ],
            Answer: "A"
        },
        {
            Question: "What commands in SQL do you use to create a table called 'Students' and add the student named 'John'?",
            Options: [
                "A. MAKE TABLE Students (name VARCHAR(50) + ADD_TO Students VALUES('John')",
                "B. BUILD TABLE Students (name VARCHAR(50) + PUT_IN Students VALUES('John')",
                "C. CREATE TABLE Students (name VARCHAR(50) + INSERT INTO Students VALUES('John')",
                "D. CREATE TABLE Students COLUMNS(name) TYPES(VARCHAR(50) + INSERT INTO Students VALUES(name='John')"
            ],
            Answer: "C"
        },
        {
            Question: "What method do you call in Java to print to the console?",
            Options: ["A. Console.print()", "B. System.out.println()", "C. System.out.log()", "D. System.in.print()"],
            Answer: "B"
        },
        {
            Question: "In Python, how are functions declared?",
            Options: [
                "A. Using the 'function' keyword followed by the function name.",
                "B. Using the 'def' keyword followed by the function name.",
                "C. Using the 'declare' keyword followed by the function name.",
                "D. Using the 'fun' keyword followed by the function name."
            ],
            Answer: "B"
        },
        {
            Question: "In Python, how does the interpreter know what lines of code belong to what functions, since Python does not use '{}' for its functions?",
            Options: ["A. Using the 'end' keyword.", "B. Using brackets []", "C. Using semicolons ;", "D. Indentation"],
            Answer: "D"
        },
        {
            Question: "What are the access modifiers in Java?",
            Options: [
                "A. public, protected, static, transient",
                "B. public, protected, final, virtual",
                "C. public, private, protected, package",
                "D. public, private, override, static"
            ],
            Answer: "C"
        },
        {
            Question: "What HTML tag is commonly used for organizing children tags?",
            Options: ["A. <ID>", "B. <main>", "C. <div>", "D. <li>"],
            Answer: "C"
        },
        {
            Question: "What HTML tag is commonly used for text?",
            Options: ["A. <p>", "B. <text>", "C. <content>", "D. <span>"],
            Answer: "A"
        },
        {
            Question: "What HTML tag is used to display an image?",
            Options: ["A. <img>", "B. <image>", "C. <picture>", "D. <src>"],
            Answer: "A"
        },
        {
            Question: "What HTML tag is used to gather information from the user?",
            Options: ["A. <a>", "B. <post>", "C. <input>", "D. <submit>"],
            Answer: "C"
        },
        {
            Question: "How do you access an HTML element in JavaScript?",
            Options: [
                "A. document.acessElement('elementid')",
                "B. window.getHTML('elementid')",
                "C. page.queryElement('elementid')",
                "D. document.getElementById('elementid')"
            ],
            Answer: "D"
        },
        {
            Question: "What property would you modify in JavaScript to change the text of an <input> element?",
            Options: ["A. textContent", "B. value", "C. innerText", "D. text"],
            Answer: "B"
        },
        {
            Question: "What are the different scopes of variable declaration in JavaScript?",
            Options: [
                "A. Static, Dynamic, Volatile",
                "B. Local, Network, Browser",
                "C. Public, Private, Protected",
                "D. Global, Function, Block"
            ],
            Answer: "D"
        },
    ];

    const [loading, setLoading] = useState(false);
    const [apiCalls, setApiCalls] = useState(0);
    const [hasExceededLimit, setHasExceededLimit] = useState(false);
    const [questionActivated, setQuestionActive] = useState(false);
    const [userQuestionCorrect, setUserQuestion] = useState(false);
    const [aiQuestionCorrect, setAIQuestion] = useState(false);
    const navigate = useNavigate();
    let selectedPrompt = "";
    let userTempAnswer = "";
    let userAnswer = "";

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
        promptElement.textContent = selectedPrompt.Question;
    };

    const setOutput = (responseString) => {
        let output = document.getElementById('output');
        output.value = responseString;
    };

    const setA = () => {userTempAnswer = "A"};
    const setB = () => {userTempAnswer = "B"};
    const setC = () => {userTempAnswer = "C"};
    const setD = () => {userTempAnswer = "D"};

    const answerWarning = document.getElementById("warning");
    
    const setUserAnswer = () => {
        if (userTempAnswer != "") {
            userAnswer = userTempAnswer;
            answerWarning.textContent = "";
        } else{
            answerWarning.textContent = "You need to select an answer.";
        }
    };

    const handleQuestion = (aiAnswer) => {
        if (aiAnswer == selectedPrompt.Answer) {
            setAIQuestion(true);
        } else {
            setAIQuestion(false);
        }
        if (userAnswer == selectedPrompt.Answer) {
            setUserQuestion(true);
        } else {
            setUserQuestion(false);
        }
        setQuestionActive(true);
        userAnswer = "";
        userTempAnswer = "";
    }

    const handleGenerate = () => {
        setSelectedPrompt();
        setLoading(true);
        setQuestionActive(false);
        let finalPrompt = selectedPrompt.Question + " Select from one of the following:\n";
        selectedPrompt.Options.forEach(element => {
            finalPrompt += element + "\n"
        });
        for (let i = 0; i < 4; i++) {
            let docElement = document.getElementById("option-" + i + "-lbl");
            docElement.textContent = selectedPrompt.Options[i];
        }
        axiosInstance.post('https://bright-brain.ca/api/v7', { prompt: finalPrompt })
            .then((response) => {
                console.log("API response:", response.data);
                while (userAnswer == "") {}
                setOutput("The AI guessed: " + response.data.response);
                if (userAnswer != "") handleQuestion(response.data.response);
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
                <h2 style={{ marginBottom: '20px' }}>Are you smarter than an AI?</h2>
                <p style={promptStyle}><strong>Question:</strong> <span id="prompt"></span></p>
                <p id="warning" style={{ color: "red" }}></p>
                <button onClick={handleGenerate} style={buttonStyle} disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Question + AI Answer'}
                </button>
                <form>
                    <input type="radio" id="option-0" onClick={setA} />
                    <label htmlFor="option-0" id="option-0-lbl"></label>
                    <br />
                    <input type="radio" id="option-1" onClick={setB} />
                    <label htmlFor="option-1" id="option-1-lbl"></label>
                    <br />
                    <input type="radio" id="option-2" onClick={setC} />
                    <label htmlFor="option-2" id="option-2-lbl"></label>
                    <br />
                    <input type="radio" id="option-3" onClick={setD} />
                    <label htmlFor="option-3" id="option-3-lbl"></label>
                    <br />
                </form>
                <button style={buttonStyle} onClick={setUserAnswer}>Submit</button>
                <textarea
                    id="output"
                    readOnly
                    placeholder="AI answer will appear here..."
                    style={textAreaStyle}
                />
                <div>
                    {questionActivated && (
                        <div>
                            {userQuestionCorrect && (
                                <p>
                                    You got the question right!
                                    {aiQuestionCorrect && (
                                        <span> The AI got the question right!</span>
                                    )}
                                    {!aiQuestionCorrect && (
                                        <span> The AI got the question wrong!</span>
                                    )}
                                </p>
                            )}
                            {!userQuestionCorrect && (
                                <p>
                                    You got the question wrong!
                                    {aiQuestionCorrect && (
                                        <span> The AI got the question right!</span>
                                    )}
                                    {!aiQuestionCorrect && (
                                        <span> The AI got the question wrong!</span>
                                    )}
                                </p>
                            )}
                        </div>
                    )}
                </div>
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
