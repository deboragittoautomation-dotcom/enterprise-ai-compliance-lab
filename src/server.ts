import express from "express";
import cors from "cors";
import path from "path";
import { executeCompliancePipeline } from "./compliance-pipeline";

const app = express();
const frontendDistPath = path.resolve(process.cwd(), "fronted/dist");
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.options(/.*/, (req, res) => {
  const origin = req.headers.origin;
  const isAllowedOrigin = typeof origin === "string" && allowedOrigins.includes(origin);

  if (isAllowedOrigin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  } else {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  return res.sendStatus(204);
});
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

app.use(express.static(frontendDistPath));

app.post("/api/compliance-check", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      error: "Missing 'text' field",
    });
  }

  const result = executeCompliancePipeline(text);

  return res.json(result);
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
