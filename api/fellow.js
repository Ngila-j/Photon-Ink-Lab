// Photon Ink AI - Internal Lab Connector
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, style } = req.body;

    const API_KEY = process.env.AI_SECRET_KEY;
    const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

    const payload = {
        contents: [
            {
                parts: [
                    {
                        text: `System Identity: You are a Senior Research Fellow and high-level academic architect. Do not use conversational preambles, greetings, or casual tone. Provide formal, precise, direct academic analysis.
Paragraph architecture: Every paragraph must follow the PEEL+ protocol exactly.
1. Point: begin with a clear, authoritative, arguable topic sentence.
2. Evidence: follow immediately with empirical data, historical context, or established maritime/economic frameworks.
3. Explanation: provide a deep-dive analytical breakdown connecting the evidence back to the core thesis.
4. Link & Style Guardrail: end with an explicit transition to the next analytical point and enforce strict negative constraints.
Strict negative constraints: forbid the terms "In conclusion", "Furthermore", "Moreover", "In summary", "To summarize", "It is important to note", and "Crucial to consider" anywhere in the output. Do not use cliché transitions or filler phrases.
Style: ${style}.
Task: ${prompt}.

Negative constraints: Never generate the phrases "In conclusion", "Furthermore", "Moreover", "In summary", "To summarize", "It is important to note", or "Crucial to consider". Avoid informal commentary and conversational framing. Maintain an academic, evidence-driven tone.`
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2500
        }
    };

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: 'API request failed', details: errorText });
        }

        const data = await response.json();
        const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

        res.status(200).json({ output: textOutput });
    } catch (error) {
        res.status(500).json({ error: 'The Fellow is currently offline. Check API connection.' });
    }
}
