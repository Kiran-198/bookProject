const express = require("express");

const app = express();
const PORT = 3000;

app.get("/open-book/:id", (req, res) => {
  const bookId = req.params.id;
  res.redirect(`bookapp://book/${bookId}`);
});

app.get("/book/:id", (req, res) => {
  const bookId = req.params.id;
  res.send(`Open Book with ID: ${bookId}`);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
