import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const scores = [
  { value: "Amar", score: 1250 },
  { value: "Rahul", score: 2100 },
  { value: "Priya", score: 1890 },
  { value: "Sneha", score: 1725 },
  { value: "Arjun", score: 980 },
  { value: "Kiran", score: 1560 },
  { value: "Neha", score: 1430 },
  { value: "Vikram", score: 2015 },
  { value: "Ananya", score: 1675 },
  { value: "Rohit", score: 1340 },
];

const exists = await redis.exists("leaderboard");
if (!exists) {
    await redis.zadd("leaderboard",...scores.flatMap((item) => [item.score, item.value]));
}



app.post("/post/:id/view", async (req, res) => {
    const userId = req.params.id;
    const newScore = await redis.zincrby("leaderboard",1,userId);
    res.json({
        user: userId,
        score: Number(newScore)
    })
});

app.post("/leaderboard/score", async (req, res) => {
    const {userId, score} = req.body;
    const newScore = await redis.zincrby("leaderboard", score, userId);
    res.json({
        user: userId,
        score: Number(newScore)
    })
})

app.get("/leaderboard", async (req, res) => {
    const data = await redis.zrevrange("leaderboard",0, -1, "WITHSCORES");

    const leaderboard = [];

    for (let i = 0; i < data.length; i += 2) {
        const user = data[i];
        const score = Number(data[i + 1]);
        leaderboard.push({
            user: user,
            score: score
        })
    }
    res.json({
        leaderboard
    })
})

app.get("/leaderboard/:id/rank", async (req, res) => {
    const userId = req.params.id;
    const userRank = await redis.zrevrank("leaderboard", userId);
    res.json({
        user: userId,
        rank: userRank !== null ? userRank + 1 : null
    })
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
})

