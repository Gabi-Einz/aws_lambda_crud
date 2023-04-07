const serverless = require("serverless-http");
const express = require("express");
const user = require('./src/User');
const anime = require('./src/Anime');
const animeByUser = require('./src/AnimeByUser');

const app = express();

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.use('/', user);
app.use('/', anime);
app.use('/', animeByUser);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
