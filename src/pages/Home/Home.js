import "./Home.scss";
import { useState, useEffect } from "react";
import PlacesAutocomplete, {
  geocodeByPlaceId,
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import searchIcon from "../../assets/images/search.svg";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleMap } from "@react-google-maps/api";
import Modal from "../../components/Modal/Modal";
import axios from "axios";

function Home() {
  const [city, setCity] = useState("");
  const [formattedCity, setFormattedCity] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [cityId, setCityId] = useState(useParams().cityId);
  const [modalActive, setModalActive] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const searchOptions = { types: ["locality"] };
  const navigate = useNavigate();
  const locationPermission = sessionStorage.getItem("locationPermission");

  window.onpopstate = () => {
    if (window.location.pathname.includes("home")) {
      setFormattedCity("");
      setCoordinates(null);
      setWeatherData(null);
      setCityId(window.location.pathname.slice(6));
    }
  };

  const options = {
    mapId: "93a3f4b17031a73e",
    disableDefaultUI: true,
    zoomControl: true,
    scrollwheel: false,
    clickableIcons: false,
    minZoom: 8,
    maxZoom: 14,
  };

  useEffect(() => {
    // window.scroll({
    //   top: 0,
    //   right: 0,
    //   behavior: "smooth",
    // });

    if (cityId) {
      geocodeByPlaceId(cityId)
        .then((result) => {
          // console.log("geocodeByPlaceId:", result[0]);
          setFormattedCity(result[0].address_components[0].long_name);
          return getLatLng(result[0]);
        })
        .then((result) => {
          // console.log("getLatLng:", result);
          setCoordinates(result);
          return axios
            .get(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${result.lat}&lon=${result.lng}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`
            )
            .then((result) => {
              weatherDataExtract(result);
            });
        })
        .catch((error) => {
          console.log("For devs:", error);
          if (error === "INVALID_REQUEST") {
            navigate(`/404`);
          }
        });
    }
  }, [cityId, navigate]);

  function handleChange(city) {
    setCity(city);
  }
  function handleSelect(city) {
    setCity(city);
    handleSearch({ target: { city: { value: city } } });
  }

  function handleSearch(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }

    if (!event.target.city.value) {
      return;
    }

    geocodeByAddress(event.target.city.value)
      .then((result) => {
        // console.log("geocodeByAddress:", result[0]);
        setCityId(result[0].place_id);
        navigate(`/home/${result[0].place_id}`);
      })
      .catch((error) => {
        console.log("For devs:", error);
      });

    setCity("");
  }

  function locationPermitted() {
    axios
      .post(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.REACT_APP_GOOGLE_KEY}`,
        {}
      )
      .then((result) => {
        return axios
          .get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${result.data.location.lat},${result.data.location.lng}&key=${process.env.REACT_APP_GOOGLE_KEY}`
          )
          .then((result) => {
            for (const item of result.data.results) {
              if (item.types.includes("locality")) {
                window.location.assign(`/home/${item.place_id}`);
                setModalActive(false);
                sessionStorage.setItem("locationPermission", "allowed");
              }
            }
          });
      })
      .catch((error) => {
        console.log("For devs:", error);
      });
  }

  function notPermitted() {
    setModalActive(false);
    sessionStorage.setItem("locationPermission", "denied");
  }

  function weatherDataExtract(apiData) {
    const weatherObj = {};

    weatherObj.sunrise = apiData.data.city.sunrise;
    weatherObj.sunset = apiData.data.city.sunset;

    const weatherArr = [];
    let tempMin = 1000;
    let tempMax = -1000;
    for (let i = 0; i < apiData.data.list.length; i++) {
      if (apiData.data.list[i].main.temp_min < tempMin) {
        tempMin = apiData.data.list[i].main.temp_min;
      }
      if (apiData.data.list[i].main.temp_max > tempMax) {
        tempMax = apiData.data.list[i].main.temp_max;
      }

      if ((7 + (i + 1)) % 8 === 0) {
        const weatherArrItem = {};

        weatherArrItem.tempMin = tempMin;
        weatherArrItem.tempMax = tempMax;
        weatherArrItem.temp = apiData.data.list[i].main.temp;

        weatherArrItem.icon = apiData.data.list[i].weather[0].icon;
        weatherArrItem.desc = apiData.data.list[i].weather[0].main;

        weatherArrItem.feel = apiData.data.list[i].main.feels_like;
        weatherArrItem.humidity = apiData.data.list[i].main.humidity;
        weatherArrItem.pop = apiData.data.list[i].pop;
        weatherArrItem.windSpeed = apiData.data.list[i].wind.speed;
        weatherArrItem.windDir = apiData.data.list[i].wind.deg;

        weatherArr.push(weatherArrItem);
        tempMin = 1000;
        tempMax = -1000;
      }
    }
    weatherObj.weatherArr = weatherArr;

    setWeatherData(weatherObj);
  }

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

  function formatEpoch(timestamp, type) {
    const date = new Date(timestamp * 1000);

    if (type === "time") {
      if (date.getHours() === 0) {
        return `12:${date.getMinutes()}am`;
      } else if (date.getHours() === 12) {
        return `12:${date.getMinutes()}pm`;
      } else if (date.getHours() < 12) {
        return `${date.getHours()}:${date.getMinutes()}am`;
      } else {
        return `${date.getHours() - 12}:${date.getMinutes()}pm`;
      }
    }
  }

  if (cityId && !formattedCity) {
    return;
  }

  if (locationPermission === "allowed" && !cityId) {
    locationPermitted();
  }

  console.log(weatherData);
  return (
    <>
      <form className="home__form" onSubmit={handleSearch}>
        {/* component that generates city suggestions via Google Maps based on user input */}
        <PlacesAutocomplete
          value={city}
          onChange={handleChange}
          onSelect={handleSelect}
          searchOptions={searchOptions}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <label className="home__label" htmlFor="city">
              Search for a city :
              <div className="home__city">
                <input
                  {...getInputProps({
                    className: "home__input",
                    name: "city",
                    id: "city",
                  })}
                />
                <button className="home__search">
                  <img className="home__icon" src={searchIcon} alt="" />
                </button>
              </div>
              <div className="home__suggestions">
                {suggestions.slice(0, 3).map((suggestion) => {
                  const className = "home__suggestion";
                  return (
                    <div
                      key={suggestion.placeId}
                      {...getSuggestionItemProps(suggestion, {
                        className,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </label>
          )}
        </PlacesAutocomplete>
      </form>
      {formattedCity && (
        <div className="home__title">
          <span className="home__preface">When in...</span>
          <h1 className="home__name">{formattedCity}</h1>
        </div>
      )}
      {coordinates && (
        <div className="home__map-container">
          {/* component that generates a custom, interactive Google Map */}
          <GoogleMap
            zoom={10}
            center={coordinates}
            options={options}
            mapContainerClassName="home__map"
          ></GoogleMap>
        </div>
      )}
      {weatherData && (
        <div className="home__forecast">
          <h2 className="home__forecast--title">Forecast</h2>
          <div className="home__forecast--current">
            <h3 className="home__forecast--current-day">Today</h3>
            <div className="home__forecast--current-temps">
              <label className="home__forecast--label home__forecast--current-temp">
                Current:
                <span className="home__forecast--current-temp">
                  {weatherData.weatherArr[0].temp}°C
                </span>
              </label>
              <div className="home__forecast--current-hi-lo">
                <label className="home__forecast--label">
                  High:
                  <span>{weatherData.weatherArr[0].tempMax}°C</span>
                </label>
                <label className="home__forecast--label">
                  Low:
                  <span>{weatherData.weatherArr[0].tempMin}°C</span>
                </label>
              </div>
            </div>
            <div className="home__forecast--current-weather">
              <img
                className="home__forecast--current-icon"
                src={`http://openweathermap.org/img/w/${weatherData.weatherArr[0].icon}.png`}
                alt=""
              />
              <span className="home__forecast--current-description">
                {weatherData.weatherArr[0].desc}
              </span>
            </div>
            <div className="home__forecast--current-conditions">
              <label className="home__forecast--label">
                Feel:
                <span>{weatherData.weatherArr[0].feel}°C</span>
              </label>
              <label className="home__forecast--label">
                Humidity:
                <span>{weatherData.weatherArr[0].humidity}%</span>
              </label>
              <label className="home__forecast--label home__forecast--label-pop">
                PoP:
                <span>{weatherData.weatherArr[0].pop * 100}%</span>
              </label>
              <label className="home__forecast--label">
                Wind:
                <span>
                  {weatherData.weatherArr[0].windSpeed}
                  {"m/s "}
                  {formatWindDir(weatherData.weatherArr[0].windDir)}
                </span>
              </label>
              <label className="home__forecast--label">
                Sunrise:
                <span>{formatEpoch(weatherData.sunrise, "time")}</span>
              </label>
              <label className="home__forecast--label">
                Sunset:
                <span>{formatEpoch(weatherData.sunset, "time")}</span>
              </label>
            </div>
          </div>
        </div>
      )}
      {!cityId && modalActive && !locationPermission && (
        <Modal
          type="location"
          function1={locationPermitted}
          function2={notPermitted}
        />
      )}
    </>
  );
}

export default Home;
