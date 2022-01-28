const app = require("express")();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Working" });
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
