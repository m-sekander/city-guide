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
  const searchOptions = { types: ["locality"] };
  const navigate = useNavigate();
  const locationPermission = sessionStorage.getItem("locationPermission");

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
        })
        .catch((error) => {
          console.log("For devs:", error);
          navigate(`/404`);
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
        axios
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
      {formattedCity && coordinates && (
        <>
          <div className="home__title">
            <span className="home__preface">When in...</span>
            <h1 className="home__name">{formattedCity}</h1>
          </div>
          <div className="home__map-container">
            {/* component that generates a custom, interactive Google Map */}
            <GoogleMap
              zoom={11}
              center={coordinates}
              options={options}
              mapContainerClassName="home__map"
            ></GoogleMap>
          </div>
        </>
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
