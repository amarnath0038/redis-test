import { RedisClient } from "bun";
import express from "express";

const app = express();
app.use(express.json());

const redis = new RedisClient(process.env.REDIS_URL || "redis://localhost:6379");


