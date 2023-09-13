const express = require("express");
const cookieparser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cookieparser());

app.get("/", (req, res) => {
  res.send("hello asif bhai");
});

app.get("/setcookie", (req, res) => {
  const sessionid = uuidv4();
  res.cookie(`sid`, sessionid, {
    maxAge: 60*60*24*7,
    // expires works the same as the maxAge
    //expires: new Date("12 3 2024"),
    secure: true,
    httpOnly: true,
    sameSite: "lax",
  });
  res.send("Cookie have been saved successfully");
});

app.get("/displaycookies", (req, res) => {
  res.send(req.cookies);
});

app.get("/clearcookies", (req, res) => {
  const cookies = req.cookies;

  for (const cookieName in cookies) {
    res.clearCookie(cookieName);
  }

  res.send("All cookies cleared.");
});

app.listen(4000, () => {
  console.log("Server listening");
});
