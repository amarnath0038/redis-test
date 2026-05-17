import express from "express";
import { emailQueue } from "./queue";

const app = express();
app.use(express.json());

app.post("/welcome-email", async (req, res) => {
    const job = emailQueue.add(
        "send-welcome-email",
        {
            to: req.body.to,
            name: req.body.name || "Learner"
        },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000
            }
        }
    );
    res.json({
        message: "Welcome email job added"
    })
})

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

