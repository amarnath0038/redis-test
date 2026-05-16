import { RedisClient } from "bun";
import express from "express";
import mongoose from "mongoose";

const app = express();

const redis = new RedisClient(process.env.REDIS_URL || "redis://localhost:6379");


app.get("/redis",async (req, res) => {
    const response = await redis.ping();
    res.json({
        message: "redis success"
    })
});

app.get("/mongo", async (req, res) => {
    const url = process.env.MONGO_URL || "mongodb://localhost:27017/learning_redis";
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(url);
    }
    res.json({
        mongodb: "connected",
        dbName: mongoose.connection.name
    })
})

app.listen(3000, () => console.log("Server running on port 3000"))