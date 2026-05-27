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

Day 4 Requirement - Critic Loop (Self-Audit Phase):
Before finalizing output, execute an internal self-audit phase to prune non-thesis content. Actively identify and strip out peripheral sentences, tangential remarks, anecdotal digressions, or any content that does not tightly support the core thesis statement. Every sentence must earn its place by directly reinforcing the thesis. If a sentence cannot be justified as thesis-supporting, remove it entirely. This is a mandatory auditing step that must occur before output generation.

Day 5 Requirement - Hallucination Check (Verifiable Grounding):
If you make any factual claim, data assertion, historical reference, statistical claim, or source citation that lacks verifiable grounding or cannot be definitively sourced, you MUST programmatically insert the exact placeholder text string: [MISSING DATA: SOURCE REQUIRED] immediately after the unverified claim. Do not guess, speculate, or invent data. Mark all claims without verified sources. This is non-negotiable.

Style: ${style}.
Task: ${prompt}.

Core mandate: Maintain an academic, evidence-driven tone. Every claim must be defensible. Thesis coherence is paramount.`
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
