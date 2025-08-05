import React, { useState, useEffect } from "react";
import { IoMdMenu } from "react-icons/io";
import { MdMyLocation } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { FaSearchLocation, FaMapMarkedAlt } from "react-icons/fa";
import { LuArrowUpDown } from "react-icons/lu";
import { FaLocationCrosshairs } from "react-icons/fa6";
import Sidebar from "./SideBar";
import BottomLocationPanel from "./BottomPlaceCard";

function MapSearchBox({
  from,
  to,
  setFrom,
  setTo,
  onSearch,
  onSelect,
  showTraffic,
  setShowTraffic,
  panTo ,
  routes  ,
  hasRoute ,
  routeInfo,
destinationInfo ,
originInfo

}) {
  console.log("Origin Info:", originInfo);
console.log("Destination Info:", destinationInfo);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeInput, setActiveInput] = useState("from");
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [keyboardIndex, setKeyboardIndex] = useState(-1);
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);

  useEffect(() => {
    if (!inputValue) {
      setSuggestions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input: inputValue, componentRestrictions: { country: "pk" } },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, [inputValue]);

  const selectSuggestion = (suggestion) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: suggestion.place_id }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        const latLng = {
          lat: location.lat(),
          lng: location.lng(),
          name: suggestion.description,
        };
setInputValue(suggestion.description);
        if (activeInput === "from") {
          setFrom(suggestion.description);
          setFromLocation(latLng);
          if (toLocation) onSearch(latLng, toLocation);
        } else {
          setTo(suggestion.description);
          setToLocation(latLng);
          if (fromLocation) onSearch(fromLocation, latLng);
        }

        
        setSuggestions([]);
        setKeyboardIndex(-1);
        
        if (onSelect) onSelect(latLng);
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setKeyboardIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setKeyboardIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (keyboardIndex >= 0 && suggestions[keyboardIndex]) {
        e.preventDefault();
        selectSuggestion(suggestions[keyboardIndex]);
        setSuggestions([])
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setKeyboardIndex(-1);
    }
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  const handleChooseLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const latLng = { lat: latitude, lng: longitude };

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === "OK" && results.length > 0) {
            const preferred =
              results.find((r) => r.types.includes("street_address")) ||
              results.find((r) => r.types.includes("premise")) ||
              results.find((r) => r.geometry?.location_type === "ROOFTOP") ||
              results[0];

            const description = preferred.formatted_address;
            const locationData = { ...latLng, name: description };

            if (window.confirm(`Use this location?\n${description}`)) {
              if (activeInput === "from") {
                setFrom(description);
                setFromLocation(locationData);
              } else {
                setTo(description);
                setToLocation(locationData);
              }

              
              setSuggestions([]);
              setKeyboardIndex(-1);
              if (onSelect) onSelect(locationData);
            }
          } else {
            alert("Unable to detect a usable address.");
          }
        });
      },
      (err) => {
        alert("Location access denied or failed.");
        console.error("Location error:", err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showTraffic={showTraffic}
        setShowTraffic={setShowTraffic}
      />

     <div
      className={`${
        hasRoute
          ? "fixed top-0 bottom-0 left-0 w-96 rounded-none"
          : "absolute top-4 left-4 rounded-2xl"
      } bg-white  shadow-lg z-20  transition-all overflow-y-auto overflow-hidden duration-300 p-4 w-[360px]`}
    >      <div className="flex items-center gap-20 ml-3">
          <button onClick={() => setSidebarOpen(true)}>
            <IoMdMenu className="text-black text-xl font-medium" />
          </button>
          <h1 className="text-xl text-gray-800 text-center font-normal">
            Driving Details
          </h1>
        </div>

        <div className="grid grid-cols-[48px_1fr_48px] gap-3 items-center">
          <div className="flex flex-col justify-between items-center h-full space-y-3 py-1">
            <div className="w-10 h-10 flex items-center justify-center text-blue-700">
              <MdMyLocation className="text-xl" />
            </div>
            <div className="w-10 h-10 flex items-center justify-center text-red-500">
              <GrLocation className="text-xl" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
              <FaSearchLocation className="text-gray-500 text-base" />
              <input
                placeholder="Search origin..."
                value={activeInput === "from" ? inputValue : from}
                onFocus={() => {
                  setActiveInput("from");
                  setInputValue(from);
                }}
                onChange={(e) => {
    setFrom(e.target.value);
    setActiveInput("from");
    setInputValue(e.target.value)
  }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm text-gray-800 ml-2 placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
              <FaMapMarkedAlt className="text-gray-500 text-base" />
              <input
                placeholder="Search destination..."
                value={activeInput === "to" ? inputValue : to}
                onFocus={() => {
                  setActiveInput("to");
                  setInputValue(to);
                }}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm text-gray-800 ml-2 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button onClick={handleSwap}>
              <LuArrowUpDown className="text-xl" />
            </button>
          </div>
        </div>

        <div
          className="mt-2 flex gap-3 items-center px-4 py-4 cursor-pointer border-b"
          onClick={handleChooseLocation}
        >
          <FaLocationCrosshairs className="text-blue-500 text-lg" />
          <span className="text-sm text-gray-600">Your Location</span>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-2 max-h-52 overflow-y-auto border-b border-gray-200 rounded-lg shadow-sm bg-white z-50">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.place_id}
                onMouseDown={() => selectSuggestion(suggestion)}
                className={`p-2 cursor-pointer text-sm transition ${
                  index === keyboardIndex
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                {suggestion.description}
                <div className="border-b border-gray-200 mt-1" />
              </div>
            ))}
          </div>
        )}

{hasRoute && routeInfo && (
<BottomLocationPanel
  info={routeInfo}
  routes={routes}
  originInfo={originInfo}           // ✅
  destinationInfo={destinationInfo} // ✅
  panTo={panTo}
/>

)}




      </div>
    </>
  );
}

export default MapSearchBox;