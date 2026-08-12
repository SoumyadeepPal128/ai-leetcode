import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config({
  path: "./.env",
});
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// MUST be last
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// Only start listening for requests AFTER the DB connection succeeds.
// This avoids a race condition where a request comes in before Mongo
// is ready.
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