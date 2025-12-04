const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());


mongoose.connect("mongodb://127.0.0.1:27017/farmguard").then(() => {
  console.log("✅ MongoDB Connected");
});


const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);


app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  
  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ message: "❌ Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });

  res.json({ message: "✅ Signup success" });
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.json({ message: "❌ No user found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "❌ Wrong password" });

  const token = jwt.sign({ email: user.email }, "secret123");

  res.json({
    message: "✅ Login success",
    token,
    user: { name: user.name } 
  });
});


app.post("/detect", (req, res) => {
  const { image } = req.body;

  console.log("📸 Image received for detection");

  res.json({ result: "✅ Healthy Crop Detected" });
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));