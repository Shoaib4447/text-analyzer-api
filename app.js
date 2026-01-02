import dotenv from "dotenv/config";
import express from "express";
import cors from "cors";
import analyzerRouter from "./routes/textAnalyzer.js";

const app = express();
app.use(express.json());
app.use(cors());

// heathCheck API endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Text Analyzer API is running...",
    status: "healthy",
  });
});

// Text analysis endpoint
app.use("/api", analyzerRouter);

const PORT = process.env.PORT;
app.listen(PORT, (req, res) => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Test the API: POST to http://localhost:${PORT}/api/analyze`);
});
