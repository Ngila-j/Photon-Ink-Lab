// Photon Ink AI - Internal Lab Connector
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, style } = req.body;

    // RULE 1: No Assumptions - We use the official API endpoint
    const API_KEY = process.env.AI_SECRET_KEY; 
    const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `System Identity: Refer to the Senior Research Fellow Manifesto. 
                                     Style: ${style}. 
                                     Task: ${prompt}` }]
                }]
            })
        });

        const data = await response.json();
        const textOutput = data.candidates[0].content.parts[0].text;

        res.status(200).json({ output: textOutput });
    } catch (error) {
        res.status(500).json({ error: 'The Fellow is currently offline. Check API connection.' });
    }
}