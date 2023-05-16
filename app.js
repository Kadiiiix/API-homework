const Winston = require("winston");
const https = require("https");
const express = require("express");
const NodeCache = require("node-cache");

const app = express();

const port = 3000;
const key = "2121a1d58e7f8d6a40f2e47a291f2308";
const myCache = new NodeCache();
//takes yyyy-mm-dd format and converts it to unix format requested by api
function UnixTime(date) {
  date = new Date(date);
  const UnixTime = Date.parse(date) / 1000;
  return UnixTime;
}

//creates a log file
const log = Winston.createLogger({
  transports: [
    new Winston.transports.File({
      filename: "C:/Users/PC/Desktop/api/app.log",
    }),
  ],
});

// Endpoint for retrieving current weather conditions
app.get("/weather/current", (req, res) => {
  try {
    const location = req.query.location; // Retrieve the location from the query string
    if (!location) {
      return res.status(400).json({
        error: "400 Bad Request error location parameter is required",
      });
    }
    const cachedData = myCache.get(location);
    if (cachedData) {
      console.log("cache:", cachedData);
      res.json({ cachedData, message: "cache" });
    } else {
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
          myCache.set(location, weatherData, 120);
          console.log(weatherData);
          log.info(weatherData);
          res.send({ location: location, weatherData });
        });
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "error, can't retreive current weather" });
  }
});

// Endpoint for retrieving weather forecast
app.get("/weather/forecast", (req, res) => {
  try {
    const location = req.query.location;
    if (!location) {
      return res.status(400).json({
        error: "400 Bad Request error location parameter is required",
      });
    }
    const cachedData = myCache.get(location);
    if (cachedData) {
      console.log("cache:", cachedData);
      res.json({ cachedData, message: "cache" });
    } else {
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
          myCache.set(location, weatherData, 120);
          console.log(weatherData);
          log.info(weatherData);

          res.send({
            location: location,
            weatherData,
          });
        });
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "error, can't retreive forecast" });
  }
});

// Endpoint for retrieving historical weather data
app.get("/weather/history", async (req, res) => {
  try {
    const location = req.query.location; // Retrieve the location from the query string
    const startDate = UnixTime(req.query.startDate); // Retrieve the start date from the query string
    const endDate = UnixTime(req.query.endDate); // Retrieve the end date from the query string
    if (!location) {
      return res.status(400).json({
        error: "400 Bad Request error location parameter is required",
      });
    }
    if (!startDate || !endDate) {
      return res.status(400).json({
        error: "400 Bad start and end dates are required",
      });
    }
    const cachedData = myCache.get(location);
    if (cachedData) {
      console.log("cache:", cachedData);
      res.json({ cachedData, message: "cache" });
    } else {
      //secondary api for getting longitude and latitude info
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
        let weatherData = "";
        response.on("data", function (data) {
          weatherData += data;
        });
        response.on("end", function () {
          const parsedWeatherData = JSON.parse(weatherData);
          myCache.set(location, parsedWeatherData, 120);
          console.log(parsedWeatherData);
          log.info(parsedWeatherData);
          res.send({
            lattitude: la,
            longitude: lo,
            location: location,
            parsedWeatherData,
          });
        });
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "error, can't retreive forecast" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});

// Start the server
app.listen(port, () => {
  console.log("Server started on port" + port);
});
