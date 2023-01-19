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
import Forecast from "../../components/Forecast/Forecast";

function Home() {
  const [city, setCity] = useState("");
  const [formattedCity, setFormattedCity] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [cityId, setCityId] = useState(useParams().cityId);
  const [modalActive, setModalActive] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [expansion, setExpansion] = useState([false, false, false, false]);
  const searchOptions = { types: ["locality"] };
  const navigate = useNavigate();
  const locationPermission = sessionStorage.getItem("locationPermission");

  // When history location is changed, the states are reset thus re-renders the page components
  window.onpopstate = () => {
    if (window.location.pathname.includes("home")) {
      setFormattedCity("");
      setCoordinates(null);
      setWeatherData(null);
      setExpansion([false, false, false, false]);
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
    window.scroll({
      top: 0,
      right: 0,
      behavior: "smooth",
    });

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
        setExpansion([false, false, false, false]);
        setCityId(result[0].place_id);
        navigate(`/home/${result[0].place_id}`);
      })
      .catch((error) => {
        console.log("For devs:", error);
      });

    setCity("");
  }

  // If location access is granted by user, load home page as user's city
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

  // Cleans up the Weather API's data
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

        weatherArrItem.dt = apiData.data.list[i].dt;

        weatherArrItem.tempMin = Math.round(tempMin * 10) / 10;
        weatherArrItem.tempMax = Math.round(tempMax * 10) / 10;
        weatherArrItem.temp =
          Math.round(apiData.data.list[i].main.temp * 10) / 10;

        weatherArrItem.icon = apiData.data.list[i].weather[0].icon;
        weatherArrItem.desc = apiData.data.list[i].weather[0].main;

        weatherArrItem.feel =
          Math.round(apiData.data.list[i].main.feels_like * 10) / 10;
        weatherArrItem.humidity = Math.round(
          apiData.data.list[i].main.humidity
        );
        weatherArrItem.pop = Math.round(apiData.data.list[i].pop * 100);
        weatherArrItem.windSpeed =
          Math.round(apiData.data.list[i].wind.speed * 10) / 10;
        weatherArrItem.windDir = apiData.data.list[i].wind.deg;

        weatherArr.push(weatherArrItem);
        tempMin = 1000;
        tempMax = -1000;
      }
    }
    weatherObj.weatherArr = weatherArr;

    setWeatherData(weatherObj);
  }

  if (cityId && !formattedCity) {
    return;
  }

  if (locationPermission === "allowed" && !cityId) {
    locationPermitted();
  }

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
        <Forecast
          weatherData={weatherData}
          expansion={expansion}
          setExpansion={setExpansion}
        />
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
