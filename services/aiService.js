import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Text Summarizer
export const textSummarizer = async (text) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes text concisely. Keep summaries under 3 sentences and make them clear and informative.",
        },
        {
          role: "user",
          content: `Summarize this text:\n\n${text}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 150,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    throw new Error("Failed to generate summary");
  }
};

// Sentiment Analysis
export const sentimentAnalysis = async (text) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Analyze the sentiment of the text. Respond with ONLY one word: Positive, Negative, or Neutral. Nothing else.",
        },
        { role: "user", content: text },
      ],
      temperature: 0.1,
      max_tokens: 10,
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    throw new Error("Failed to analyze sentiment");
  }
};

// Extract key points
export const extractKeyPoints = async (text) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'Extract 3 to 5 key points from the text. Return ONLY a JSON array of strings. Each point should be one concise sentence. Example format: ["Point 1", "Point 2", "Point 3"]',
        },
        { role: "user", content: text },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });
    const content = completion.choices[0].message.content.trim();

    // Try to parse JSON first
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, 5);
      }
    } catch (e) {
      // If not JSON, parse as lines
      const points = content
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) =>
          line
            .replace(/^[-•*\d.)\]]\s*/, "")
            .replace(/^["']|["']$/g, "")
            .trim()
        )
        .filter((line) => line.length > 0)
        .slice(0, 5);

      return points;
    }

    return ["Unable to extract key points"];
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    throw new Error("Failed to extract key points");
  }
};

// Get tone/style analysis (bonus feature)
export const toneAnalysis = async (text) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Analyze the tone and writing style of the text. Respond in 1-2 sentences describing the tone (e.g., formal, casual, academic, persuasive, etc.).",
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    throw new Error("Failed to analyze the tone");
  }
};
