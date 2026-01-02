import {
  extractKeyPoint,
  sentimentAnalysis,
  textSummerizer,
  toneAnalysis,
} from "../services/aiService";

const textAnalyzer = async (req, res) => {
  try {
    const { text, includeAI } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    // Analysis calculations
    const wordCount = text.trim().split(/\s+/).length;
    const charCount = text.trim().length;
    const charCountNoSpaces = text.replace(/\s/g, "").length;
    const sentenceCount = text
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;
    const paragraphCount = text
      .split(/\n\n+/)
      .filter((p) => p.trim().length > 0).length;
    const averageWordLength = (charCountNoSpaces / wordCount).toFixed(2);
    const readingTime = Math.ceil(wordCount / 200);

    const analysis = {
      wordCount,
      charCount,
      charCountNoSpaces,
      sentenceCount,
      paragraphCount,
      averageWordLength: parseFloat(averageWordLength),
      estimatedReadingTimeMinutes: readingTime,
    };

    // AI analysis (if requested and text is long enough)
    if (includeAI && wordCount >= 20) {
      console.log("🤖 Running AI analysis with OpenAI...");
      try {
        // Run all AI functions in parallel for speed
        const [summary, sentiment, keyPoints, tone] = await Promise.all([
          textSummerizer(text),
          sentimentAnalysis(text),
          extractKeyPoint(text),
          toneAnalysis(text),
        ]);

        analysis.ai = {
          summary,
          sentiment,
          keyPoints,
          tone,
        };
        console.log("✅ AI analysis complete");
      } catch (aiError) {
        console.error("AI analysis failed:", aiError.message);
        analysis.ai = {
          error: "AI analysis failed. Please try again.",
        };
      }
    } else if (includeAI && wordCount < 20) {
      analysis.ai = {
        error:
          "Text too short for AI analysis. Please enter at least 20 words.",
      };
    }
    res.json({
      success: true,
      analysis,
      text: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Server Error => ${error}`,
    });
  }
};

export { textAnalyzer };
