// MapSearchBox.jsx
import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdMyLocation } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { FaSearchLocation, FaMapMarkedAlt } from "react-icons/fa";
import { LuArrowUpDown } from "react-icons/lu";
import Sidebar from "./SideBar";
import { useEffect, useRef } from 'react';
import '../App.css'
function MapSearchBox({ from, to, setFrom, setTo, onSearch }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };


 const fromRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(fromRef.current, {
      types: ['geocode'], // or ['(cities)'] for only cities
    });

    // Optional: On place selected (if needed)
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      console.log('Selected place:', place); // Tum yahan se address, lat/lng use kar sakte ho
    });
  }, []);
  return (
    <>

    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main Box */}
      <div className="absolute top-2 left-2 z-30 rounded-2xl w-[370px] h-[218] bg-white shadow-xl border border-gray-200 p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-20">
          <button onClick={() => setSidebarOpen(true)}>
            <GiHamburgerMenu className="text-black text-xl font-thin" />
          </button>
          <h1 className="text-xl  text-gray-800 text-center font-normal">Driving  Details</h1>
        </div>

        {/* Location Inputs Section */}
        <div className="grid grid-cols-[48px_1fr_48px] gap-3 items-center">
          {/* Left Icons */}
          <div className="flex flex-col justify-between items-center h-full space-y-3 py-1">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 shadow text-blue-600">
              <MdMyLocation className="text-xl" />
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 shadow text-blue-600">
              <GrLocation className="text-xl" />
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
              <FaSearchLocation className="text-gray-500 text-base" />
              <input
                ref={fromRef}
                type="text"
                placeholder="Search location..."
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
              <FaMapMarkedAlt className="text-gray-500 text-base" />
              <input
                type="text"
                placeholder="Enter destination..."
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition"
            >
              <LuArrowUpDown className="text-xl" />
            </button>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onSearch}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow transition"
          >
            Search
          </button>
        </div>

        {/* suggestion cities */}

     
      </div>
    </>
  );
}

export default MapSearchBox;
