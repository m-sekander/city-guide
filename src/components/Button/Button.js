import "./Button.scss";
import { Link } from "react-router-dom";

function Button({ icon, text, isButton, link, clickHandler }) {
  // Returns button if isButton prop is true else returns Link
  if (isButton) {
    return (
      <button className="button" onClick={clickHandler}>
        <img className="button__icon" src={icon} alt="" />
        {text}
      </button>
    );
  } else {
    return (
      <Link to={link} className="button">
        <img className="button__icon" src={icon} alt="" />
        {text}
      </Link>
    );
  }
}

export default Button;
