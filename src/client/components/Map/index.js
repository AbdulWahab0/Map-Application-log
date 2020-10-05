/* eslint-disable no-underscore-dangle */
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  Fragment,
} from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import "./styles.css";
import mainLogo from "../../../client/sample.png";
import FileUpload from "../FileUpload";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {
  const [latitude] = useState(51.505);
  const [longitude] = useState(-0.09);
  const [zoom] = useState(13);
  const [markers, setMarkers] = useState([]);
  const [isUpdate, setUpdate] = useState(false);
  const [currentValue, setCurrent] = useState("");

  const callMarkers = useCallback(() => {
    fetch("/api/markers")
      .then((val) => val.json())
      .then((data) => setMarkers(data))
      .catch((err) => console.log(err));
  }, []);

  const onSave = useCallback(
    (data) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      console.log({
        ...data,
        name: currentValue,
      });
      fetch(`/api/markers/${data?._id}`, {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify({
          ...data,
          name: currentValue,
        }),
      })
        .then(() => {
          callMarkers();
          setUpdate(false);
          console.log("succesfully Edited");
        })
        .catch((err) => {
          console.log("Failed to add", err);
        });
    },
    [currentValue]
  );

  const deleteMarkers = useCallback((id) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    fetch("/api/markers", {
      method: "DELETE",
      headers: myHeaders,
      body: JSON.stringify({
        id,
      }),
    })
      .then(() => {
        callMarkers();
        console.log("succesfully Deleted");
      })
      .catch((err) => {
        console.log("Failed to add", err);
      });
  }, []);

  useEffect(() => {
    callMarkers();
  }, []);

  const addMarker = useCallback((e) => {
    const { lat, lng } = e?.latlng;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    fetch("/api/markers", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        name: "",
        lng,
        lat,
      }),
    })
      .then((val) => {
        callMarkers();
        console.log("succesfully added", val);
      })
      .catch((err) => {
        console.log("Failed to add", err);
      });
  }, []);

  const position = useMemo(() => [latitude, longitude], [latitude, longitude]);
  return (
    <Fragment>
      <div>
        <Map onClick={addMarker} center={position} zoom={zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers?.map((val) => (
            <Marker
              onClick={() => setUpdate(false)}
              key={val?.id}
              position={[val?.lat, val?.lng]}
            >
              <Popup>
                <label for="myfile">Select a file:</label>
                <FileUpload />
                <br />
                <label for="myfile">Place Name</label>:{" "}
                {isUpdate ? (
                  <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend"></div>
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => setCurrent(e?.target?.value)}
                      class="form-control"
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                    />
                  </div>
                ) : (
                  val?.name
                )}
                <div>
                  {isUpdate ? (
                    <button
                      class="btn btn-primary"
                      type="button"
                      onClick={() => onSave(val)}
                    >
                      Save Place
                    </button>
                  ) : (
                    <button
                      type="button"
                      class="btn btn-success"
                      onClick={() => {
                        setCurrent(val?.name);
                        setUpdate(true);
                      }}
                    >
                      Add Location Name
                    </button>
                  )}
                </div>
                <br />
                <div className="deletMarker">
                  <button
                    class="btn btn-danger"
                    type="button"
                    onClick={() => {
                      deleteMarkers(val?._id);
                      setUpdate(false);
                    }}
                  >
                    Delete Marker/Location
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </Map>
      </div>
    </Fragment>
  );
};

export default MapComponent;
