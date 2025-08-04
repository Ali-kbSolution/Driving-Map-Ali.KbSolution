import React, { useState, useEffect} from "react";
import { IoMdMenu  } from "react-icons/io";
import { MdMyLocation } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { FaSearchLocation, FaMapMarkedAlt } from "react-icons/fa";
import { LuArrowUpDown } from "react-icons/lu";
import { FaLocationCrosshairs } from "react-icons/fa6";
import Sidebar from "./SideBar";

function MapSearchBox({ from, to, setFrom, setTo, onSearch, onSelect }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeInput, setActiveInput] = useState("from");
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [keyboardIndex, setKeyboardIndex] = useState(-1);

  // Store selected lat/lng for both points
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);

  // Fetch suggestions
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

  // Handle suggestion select
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

      if (activeInput === "from") {
        setFrom(suggestion.description);
        setFromLocation(latLng);

        // ✅ Check if `toLocation` already exists, then call onSearch immediately
        if (toLocation) {
          onSearch(latLng, toLocation); // from, to
        }
      } else {
        setTo(suggestion.description);
        setToLocation(latLng);

        // ✅ Check if `fromLocation` already exists, then call onSearch immediately
        if (fromLocation) {
          onSearch(fromLocation, latLng); // from, to
        }
      }

      setInputValue(suggestion.description);
      setSuggestions([]);
      setKeyboardIndex(-1);
      onSelect(latLng); // optional
    }
  });
};


  // Handle keyboard selection
const handleKeyDown = (e) => {
  if (e.key === "ArrowDown") {
    setKeyboardIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
  } else if (e.key === "ArrowUp") {
    setKeyboardIndex((prev) => Math.max(prev - 1, 0));
  } else if (e.key === "Enter") {
    if (keyboardIndex >= 0 && suggestions[keyboardIndex]) {
      e.preventDefault(); // ✅ Stop default form submit
      selectSuggestion(suggestions[keyboardIndex]);
    }
  } else if (e.key === "Escape") {
    setSuggestions([]);
    setKeyboardIndex(-1);
  }
};


  // Swap origin and destination
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  // Use current location
const handleChooseLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      const latLng = { lat: latitude, lng: longitude };
      console.log("📍 User location (lat/lng):", latLng); 

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        console.log("📦 Geocoder status:", status, "Results:", results);

        if (status === "OK" && results.length > 0) {
          // 🎯 Prioritize best quality address
          const preferred =
            results.find((r) => r.types.includes("street_address")) ||
            results.find((r) => r.types.includes("premise")) ||
            results.find((r) => r.geometry?.location_type === "ROOFTOP") ||
            results[0];

          const description = preferred.formatted_address;
          console.log("✅ Selected address:", description);

          const locationData = {
            ...latLng,
            name: description,
          };

          // 🧠 Ask user for confirmation (optional UI)
          if (window.confirm(`Use this location?\n${description}`)) {
            if (activeInput === "from") {
              setFrom(description);
              setFromLocation(locationData);
            } else {
              setTo(description);
              setToLocation(locationData);
            }

            setInputValue(description);
            setSuggestions([]);
            setKeyboardIndex(-1);

            if (onSelect) onSelect(locationData);
          }
        } else {
          alert("❌ Unable to detect a usable address from your location.");
        }
      });
    },
    (err) => {
      alert("❌ Location access denied or failed.");
      console.error("Location error:", err);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};


  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="absolute top-2 left-2 z-30 rounded-2xl w-[370px] bg-white shadow-xl border border-gray-200 p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-20 ml-3">
          <button onClick={() => setSidebarOpen(true)}>
            <IoMdMenu  className="text-black  text-xl font-medium" />
          </button>
          <h1 className="text-xl text-gray-800 text-center font-normal">Driving Details</h1>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-[48px_1fr_48px] gap-3 items-center">
          <div className="flex flex-col justify-between items-center h-full space-y-3 py-1">
            <div className="w-10 h-10 flex items-center justify-center text-blue-700">
              <MdMyLocation className="text-xl" />
            </div>
            <div className="w-10 h-10 flex items-center justify-center text-red-500">
              <GrLocation className="text-xl" />
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-3">
            {/* From */}
            <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
              <FaSearchLocation className="text-gray-500 text-base" />
             <input
  placeholder="Search origin..."
  value={activeInput === "from" ? inputValue : from}
  onFocus={() => {
    setActiveInput("from");
    setInputValue(from); // 👈 update inputValue based on current "from"
  }}
  onChange={(e) => setInputValue(e.target.value)}
  onKeyDown={handleKeyDown}
  className="flex-1 bg-transparent text-sm text-gray-800 ml-2 placeholder-gray-400 focus:outline-none"
/>

            </div>

            {/* To */}
            <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
              <FaMapMarkedAlt className="text-gray-500 text-base" />
              <input
                placeholder="Search destination..."
                value={activeInput === "to" ? inputValue : to}
                onFocus={() => {
                  setActiveInput("to");
                  setInputValue(to)
                }}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm text-gray-800 ml-2 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className=""
            >
              <LuArrowUpDown className="text-xl" />
            </button>
          </div>
        </div>

        {/* Your Location */}
        <div
          className="mt-2 flex gap-3 items-center px-4 py-4 cursor-pointer border-b"
          onClick={handleChooseLocation}
        >
          <FaLocationCrosshairs className="text-blue-500 text-lg" />
          <span className="text-sm text-gray-600">Your Location</span>
        </div>

        {/* Suggestions */}
       {suggestions.length > 0 && (
  <div className="mt-2 max-h-52 overflow-y-auto border-b border-gray-200 rounded-lg shadow-sm bg-white z-50">
    {suggestions.map((suggestion, index) => (
      <div
        key={suggestion.place_id}
        onMouseDown={() => selectSuggestion(suggestion)} // ✅ works correctly
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

      </div>
    </>
  );
}

export default MapSearchBox;
