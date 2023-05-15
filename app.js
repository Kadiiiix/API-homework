const express = require("express");
const app = express();

const port = 3000;
const https = require("https");
const key = "2121a1d58e7f8d6a40f2e47a291f2308";

// Endpoint for retrieving current weather conditions
app.get("/weather/current", (req, res) => {
  const location = req.query.location; // Retrieve the location from the query string
  const api =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    location +
    "&appid=" +
    key +
    "&units=metric";
  console.log(api);
  https.get(api, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      //const temperature = weatherData.main.temp;
      console.log(weatherData);

      res.send({
        //current: "Temperature is " + temperature,
        loc: "Location is " + location,
      });
    });
  });
});

// Endpoint for retrieving weather forecast
app.get("/weather/forecast", (req, res) => {
  const location = req.query.location;
  const api =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    location +
    "&appid=" +
    key +
    "&units=metric";
  console.log(api);
  https.get(api, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      //const temperature = weatherData.main.temp;
      console.log(weatherData);

      res.send({
        //current: "Temperature is " + temperature,
        loc: "Location is " + location,
      });
    });
  });
});

// Endpoint for retrieving historical weather data
app.get("/weather/history", async (req, res) => {
  const location = req.query.location; // Retrieve the location from the query string
  const startDate = req.query.startDate; // Retrieve the start date from the query string
  const endDate = req.query.endDate; // Retrieve the end date from the query string

  const link =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    location +
    "&appid=" +
    key;

  const Res = await fetch(link);
  const data = await Res.json();
  const la = data[0].lat;
  const lo = data[0].lon;

  const api =
    "https://history.openweathermap.org/data/2.5/history/city?lat=" +
    la +
    "&lon=" +
    lo +
    "&appid=" +
    key +
    "&start=" +
    startDate +
    "&end=" +
    endDate +
    "&units=metric";
  console.log(api);

  https.get(api, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      console.log(weatherData);

      res.send({
        loc: "Location is " + location,
      });
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});

// Start the server
app.listen(port, () => {
  console.log("Server started on port 3000");
});
