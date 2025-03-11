const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Velkommen til Chatbot-serveren!");
});

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).send({ error: "Ingen besked sendt" }); // Bedre fejlhåndtering
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }],
                max_tokens: 100,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            },
        );

        // Sørg for at sende svaret tilbage korrekt, hvis API'en returnerer et resultat
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Fejl med OpenAI API:", error.response ? error.response.data : error.message); // Log detaljer
        res.status(500).send({ error: "Fejl med OpenAI API" }); // Returner fejlinformation til klienten
    }
});

app.listen(port, () => {
    console.log(`Server kører på http://localhost:${port}`);
});