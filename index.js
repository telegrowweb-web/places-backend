const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Health check
app.get("/", (req, res) => {
  res.send("Places API is running 🚀");
});

// FREE search endpoint
app.get("/searchPlaces", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const keyword = req.query.keyword;
  const location = req.query.location || "India";

  if (!keyword) {
    return res.status(400).json({ error: "keyword is required" });
  }

  const query = `${keyword} in ${location}`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}&limit=15`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "places-backend-free"
      }
    });

    const data = await response.json();

    const results = data.map(p => ({
      name: p.display_name.split(",")[0],
      full_address: p.display_name,
      latitude: p.lat,
      longitude: p.lon,
      source: "OpenStreetMap"
    }));

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
