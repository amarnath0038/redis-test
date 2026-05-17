import { RedisClient } from "bun";
import express from "express";

const app =express();
app.use(express.json());

const redis = new RedisClient(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

app.post("/emails", async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject || "NO subject",
        body: req.body.body || "NO content",
        createdAt: new Date().toISOString()
    }
    await redis.lpush(QUEUE_KEY, JSON.stringify(job))
    return res.json({
        queued: true,
        job: job
    })
});


app.get("/emails/process-one", async (req, res) => {
    const rawJob = await redis.rpop(QUEUE_KEY);
    if (!rawJob) {
        return res.json({
            message: "NO jobs in queue"
        })
    }
    const job = JSON.parse(rawJob);
    return res.json({
        message: "Email sent",
        job: job
    })
});

app.listen(3000, () => {
    console.log("Server running on port 3000")
});
