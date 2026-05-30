const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { message, name, email } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  const text = `New message from ${name || "Anonymous"} (${email || "no email"}):\n${message}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: "Markdown",
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Telegram API error");
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;
