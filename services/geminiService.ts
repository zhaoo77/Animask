import { GoogleGenAI, Modality } from "@google/genai";

export async function processImageWithAnimalHeads(base64Image: string, mimeType: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error("API Key is not configured. Please set it in the settings.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  // Gemini API expects base64 data without the data URL prefix
  const pureBase64 = base64Image.split(',')[1];
  
  if (!pureBase64) {
      throw new Error("Invalid base64 image data provided.");
  }

  const imagePart = {
    inlineData: {
      data: pureBase64,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: "Analyze the image to identify any human faces. For each face found, replace only the facial area with a cartoon animal head in the distinct artistic style of 'Tom and Jerry'. The generated head must not include a neck. It should be scaled to appropriately cover the person's entire face, from chin to hairline, while seamlessly blending with the original image's hair and shoulders. Crucially, if the person is wearing glasses or has other distinct facial accessories or features (like a mole or a scar), these features must be accurately and comically represented on the new cartoon animal head. The goal is to maintain the original image's lighting and composition while protecting identity. Do not alter any other part of the image.",
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            // The API returns PNG, so we'll use that mime type.
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }

    throw new Error("No image was returned from the API.");

  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("The provided API Key is not valid. Please check your key in the settings.");
    }
    throw new Error("Failed to process the image with the AI model. Please check the console for details.");
  }
}