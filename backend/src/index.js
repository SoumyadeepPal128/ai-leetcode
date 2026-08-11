import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import executeRouter from "./routes/execute.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/execute", executeRouter);

// MUST be last
app.use(errorHandler);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});