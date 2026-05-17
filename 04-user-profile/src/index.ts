import { RedisClient } from "bun";
import express from "express";

const app = express();
app.use(express.json());

const redis = new RedisClient(process.env.REDIS_URL || "redis://localhost:6379");

type User = {
    name: string;
    age: number;
}

const parsedUser = (raw: Record<string, string>): User => {
    if (!raw.name) {
    throw new Error("Missing name");
  }

  if (!raw.age) {
    throw new Error("Missing age");
  }
    return {
        name: raw.name,
        age: Number(raw.age)
    }
}

app.post("/user/:id/json", async (req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    return res.json({ savedAs: "json"})
})

app.get("/user/:id/json", async (req, res) => {
    const raw = await redis.get(`user:${req.params.id}:json`);
    return res.json({ user: raw ? JSON.parse(raw) : null})
});

app.post("/user/:id/hash", async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    return res.json({ savedAs: "hash" })
})

app.get("/user/:id/hash", async (req, res) => {
    const rawUser = await redis.hgetall(`user:${req.params.id}:hash`);
    const user = parsedUser(rawUser)

    return res.json({user});
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
});
