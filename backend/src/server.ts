import express from "express";
import {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNodeHttpEndpoint,
} from "@copilotkit/runtime";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import cors from "cors";
import newsRouter from "./routes";
import { errorHandler } from "./middleware/errorHandler.ts";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const serviceAdapter = new GroqAdapter({ groq, model: "llama3-8b-8192" });

app.use("/api", newsRouter);

app.use("/api/copilotkit", (req: any, res, next) => {
  const runtime = new CopilotRuntime();
  const handler = copilotRuntimeNodeHttpEndpoint({
    endpoint: "/copilotkit",
    runtime,
    serviceAdapter,
  });

  return handler(req, res, next);
});

app.use(errorHandler as any);

app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
