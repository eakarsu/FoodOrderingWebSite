// OpenAI integration for AI recommendations
export interface RecommendationRequest {
  preferences?: string;
  previousOrders?: string;
}

export interface AIRecommendation {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  reason: string;
  category: string;
}

export async function getAIRecommendations(request: RecommendationRequest): Promise<AIRecommendation[]> {
  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to get recommendations');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    // Return empty array on error
    return [];
  }
}
