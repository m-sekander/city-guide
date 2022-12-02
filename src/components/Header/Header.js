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
            <h4>Home</h4>
          </NavLink>
          <NavLink className="header__link" to="/compare">
            <h4>Compare</h4>
          </NavLink>
        </nav>
      </div>
      <div className="header__seperator"></div>
    </header>
  );
}
export default Header;
