import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/weather", async (req, res) => {
    try {
        const city = req.body.cityName;
        const apiid = "insert api key of openweathermap.org";
        const API_URL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiid;
        const response= await axios.get(API_URL);
        const result = response.data;
        const icon = result.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        const longitude = result.coord.lon;
        const latitude = result.coord.lat;
        const UV_API_URL = "https://api.open-meteo.com/v1/forecast?latitude="+latitude+"&longitude="+longitude+"&daily=uv_index_max,uv_index_clear_sky_max&timezone=auto&forecast_days=1";
        const response2 = await axios.get(UV_API_URL);
        const result2 = response2.data;
        res.render("weather.ejs", {data: result, image: imageURL, uvdata: result2.daily.uv_index_max});
    } catch(error){
      console.error("Failed to make request:", error.message);
      res.render("weather.ejs", {error: "Nothing to Display, Please try agin later or contact the developer."});
    }
  });

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
