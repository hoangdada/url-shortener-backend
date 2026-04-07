import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// my own MongoDB connection string
const dbURI =
  "mongodb+srv://hoanglsd112:963852741the@cluster101.cf6jklw.mongodb.net/url_shortener?appName=Cluster101";

mongoose
  .connect(dbURI)
  .then(() => console.log("Đã kết nối MongoDB thành công!"))
  .catch((err) => console.log("Lỗi kết nối DB: ", err));

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: String,
  clicks: { type: Number, default: 0 },
});

const Url = mongoose.model("Url", urlSchema);

app.post("/api/urls", async (req, res) => {
  // random->chuyển thành hệ 36 (gồm chữ và số)->cut string sau số 0.-> được 6 số
  const randomCode = Math.random().toString(36).substring(2, 8);

  const newUrl = await Url.create({
    originalUrl: req.body.originalUrl,
    shortCode: randomCode,
  });

  res.json(newUrl);
});

app.get("/api/urls", async (req, res) => {
  const urls = await Url.find();
  res.json(urls);
});

app.get("/api/urls/:id", async (req, res) => {
  const url = await Url.findById(req.params.id);
  res.json(url);
});

app.get("/:shortCode", async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.shortCode });

  if (!url) {
    return res.send("Not found");
  }

  url.clicks += 1;
  await url.save();

  res.redirect(url.originalUrl);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
