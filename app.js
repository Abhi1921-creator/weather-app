const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Serve static files like CSS from "public" folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Your OpenWeatherMap API key here
const apiKey = "bb0f83606399e1f72e207c5eebfea377";

// Serve the home page (index.html from your project folder)
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// Handle the weather form submission
app.post("/", function (req, res) {
    const city = req.body.cityName;
    const unit = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

    https.get(url, function (response) {
        let data = "";

        response.on("data", function (chunk) {
            data += chunk;
        });

        response.on("end", function () {
            const weatherData = JSON.parse(data);

            // Check if city is found
            if (weatherData.cod === "404") {
                res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>City Not Found</title>
                        <link rel="stylesheet" href="/styles.css">
                    </head>
                    <body>
                        <h1>❌ City not found</h1>
                        <a href="/">Go Back</a>
                    </body>
                    </html>
                `);
                return;
            }

            // Extract weather info
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            // Send a styled HTML response
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Weather Result</title>
                    <link rel="stylesheet" href="/styles.css">
                </head>
                <body>
                    <div class="weather-result">
                        <h1>The temperature in ${city} is ${temp}°C</h1>
                        <p>Weather description: ${description}</p>
                        <img src="${imgURL}" alt="Weather icon">
                        <br><br>
                        <a href="/">Check another city</a>
                    </div>
                </body>
                </html>
            `);
        });
    });
});

app.listen(port, function () {
    console.log(`✅ Server is running on port ${port}`);
});
