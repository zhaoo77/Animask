export const runtime = 'edge';

const GEMINI_MODEL = 'gemini-2.5-flash-image';
const PROMPT = "Analyze the image to identify any human faces. For each face found, replace only the facial area with a cartoon animal head in the distinct artistic style of 'Tom and Jerry'. The generated head must not include a neck. It should be scaled to appropriately cover the person's entire face, from chin to hairline, while seamlessly blending with the original image's hair and shoulders. Crucially, if the person is wearing glasses or has other distinct facial accessories or features (like a mole or a scar), these features must be accurately and comically represented on the new cartoon animal head. The goal is to maintain the original image's lighting and composition while protecting identity. Do not alter any other part of the image.";

function jsonResponse(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed. Use POST.' }, { status: 405 });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured.');
      return jsonResponse({ error: 'Server configuration error. Please contact the administrator.' }, { status: 500 });
    }

    let body: { imageDataUrl?: string; mimeType?: string };
    try {
      body = await request.json();
    } catch (err) {
      console.error('Failed to parse request body', err);
      return jsonResponse({ error: 'Invalid JSON payload.' }, { status: 400 });
    }

    const { imageDataUrl, mimeType } = body ?? {};
    if (!imageDataUrl || !mimeType) {
      return jsonResponse({ error: 'Both imageDataUrl and mimeType are required.' }, { status: 400 });
    }

    const commaIndex = imageDataUrl.indexOf(',');
    const base64Data = commaIndex >= 0 ? imageDataUrl.slice(commaIndex + 1) : imageDataUrl;
    if (!base64Data) {
      return jsonResponse({ error: 'Invalid image data provided.' }, { status: 400 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { data: base64Data, mimeType } },
              { text: PROMPT },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['IMAGE'],
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', response.status, errorText);
      return jsonResponse({ error: 'Image generation failed. Please try again later.' }, { status: response.status });
    }

    const result = await response.json();
    const inlineData = result?.candidates?.[0]?.content?.parts?.find((part: any) => part?.inlineData)?.inlineData;

    if (!inlineData?.data) {
      console.error('Unexpected Gemini response payload:', JSON.stringify(result));
      return jsonResponse({ error: 'No image data received from Gemini.' }, { status: 502 });
    }

    const imageData = `data:image/png;base64,${inlineData.data}`;
    return jsonResponse({ imageData });
  } catch (error) {
    console.error('Unexpected error in process-image handler:', error);
    return jsonResponse({ error: 'Unexpected server error. Please try again.' }, { status: 500 });
  }
}
