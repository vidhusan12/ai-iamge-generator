// server.js

// Import the required packages. We added node-fetch for API calls.
const express = require('express');
const dotenv = require('dotenv');
const fetch = require('node-fetch'); // This is how you import a package

dotenv.config();

const app = express();

// A new line to tell Express to use JSON. This lets our server read data sent from the frontend.
app.use(express.json());

const port = process.env.PORT || 5000;

// This is our new API endpoint. We are using `app.post` because the frontend
// will be "posting" data (the user's prompt) to it.
app.post('/generate-image', async (req, res) => {
    
    // Get the text prompt from the frontend.
    // The `.body` is the data sent by the frontend, and we're looking for a property named `prompt`.
    const { prompt } = req.body;

    // Check if the prompt is empty. If it is, send an error message back.
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    // Now, we'll connect to the Stability AI API.
    // We are using `process.env.STABILITY_API_KEY` to securely access the key from our .env file.
    const apiKey = process.env.STABILITY_API_KEY; 

    // An `async` function allows us to `await` the response, which means the code
    // will pause until it gets a reply from Stability AI.
    try {
        const response = await fetch(
            "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    text_prompts: [{ text: prompt }],
                    cfg_scale: 7,
                    height: 512,
                    width: 512,
                    samples: 1,
                    steps: 30,
                }),
            }
        );

        // Check for a bad response (e.g., an error from the API)
        if (!response.ok) {
            throw new Error(`Stability AI API error: ${response.statusText}`);
        }

        const data = await response.json();

        // The image data is a Base64 string inside the JSON response.
        const image = data.artifacts[0].base64;

        // Send the Base64 image data back to the frontend.
        res.json({ image });

    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({ error: "Failed to generate image." });
    }
});

app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});