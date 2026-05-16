
import { RedisClient } from "bun";
import express from "express";

const app = express();
app.use(express.json())

const redis = new RedisClient(process.env.REDIS_URL || "redis://localhost:6379");

const otpKey = (phone: number) => {
    return `otp:${phone}`
};

app.post("/otp", async (req, res) => {
    const {phone} = req.body;
    const otp = Math.floor(100000 * Math.random() * 900000).toString();
    await redis.set(otpKey(Number(phone)), otp, "EX", 30) // 30s expiry
    res.json({
        "OTP": otp,
    })
});

app.post("/otp/verify", async (req, res) => {
    const { phone, otp } = req.body;
    const savedOtp = await redis.get(otpKey(Number(phone)));
    if (!savedOtp) {
    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }

  if (savedOtp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }
    await redis.del(otpKey(Number(phone)));
    res.json({
        message: "Verification successsful"
    })
} );

app.get("/otp/:phone/ttl", async (req, res) => {
    const ttl = await redis.ttl(otpKey(Number(req.params.phone)))
    res.json({ ttl });
});

app.listen(3000, () => console.log("Server running on port 3000"));