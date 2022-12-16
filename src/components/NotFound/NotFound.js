import "./NotFound.scss";
import canvasLogo from "../../assets/images/850656-200-sad-face.png";
import backIcon from "../../assets/images/arrow-back-icon.svg";
import homeIcon from "../../assets/images/home-icon.svg";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <div className="not-found__preface">
        <h2 className="not-found__message">The page requested did not exist</h2>
        <div className="not-found__actions">
          <Button
            icon={backIcon}
            text="Go Back"
            isButton={true}
            clickHandler={() => navigate(-2)}
          />
          <Button icon={homeIcon} text="Go Home" link={"/home"} />
        </div>
      </div>
      <div className="not-found__container">
        <div className="not-found__border"></div>
        <div className="not-found__animation">
          <img className="not-found__image" src={canvasLogo} alt="" />
        </div>
      </div>
    </>
  );
}
export default NotFound;
