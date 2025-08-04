// MyMap.jsx
import React, { useRef, useState, useEffect } from "react";
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
  const mapRef = useRef(null);
  const [location, setLocation] = useState(defaultCenter);
// MyMap.jsx or wherever you're using <LoadScript>
const LIBRARIES = ["places"]; // ✅ Declare once and reuse

  // 📍 Handle location from input selection
 useEffect(() => {
  if (location && mapRef.current && !directions) {
    mapRef.current.panTo(location);
    mapRef.current.setZoom(14);
  }
}, [location, directions]);


  // 🧭 Handle route search
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

      const bounds = new window.google.maps.LatLngBounds();
      result.routes[0].overview_path.forEach((point) => {
        bounds.extend(point);
      });

      if (mapRef.current) {
        mapRef.current.fitBounds(bounds); // ✅ auto zoom to fit route
      }
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
        onSelect={setLocation}
      />

      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={LIBRARIES}
      >
        <GoogleMap
          ref={mapRef}
          onLoad={(map) => (mapRef.current = map)}
          mapContainerStyle={containerStyle}
         center={directions ? undefined : location}
          zoom={14}
        options={{
  minZoom: 6,
  maxZoom: 20,
  fullscreenControl: false,
  mapTypeControl: false,
  gestureHandling: "greedy",       // ✅ allow dragging and zooming
  disableDefaultUI: false,         // ✅ enable zoom buttons
  zoomControl: true,               // ✅ allow zoom control
  draggable: true,                 // ✅ allow mouse drag
}}

        >
          {/* Route Directions */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#1E90FF", // Darker visible color
                  strokeOpacity: 0.9,
                  strokeWeight: 6,
                },
              }}
            />
          )}

          {/* Location Marker */}
          {!directions && location && <Marker position={location} />}
        </GoogleMap>
      </LoadScript>
    </>
  );
}

export default MyMap;
