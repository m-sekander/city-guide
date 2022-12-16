import "./Header.scss";
import logo from "../../assets/images/logo_transparent.png";
import { NavLink } from "react-router-dom";

function Header() {
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
        <NavLink className="header__link" to="/compare" disabled>
          <span>Compare</span>
        </NavLink>
      </nav>
    </header>
  );
}
export default Header;
