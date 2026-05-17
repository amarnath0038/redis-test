import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const pub = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


app.post("/notifications",async (req, res) => {
    const payload = {
        title: req.body.title || "Default title",
        createdAt: new Date().toISOString()
    }
    const receivers = pub.publish("notifications", JSON.stringify(payload));
    res.json({
        message: `Notification sent to ${receivers} subscribers`
    })
})

app.listen(3000, () => {
    console.log("Server listening on port 3000")
})