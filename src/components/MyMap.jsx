// MyMap.jsx
import React, { useState } from "react";
import Menu from "./Menu";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import MapSearchBox from "./MapOverlayCard"; // adjust path if needed

const containerStyle = {
  width: "100%",
  height: "633px",
};

const defaultCenter = {
  lat: 33.6844,
  lng: 73.0479,
};

function MyMap() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [directions, setDirections] = useState(null);

  const handleSearch = () => {
    if (!origin || !destination) {
      alert("Please enter both origin and destination");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          alert("Could not find directions: " + status);
        }
      }
    );
  };

  return (
    <>
       <Menu />
      <MapSearchBox
        from={origin}
        to={destination}
        setFrom={setOrigin}
        setTo={setDestination}
        onSearch={handleSearch}
      />

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={12}
          options={{
            minZoom: 6,
            maxZoom: 18,
            fullscreenControl: false,
            mapTypeControl: false

          }}
        >
          {directions && <DirectionsRenderer directions={directions} />}
          {!directions && <Marker position={defaultCenter} />}
        </GoogleMap>
      </LoadScript>
    </>
  );
}

export default MyMap;
