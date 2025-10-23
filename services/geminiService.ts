export async function processImageWithAnimalHeads(base64Image: string, mimeType: string): Promise<string> {
  const response = await fetch('/api/process-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageDataUrl: base64Image, mimeType }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to process the image with the AI model. Please try again later.';
    try {
      const errorBody = await response.json();
      if (errorBody?.error) {
        errorMessage = errorBody.error;
      }
    } catch (err) {
      console.error('Failed to parse error response from /api/process-image', err);
    }

    throw new Error(errorMessage);
  }

  const data: { imageData?: string } = await response.json();
  if (!data?.imageData) {
    throw new Error('The server did not return processed image data.');
  }

  return data.imageData;
}
