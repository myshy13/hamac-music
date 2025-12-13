import express from "express";
import path, { join } from "node:path";
import * as fs from "node:fs";

const __dirname = import.meta.dirname || path.dirname(__filename);

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/songs", (req, res) => {
  fs.readFile(path.join(__dirname, "songs/songs.json"), "utf8", (err, data) => {
    if (err) {
      res.set("Content-Type", "application/json");
      res
        .status(501)
        .send(
          JSON.stringify({ error: "Internal server error: " + err.message })
        );
    } else {
      res.set("Content-Type", "application/json");
      res.send(data);
    }
});
});

app.get("/api/songs/:song", (req, res) => {
  const song = req.params["song"];
  if (song.includes(".")) {
    res.sendFile(join(__dirname, "/songs", song));
  } else {
    // If the song does not include a file extension, search for it
    const files = fs.readdirSync(join(__dirname, "songs"));
    const match = files.find((f) => f.split(".")[0] === song);
    if (match) {
      res.sendFile(join(__dirname, "songs", match));
    } else {
      res.status(404).send("Song not found");
    }
  }
});

app.get("/api/songs/search/:name", (req, res) => {
  const query = req.params["name"].toLowerCase();
  fs.readdir(path.join(__dirname, "songs"), (err, files) => {
    if (err) {
      res.set("Content-Type", "application/json");
      res
        .status(501)
        .send(
          JSON.stringify({ error: "Internal server error: " + err.message })
        );
    } else {
      const results = files
        .filter((file) => file.toLowerCase().includes(query))
        .map((file) => ({
          name: file.split(".")[0],
          url: `api/songs/${file}`,
        }));
      res.set("Content-Type", "application/json");
      res.send(JSON.stringify(results));
    }
  });
});

app.get("/api/songs/info/:song", (req, res) => {
  const song = req.params["song"];
  const dataFile = JSON.parse(
    fs.readFileSync(join(__dirname, "/songs/songs.json"), "utf8")
  );

  for (let i = 0; i < dataFile.songs.length; i++) {
    const el = dataFile.songs[i];
    if (el.title.includes(song)) {
      res.set("Content-Type", "application/json");
      res.send(el);
    }
  }
  res.send(`{"title": false,
            "artist": "Unknown",
            "album": "Unknown",
            "year": "${new Date().getFullYear()}",
            "genre": "Unknown",
            "file": "${song}"}`);
});

app.use(function (req, res) {
  fs.readFile(path.join(__dirname, req.url), (err, data) => {
    if (err) {
      res.set("Content-Type", "application/json");
      res.status(404).send("File not found");
    } else {
      res.send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
