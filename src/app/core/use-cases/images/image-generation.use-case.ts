import { environment } from 'environments/environment';
type GeneratedImage = Image | null;
interface Image {
  url: string;
  alt: string;
}
export const imageGenerationuseCase = async (
  prompt: string,
  originalImage?: string,
  maskImage?: string
): Promise<GeneratedImage> => {
  try {
    const response = await fetch(`${environment.backendApi}/image-generation`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        originalImage,
        maskImage,
      }),
    });

    const { url, revised_prompt: alt } = await response.json();
    return { url, alt };
  } catch (error) {
    console.log(error);
    return null;
  }
};
