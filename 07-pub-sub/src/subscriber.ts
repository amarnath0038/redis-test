import { Redis } from "ioredis";

const sub = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

sub.subscribe("notifications", (err) => {
    if (err) {
        console.log("Failed to subscribe", err);
        return;
    }
    console.log("Subscribed successfully");
});

sub.on("message", (channel, message) => {
    console.log("Received on ", channel, JSON.parse(message));
})