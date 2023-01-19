import "./Modal.scss";
import locationIcon from "../../assets/images/location-2955.png";
import Button from "../Button/Button";

function Modal({ type, function1, function2 }) {
  if (type === "location") {
    return (
      <div className={"modal"}>
        <div className={"modal__container"}>
          <img className="modal__image" src={locationIcon} alt="" />
          <div className="modal__text">
            <p className={"modal__message"}>Allow access your location?</p>
            <div className="modal__actions">
              <Button
                text={"YES"}
                isButton={true}
                clickHandler={() => {
                  function1();
                }}
              />
              <Button
                text={"NO"}
                isButton={true}
                clickHandler={() => {
                  function2();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
