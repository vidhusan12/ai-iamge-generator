import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState(''); // To Store the user text
  const [image, setImage] = useState('');  // To Store the AI generated Img
  const [loading, setLoading] = useState(false);


  async function handleSubmit() {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setImage(data.image);

    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  }



  return (
    <div className="App">
      <header className='App-header'>
        <h1>AI Image Generator</h1>
        <div className="input-container">
          <input
            type='text'
            placeholder='Enter a prompt...'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)} // updated everytime the user type
          />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
        <div className="image-container">
          {loading && <div className='spinner'></div>}
          {image && <img src={`data:image/png;base64,${image}`} alt="Generated" />}
        </div>
      </header>

    </div>
  );
}

export default App;
