/**
 * Cloudflare Workers API for English Speaking Practice
 * 
 * This worker handles API requests and proxies them to Groq AI
 */

// CORS headers helper
function corsHeaders(origin) {
    return {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    };
}

// Handle CORS preflight
function handleOptions(request) {
    const origin = request.headers.get('Origin');
    return new Response(null, {
        headers: corsHeaders(origin)
    });
}

// Generate sentences using Groq AI
async function generateSentences(request, env) {
    try {
        // Parse request body
        const body = await request.json();
        const { word, maxSentences = 10 } = body;

        // Validate input
        if (!word || typeof word !== 'string' || word.trim() === '') {
            return new Response(
                JSON.stringify({ error: 'Invalid request: "word" field is required' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders(request.headers.get('Origin')) }
                }
            );
        }

        if (!Number.isInteger(maxSentences) || maxSentences < 1 || maxSentences > 20) {
            return new Response(
                JSON.stringify({ error: 'Invalid request: "maxSentences" must be between 1 and 20' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders(request.headers.get('Origin')) }
                }
            );
        }

        // Check API key
        if (!env.GROQ_API_KEY) {
            return new Response(
                JSON.stringify({ error: 'Server configuration error: API key not set' }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders(request.headers.get('Origin')) }
                }
            );
        }

        // Create prompt
        const prompt = `Generate exactly ${maxSentences} example sentences using the word "${word}". 
Each sentence should:
1. Use the word "${word}" in a natural, contextual way
2. Be in different contexts (e.g., business, education, personal development, travel, technology, etc.)
3. Be clear and easy to understand for English learners
4. Be between 10-20 words long

Format your response as a JSON array with this structure:
[
  {
    "text": "The sentence using the word ${word}",
    "vietnamese": "Bản dịch tiếng Việt của câu trên",
    "context": "Brief context category (e.g., Business, Education, Travel)",
    "contextVietnamese": "Bản dịch tiếng Việt của context (ví dụ: Kinh doanh, Giáo dục, Du lịch)"
  }
]

IMPORTANT: You must provide accurate Vietnamese translations for both the sentence and the context category.

Return ONLY the JSON array, no additional text or explanation.`;

        // Call Groq API
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.9,
                max_tokens: 2048,
                top_p: 0.95
            })
        });

        // Check response
        if (!groqResponse.ok) {
            const errorData = await groqResponse.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || 'Failed to generate sentences';

            return new Response(
                JSON.stringify({ error: `Groq API error: ${errorMessage}` }),
                {
                    status: groqResponse.status,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders(request.headers.get('Origin')) }
                }
            );
        }

        // Parse response
        const data = await groqResponse.json();
        const generatedText = data.choices[0].message.content;

        // Extract JSON array
        const jsonMatch = generatedText.match(/\[[\s\S]*\]/);

        if (!jsonMatch) {
            return new Response(
                JSON.stringify({ error: 'Invalid response format from AI' }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders(request.headers.get('Origin')) }
                }
            );
        }

        // Parse sentences
        const sentences = JSON.parse(jsonMatch[0]);

        // Validate
        if (!Array.isArray(sentences) || sentences.length === 0) {
            return new Response(
                JSON.stringify({ error: 'No sentences generated' }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders(request.headers.get('Origin')) }
                }
            );
        }

        // Return sentences
        return new Response(
            JSON.stringify(sentences.slice(0, maxSentences)),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(request.headers.get('Origin')) }
            }
        );

    } catch (error) {
        console.error('Error in generateSentences:', error);

        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(request.headers.get('Origin')) }
            }
        );
    }
}

// Health check endpoint
function healthCheck(request) {
    return new Response(
        JSON.stringify({
            status: 'healthy',
            service: 'English Practice API',
            version: '1.0.0'
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders(request.headers.get('Origin')) }
        }
    );
}

// Main handler
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return handleOptions(request);
        }

        // Route requests
        if (url.pathname === '/api/generate-sentences' && request.method === 'POST') {
            return generateSentences(request, env);
        }

        if (url.pathname === '/api/health' && request.method === 'GET') {
            return healthCheck(request);
        }

        // Root endpoint
        if (url.pathname === '/') {
            return new Response(
                JSON.stringify({
                    message: 'English Speaking Practice API',
                    version: '1.0.0',
                    endpoints: {
                        generate_sentences: '/api/generate-sentences (POST)',
                        health: '/api/health (GET)'
                    }
                }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders(request.headers.get('Origin')) }
                }
            );
        }

        // 404 for unknown routes
        return new Response(
            JSON.stringify({ error: 'Not found' }),
            {
                status: 404,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(request.headers.get('Origin')) }
            }
        );
    }
};
