import "./Header.scss";
import logo from "../../assets/images/logo_transparent.png";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Header() {
  const [isHover, setIsHover] = useState(false);

  function handleMouseEnter() {
    setIsHover(true);
  }
  function handleMouseLeave() {
    setIsHover(false);
  }

  function handleClick(event) {
    event.preventDefault();
  }

  return (
    <header className="header">
      <div
        className="header__logo"
        onClick={() => {
          window.location.assign("/home");
        }}
      >
        <img className="header__logo" src={logo} alt="" />
      </div>
      <nav className="header__nav">
        <NavLink className="header__link" to="/home">
          <span>Home</span>
        </NavLink>
        <NavLink
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="header__link "
          to="/compare"
          disabled
        >
          <span>Compare</span>
          {isHover && <span className="header__soon">Coming Soon !</span>}
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
