import "./Visits.scss";

function Visits({ visits }) {
  return (
    <div className="visits">
      <h2 className="visits__title">Notable Visits</h2>
      {visits.map((item) => {
        return (
          <div className="visits__card" key={item.place_id}>
            <div className="visits__left">
              <h3 className="visits__name">{item.name}</h3>
              <span className="visits__address">
                {item.vicinity.lastIndexOf(",") !== -1
                  ? item.vicinity.slice(0, item.vicinity.lastIndexOf(","))
                  : item.vicinity}
              </span>
            </div>
            {item.rating ? (
              <div className="visits__rating-container">
                <span className="visits__rating">{item.rating.toFixed(1)}</span>
                <span className="visits__star">★</span>
              </div>
            ) : (
              <div className="visits__rating-container">
                <span className="visits__rating--unavailable">N/A</span>
                {/* <span className="visits__star">★</span> */}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Visits;
