import "./Header.scss";
import logo from "../../assets/images/logo_transparent.png";
import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="header__content">
        <Link className="header__logo" to="/home">
          <img className="header__logo" src={logo} alt="" />
        </Link>
        <nav className="header__nav">
          <NavLink className="header__link" to="/home">
            <span>Home</span>
          </NavLink>
          <NavLink className="header__link" to="/compare">
            <span>Compare</span>
          </NavLink>
        </nav>
      </div>
      <div className="header__seperator"></div>
    </header>
  );
}
export default Header;
