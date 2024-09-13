import { environment } from 'environments/environment';

export const createThreadUseCase = async () => {
  try {
    const resp = await fetch(`${environment.assitantApi}/create-thred`, {
      method: 'POST',
    });
    const { id } = (await resp.json()) as { id: string };
    return id;
  } catch (err) {
    throw new Error('Error creating thread ID');
  }
};
