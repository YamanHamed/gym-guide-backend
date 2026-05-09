const express = require("express");
const router = express.Router();

// POST /api/chat - AI fitness coach
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error: "Message is required",
      type: "invalid_request_error",
    });
  }

  try {
    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai", // can also use openai-fast, claude, gemini, deepseek, llama
        messages: [
          {
            role: "system",
            content: `You are a helpful gym coach and fitness guide. Keep responses concise (2-3 sentences) and practical. Focus ONLY on exercises, nutrition, form, motivation, and general fitness. If asked about topics unrelated to fitness (e.g., politics, history, entertainment), politely decline and redirect to fitness.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pollinations API Error:", response.status, errorText);
      if (response.status === 429) {
        return res.status(429).json({
          error: "Rate limit exceeded. Please try again in a moment.",
          type: "rate_limit_error",
        });
      }
      if (response.status === 403) {
        return res.status(403).json({
          error: "Access denied. The service might be temporarily unavailable.",
          type: "access_error",
        });
      }
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "I'm here to help with your fitness goals!";
    res.json({ reply });
  } catch (error) {
    console.error("Pollinations API Error:", error);
    res.status(500).json({
      error: "AI Coach is temporarily offline. Please try again.",
      type: "connection_error",
    });
  }
});

module.exports = router;
