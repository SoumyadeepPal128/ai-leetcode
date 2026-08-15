import "dotenv/config";
import express from "express";
import connectDB from "./db/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import executeRouter from "./routes/execute.routes.js";
import generateRouter from "./routes/generate.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/execute", executeRouter);
app.use("/api/generate", generateRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB, server not started:", err);
    process.exit(1);
  });