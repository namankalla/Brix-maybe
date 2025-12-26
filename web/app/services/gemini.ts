// app/services/gemini.ts
import 'server-only';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function generateText(prompt: string) {
  try {
    console.log('Calling Gemini API with prompt:', prompt);
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing GEMINI_API_KEY. Set it in your environment (.env.local) and restart the dev server.');
    }

    const redactedKey = apiKey.length <= 8 ? '***' : `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
    console.log('Gemini API key loaded (redacted):', redactedKey);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response data:', data);
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('No text in Gemini response:', data);
      throw new Error('No valid response from Gemini');
    }
    
    return text;
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    throw error;
  }
}