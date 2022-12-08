import "./Home.scss";
import { useState, useEffect } from "react";
import PlacesAutocomplete, {
  geocodeByPlaceId,
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import searchIcon from "../../assets/images/search.svg";
import { useParams, useNavigate } from "react-router-dom";

function Home() {
  const [city, setCity] = useState("");
  const [formattedCity, setFormattedCity] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [cityId, setCityId] = useState(useParams().cityId);
  const searchOptions = { types: ["locality"] };
  const navigate = useNavigate();

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
          setFormattedCity(
            result[0].formatted_address.slice(
              0,
              result[0].formatted_address.indexOf(",")
            )
          );
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
  }, [cityId]);

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
    </>
  );
}

export default Home;
