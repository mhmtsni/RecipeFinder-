const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const protectRoutes = require("./middleware/jwtprotection");
dotenv.config({ path: "./config/.env" });

const server = express();

connectDB();

const User = require("./models/User");
const Bookmark = require("./models/Bookmark");

server.use(express.json());

server.get("/", (req, res) => {
  res.send({ status: "Started" });
});
server.use("/:id/bookmarks/add", protectRoutes);
server.use("/:id/bookmarks", protectRoutes);
server.use("/:id/bookmarks/delete", protectRoutes);

server.post("/register", async (req, res) => {
  const { mail, password } = await req.body;
  console.log(mail, password);
  try {
    const oldUser = await User.findOne({ mail });

    if (oldUser) {
      return res.status(401).send({ data: "User already exists" });
    }

    const user = await User.create({
      mail,
      password,
    });
    const token = await sendTokenResponse(user);
    user.token = await token;
    res.send({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", data: error.message });
  }
});
server.post("/login", async (req, res) => {
  try {
    const { mail, password } = await req.body;
    console.log(mail, password);

    if (!mail || !password) {
      return res
        .status(401)
        .send({ error: "Please enter an email and a password" });
    }
    const user = await User.findOne({ mail });

    const isMatch = await user.matchPassword(password);
    console.log(isMatch);
    if (isMatch) {
      const token = sendTokenResponse(user);
      console.log(token);
      user.token = await token;
      return res.status(200).send({ success: true, user });
    } else {
      return res.status(404).send({ error: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
  }
});
server.get("/:id/bookmarks", async (req, res) => {
  try {
    const userIdFromToken = await req.user.id;
    const userIdFromParams = req.params.id;
    if (userIdFromToken !== userIdFromParams) {
      return res.status(401).json("Forbidden");
    }

    const userBookmarks = await Bookmark.find({ user: userIdFromParams });
    return res.status(200).send({ success: true, bookmarks: userBookmarks });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});
server.post("/:id/bookmarks/add", async (req, res) => {
  try {
    const userIdFromToken = await req.user.id;
    const userIdFromParams = req.params.id;
    const { image_url, title, identification } = await req.body;
    const oldBookmark = await Bookmark.findOne({ title });
    if (oldBookmark) {
      return res
        .status(400)
        .send({ success: false, error: "Bookmark is present" });
    }
    if (userIdFromToken !== userIdFromParams) {
      return res.status(401).json("Forbidden");
    }
    const bookmark = await Bookmark.create({
      user: userIdFromParams,
      image_url,
      title,
      identification,
    });
    console.log(bookmark);
    return res.status(200).send({ success: true, bookmark });
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: "Invalid Credentials" });
  }
});
server.delete("/:id/bookmarks/delete/:bookmarkId", async (req, res) => {
  try {
    const userIdFromToken = req.user.id;
    const userIdFromParams = req.params.id;
    const bookmarkId = req.params.bookmarkId;

    if (userIdFromToken !== userIdFromParams) {
      return res.status(401).json("Forbidden");
    }

    const deletedBookmark = await Bookmark.findById(bookmarkId);
    if (!deletedBookmark) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    await Bookmark.deleteOne({ _id: bookmarkId });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
const sendTokenResponse = (user) => {
  const token = user.getSignedJwt();
  return token;
};
server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
