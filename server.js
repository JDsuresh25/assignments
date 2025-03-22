const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "mysecretkey";

const users = [{ username: "admin", password: "password" }];

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/dashboard", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "User not logged in" });

  try {
    jwt.verify(authHeader, SECRET_KEY);
    res.json([{ id: 1, title: "View Map of India" }]);
  } catch {
    res.status(401).json({ message: "User not logged in" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
