const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/searchPlaces", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const keyword = req.query.keyword;
  const location = req.query.location || "India";

  if (!keyword) {
    return res.status(400).json({ error: "keyword required" });
  }

  const API_KEY = process.env.GOOGLE_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    keyword + " in " + location
  )}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const results = data.results.map(p => ({
      business: p.name,
      address: p.formatted_address,
      rating: p.rating || null,
      reviews: p.user_ratings_total || 0,
      category: p.types?.[0] || ""
    }));

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
