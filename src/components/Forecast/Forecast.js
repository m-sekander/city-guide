import "./Forecast.scss";
import { useState } from "react";
import expansionIcon from "../../assets/images/chevron_right-24px.svg";

function Forecast({ weatherData, expansion, setExpansion }) {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Converts wind direction from a degree to compass value
  function formatWindDir(dir) {
    if (dir > 22.5 && dir < 67.5) {
      return "NE";
    } else if (dir >= 67.5 && dir <= 112.5) {
      return "E";
    } else if (dir > 112.5 && dir < 157.5) {
      return "SE";
    } else if (dir >= 157.5 && dir <= 202.5) {
      return "S";
    } else if (dir > 202.5 && dir < 247.5) {
      return "SW";
    } else if (dir >= 247.5 && dir <= 292.5) {
      return "W";
    } else if (dir > 292.5 && dir < 337.5) {
      return "NW";
    } else {
      return "N";
    }
  }

  // Converts epoch times to required format
  function formatEpoch(timestamp, type, index) {
    const date = new Date(timestamp * 1000);
    const dayConversions = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
    };

    if (type === "time") {
      if (date.getHours() === 0) {
        if (date.getMinutes() < 10) {
          return `12:0${date.getMinutes()}am`;
        }
        return `12:${date.getMinutes()}am`;
      } else if (date.getHours() === 12) {
        if (date.getMinutes() < 10) {
          return `12:0${date.getMinutes()}pm`;
        }
        return `12:${date.getMinutes()}pm`;
      } else if (date.getHours() < 12) {
        if (date.getMinutes() < 10) {
          return `${date.getHours()}:0${date.getMinutes()}am`;
        }
        return `${date.getHours()}:${date.getMinutes()}am`;
      } else {
        if (date.getMinutes() < 10) {
          return `${date.getHours() - 12}:0${date.getMinutes()}pm`;
        }
        return `${date.getHours() - 12}:${date.getMinutes()}pm`;
      }
    } else if (type === "day") {
      if (index === 0) {
        return "Tomorrow";
      } else {
        return dayConversions[date.getDay()];
      }
    }
  }

  function expandForecast(index) {
    setButtonDisabled(true);

    setTimeout(() => {
      setButtonDisabled(false);
    }, 1500);

    const updatedExpansion = [...expansion];
    updatedExpansion[index] = !updatedExpansion[index];

    return setExpansion(updatedExpansion);
  }

  return (
    <>
      <h2 className="forecast__title">Forecast</h2>
      <div className="forecast">
        <div className="forecast__current">
          <h3 className="forecast__current-day">Today</h3>
          <div className="forecast__current-temps">
            <label className="forecast__label forecast__current-temp">
              Current:
              <span className="forecast__current-temp">
                {weatherData.weatherArr[0].temp}°C
              </span>
            </label>
            <div className="forecast__current-hi-lo">
              <label className="forecast__label">
                High:
                <span>{weatherData.weatherArr[0].tempMax}°C</span>
              </label>
              <label className="forecast__label">
                Low:
                <span>{weatherData.weatherArr[0].tempMin}°C</span>
              </label>
            </div>
          </div>
          <div className="forecast__current-weather-container">
            <div className="forecast__current-weather">
              <img
                className="forecast__current-icon"
                src={`http://openweathermap.org/img/w/${weatherData.weatherArr[0].icon}.png`}
                alt=""
              />
              <span className="forecast__current-description">
                {weatherData.weatherArr[0].desc}
              </span>
            </div>
          </div>
          <div className="forecast__current-conditions">
            <label className="forecast__label">
              Feel:
              <span>{weatherData.weatherArr[0].feel}°C</span>
            </label>
            <label className="forecast__label">
              Humidity:
              <span>{weatherData.weatherArr[0].humidity}%</span>
            </label>
            <label className="forecast__label forecast__label-pop">
              PoP:
              <span>{weatherData.weatherArr[0].pop}%</span>
            </label>
            <label className="forecast__label">
              Wind:
              <span>
                {weatherData.weatherArr[0].windSpeed}
                {"m/s "}
                {formatWindDir(weatherData.weatherArr[0].windDir)}
              </span>
            </label>
            <label className="forecast__label">
              Sunrise:
              <span>{formatEpoch(weatherData.sunrise, "time")}</span>
            </label>
            <label className="forecast__label">
              Sunset:
              <span>{formatEpoch(weatherData.sunset, "time")}</span>
            </label>
          </div>
        </div>
        <div className="forecast__upcoming-container">
          {weatherData.weatherArr.slice(1).map((item, i) => {
            return (
              <div
                key={i}
                className={`forecast__upcoming  ${
                  expansion[i]
                    ? "forecast__upcoming-expand"
                    : "forecast__upcoming-compress"
                }`}
              >
                <div className="forecast__upcoming-main">
                  <h3 className="forecast__upcoming-day">
                    {formatEpoch(item.dt, "day", i)}
                  </h3>
                  <div className="forecast__upcoming-weather">
                    <img
                      className="forecast__upcoming-icon"
                      src={`http://openweathermap.org/img/w/${item.icon}.png`}
                      alt=""
                    />
                    <span className="forecast__upcoming-description">
                      {item.desc}
                    </span>
                  </div>
                  <div className="forecast__upcoming-hi-lo">
                    <label className="forecast__upcoming-label">
                      High:
                      <span>{item.tempMax}°C</span>
                    </label>
                    <label className="forecast__upcoming-label">
                      Low:
                      <span>{item.tempMin}°C</span>
                    </label>
                  </div>
                </div>
                <div
                  className={`forecast__upcoming-expansion ${
                    expansion[i]
                      ? "forecast__upcoming-expansion-expand"
                      : "forecast__upcoming-expansion-compress"
                  }`}
                  onClick={() => {
                    !buttonDisabled && expandForecast(i);
                  }}
                >
                  <div className="forecast__upcoming-conditions">
                    <label className="forecast__upcoming-label">
                      Feel:
                      <span>{item.feel}°C</span>
                    </label>
                    <label className="forecast__upcoming-label">
                      Humidity:
                      <span>{item.humidity}%</span>
                    </label>
                    <label className="forecast__upcoming-label forecast__upcoming-label-pop">
                      PoP:
                      <span>{item.pop}%</span>
                    </label>
                    <label className="forecast__upcoming-label">
                      Wind:
                      <span>
                        {item.windSpeed}
                        {"m/s "}
                        {formatWindDir(item.windDir)}
                      </span>
                    </label>
                  </div>
                  <img
                    className={`forecast__upcoming-action  ${
                      expansion[i]
                        ? "forecast__upcoming-action-expand"
                        : "forecast__upcoming-action-compress"
                    }`}
                    src={expansionIcon}
                    alt=""
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
export default Forecast;
