import { RedisClient } from "bun";
import express from "express"
import type { Request, Response } from "express";

const app = express();
app.use(express.json());

const redis = new RedisClient(
  process.env.REDIS_URL || "redis://localhost:6379"
);

const BANNER_KEY = "app:banner";

app.post("/banner", async (req: Request, res: Response) => {
  const { message } = req.body as { message?: string };

  await redis.set(BANNER_KEY, message || "Welcome to redis learning");

  res.json({
    success: true,
  });
});

app.get("/banner", async (_req: Request, res: Response) => {
  const banner = await redis.get(BANNER_KEY);

  res.json({
    success: true,
    data: banner,
  });
});

app.delete("/banner", async (_req: Request, res: Response) => {
  await redis.del(BANNER_KEY);

  res.json({
    success: true,
  });
});

app.get("/banner/exists", async (_req: Request, res: Response) => {
  const exists = await redis.exists(BANNER_KEY);
  console.log("exists: ", exists)
  console.log(typeof exists);
  res.json({
    success: true,
    exists: Boolean(exists),
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});