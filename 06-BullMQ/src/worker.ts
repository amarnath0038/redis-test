import { Worker } from "bullmq";
import { connection } from "./queue";

const worker = new Worker(
    "emails",
    async (Job) => {
        console.log("Processing email job",Job.id, Job.name, Job.data);
        await new Promise((resolve) => setTimeout(resolve, 1500)),
        console.log("Email job completed",Job.id, Job.name, Job.data);
    },
    { connection }
);

worker.on("completed", (job) => {
    console.log("Job complted", job.id, job.name, job.data);
})

worker.on("failed",(job, err) => {
    console.log("JOb failed, job.id, job.name,job.data,err");
})