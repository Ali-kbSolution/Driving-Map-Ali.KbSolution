// MyMap.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";

import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import Menu from "./Menu";
import MapSearchBox from "./MapOverlayCard"; // bottom card

const containerStyle = {
  width: "100%",
  height: "633px",
};

const defaultCenter = {
  lat: 33.6844,
  lng: 73.0479,
};

const LIBRARIES = ["places"];

function MyMap() {

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [location, setLocation] = useState(defaultCenter);
  const [showTraffic, setShowTraffic] = useState(false);
 const [directions, setDirections] = useState(null);
const [routes, setRoutes] = useState([]);
const [originInfo, setOriginInfo] = useState(null);
const [destinationInfo, setDestinationInfo] = useState(null);
const [routeInfo, setRouteInfo] = useState(null);


const mapRef = useRef(null); // 👈 Map ref

const onLoad = useCallback((map) => {
  mapRef.current = map;
}, []);

const panTo = (location) => {
  if (mapRef.current && location) {
    mapRef.current.panTo(location);
    mapRef.current.setZoom(15); // or whatever zoom
  }
};

  // Pan map when location changes (only before directions are shown)
  useEffect(() => {
    if (location && mapRef.current && !directions) {
      mapRef.current.panTo(location);
      mapRef.current.setZoom(14);
    }
  }, [location, directions]);

  // 🚗 Search for directions + place info
const handleSearch = async (fromLocation, toLocation) => {
  if (!fromLocation || !toLocation) return;

  const directionsService = new window.google.maps.DirectionsService();
  const placesService = new window.google.maps.places.PlacesService(
    document.createElement("div")
  );

  directionsService.route(
    {
      origin: fromLocation,
      destination: toLocation,
      travelMode: window.google.maps.TravelMode.DRIVING,
    },
    async (result, status) => {
      if (status === "OK") {
        setDirections(result);
        setRoutes(result.routes);

        const leg = result?.routes?.[0]?.legs?.[0];
        if (!leg) {
          console.error("Leg not found in directions");
          return;
        }

        const originLocation = leg.start_location;
        const destinationLocation = leg.end_location;

        const fetchPlaceDetails = (query, callback) => {
          placesService.findPlaceFromQuery(
            {
              query,
              fields: [
                "name",
                "formatted_address",
                "geometry",
                "photos",
                "rating",
                "user_ratings_total",
              ],
            },
            (results, placeStatus) => {
              if (
                placeStatus === window.google.maps.places.PlacesServiceStatus.OK &&
                results.length > 0
              ) {
                const place = results[0];
                const photos =
                  place.photos?.map((p) =>
                    p.getUrl({ maxWidth: 400, maxHeight: 300 })
                  ) || [];

                callback({
                  name: place.name,
                  address: place.formatted_address,
                  location: place.geometry?.location,
                  rating: place.rating,
                  totalRatings: place.user_ratings_total,
                  photos,
                });
              } else {
                console.error("Place not found:", query);
                callback(null);
              }
            }
          );
        };

        fetchPlaceDetails(fromLocation.name || fromLocation, (originInfo) => {
          if (originInfo) {
            setOriginInfo(originInfo);

            fetchPlaceDetails(toLocation.name || toLocation, (destinationInfo) => {
              if (destinationInfo) {
                setDestinationInfo(destinationInfo);

                setRouteInfo({
                  name: destinationInfo.name,
                  address: destinationInfo.address,
                  distance: leg.distance.text,
                  duration: leg.duration.text,
                  location: destinationLocation,
                  rating: destinationInfo.rating,
                  totalRatings: destinationInfo.totalRatings,
                  photos: destinationInfo.photos,
                });

                const bounds = new window.google.maps.LatLngBounds();
                result.routes[0].overview_path.forEach((point) =>
                  bounds.extend(point)
                );
                mapRef.current.fitBounds(bounds);
              }
            });
          }
        });
      } else {
        alert("Could not find directions: " + status);
      }
    }
  );
};


  // 🚦 Toggle traffic layer
  useEffect(() => {
    let trafficLayer;

    if (mapRef.current && showTraffic) {
      trafficLayer = new window.google.maps.TrafficLayer();
      trafficLayer.setMap(mapRef.current);
    }

    return () => {
      if (trafficLayer) {
        trafficLayer.setMap(null);
      }
    };
  }, [showTraffic]);

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
  showTraffic={showTraffic}
  setShowTraffic={setShowTraffic}
  routeInfo={routeInfo} // ⬅️ important
  //  selectedPlaceInfo={selectedPlaceInfo}
   routes={routes}
   hasRoute={!!directions}
    onLoad={onLoad}
    panTo={panTo}
    originInfo={originInfo}
    destinationInfo={destinationInfo}
/>



      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={LIBRARIES}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={(map) => (mapRef.current = map)}
          ref={mapRef}
          center={directions ? undefined : location}
          zoom={14}
          options={{
            minZoom: 6,
            maxZoom: 20,
            fullscreenControl: false,
            mapTypeControl: false,
            gestureHandling: "greedy",
            disableDefaultUI: false,
            zoomControl: true,
            draggable: true,
          }}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#1E90FF",
                  strokeOpacity: 0.9,
                  strokeWeight: 6,
                },
              }}
            />
          )}

          {!directions && location && <Marker position={location} />}
        </GoogleMap>
      </LoadScript>
    </>
  );
}

export default MyMap;
