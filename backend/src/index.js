import express from "express";

const app = express();

app.use(express.json()); // lets us read JSON request bodies via req.body

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});