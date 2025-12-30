const textAnalyzer = (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: "Text is required",
      });
    }
    console.log("📥 Received request body:", req.body);
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

    res.json({
      success: true,
      analysis: {
        wordCount,
        charCount,
        charCountNoSpaces,
        sentenceCount,
        paragraphCount,
        averageWordLength: parseFloat(averageWordLength),
        estimatedReadingTimeMinutes: readingTime,
      },
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
