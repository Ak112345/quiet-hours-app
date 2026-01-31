import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ContentPrompt {
  series: string;
  contentType: 'reel' | 'carousel';
  theme?: string;
}

export interface GeneratedContent {
  caption: string;
  aiPrompt: string;
  visualDescription: string;
}

const seriesPrompts = {
  POV: 'Create a POV (point of view) style Instagram post caption. The content should be relatable, conversational, and use second-person perspective to connect with the audience.',
  soft_life: 'Create a soft life aesthetic Instagram post caption. Focus on wellness, mindfulness, gentle living, and peaceful moments. Use calming, soothing language.',
  truth_bombs: 'Create a truth bomb Instagram post caption. Share a powerful, thought-provoking insight or reality check. Be direct, impactful, and memorable.',
};

export async function generateContent(prompt: ContentPrompt): Promise<GeneratedContent> {
  const basePrompt = seriesPrompts[prompt.series as keyof typeof seriesPrompts] || seriesPrompts.soft_life;
  
  const systemMessage = `You are an expert social media content creator specializing in Instagram content. 
Generate engaging captions that are authentic, relatable, and optimized for Instagram.
${basePrompt}
${prompt.contentType === 'carousel' ? 'This is for a multi-image carousel post.' : 'This is for a reel/video post.'}
${prompt.theme ? `Theme/topic: ${prompt.theme}` : ''}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: 'Generate an Instagram caption and a detailed visual description for the content.',
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Parse the response to extract caption and visual description
    const lines = response.split('\n\n');
    const caption = lines[0] || response;
    const visualDescription = lines[1] || 'Calm, aesthetic visual content';

    return {
      caption: caption.trim(),
      aiPrompt: systemMessage,
      visualDescription: visualDescription.trim(),
    };
  } catch (error) {
    console.error('Error generating content:', error);
    // Return fallback content
    return {
      caption: `${prompt.series} content - ${prompt.theme || 'Daily inspiration'}`,
      aiPrompt: systemMessage,
      visualDescription: 'Aesthetic visual content with calm colors',
    };
  }
}

export async function generateBatch(series: string, count: number = 5): Promise<GeneratedContent[]> {
  const promises = Array.from({ length: count }, () =>
    generateContent({ series, contentType: 'reel' })
  );
  return Promise.all(promises);
}
