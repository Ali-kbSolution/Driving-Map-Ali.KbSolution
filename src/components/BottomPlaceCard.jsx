import React, { useState } from "react";
import { FaDirections, FaShareAlt, FaSave } from "react-icons/fa";

const BottomLocationPanel = ({
  info,
  routes,
  destinationInfo,
  originInfo,
  panTo,
  originLocation,
  destinationLocation,
}) => {
  const [activeTab, setActiveTab] = useState("origin"); // NEW

  if (!info) return null;

  const getArrivalTimeText = (route) => {
    if (!route?.legs?.[0]?.duration?.value) return "";

    const now = new Date();
    const durationInSeconds = route.legs[0].duration.value;
    const arrivalTime = new Date(now.getTime() + durationInSeconds * 1000);

    const hours = arrivalTime.getHours();
    const minutes = arrivalTime.getMinutes();
    const formattedHours = hours % 12 || 12;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `Arrive at ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <div className="relative text-black w-[335px] overflow-y-auto">
      <h3 className="text-base text-gray-500 mb-2 mt-4 border-b-[1px] pb-3">Routes</h3>

      <div className="border-b-[1px] pb-4 mt-4">
        {routes.length > 0 ? (
          routes.map((route, index) => (
            <div key={index}>
              <div className="flex text-center items-center mb-1">
                <h3 className="bg-blue-500 text-white text-xs w-6 h-6 rounded-full flex justify-center text-center items-center">
                  {index + 1}
                </h3>
                <p className="ml-3 text-lg font-bold">{route.legs?.[0]?.duration?.text}</p>
                <p className="flex justify-center items-end text-xs ml-3">
                  {getArrivalTimeText(route)}
                </p>
              </div>

              <p className="text-sm text-gray-600 ml-9">{route.summary}</p>
              <p className="ml-9 text-gray-700 text-xs">{route.legs?.[0]?.distance?.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No routes available.</p>
        )}
      </div>

      <div className="flex gap-4 text-xl mb-5 mt-5 ml-2 text-blue-600 dark:text-blue-400">
        <FaShareAlt title="Share" />
        <FaDirections title="Directions" />
        <FaSave title="Save" />
      </div>

      <div className="px-4 py-2 max-h-[400px] overflow-y-auto">
        {/* Tabs */}
        <div className="flex border-b pb-3 mb-2 text-sm font-medium">
          <button
            className={`px-1 py-1 ${
              activeTab === "origin" ? "text-gray-600 border-b-[2px] border-blue-500 font-semibold" : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("origin");
              panTo(originLocation);
            }}
          >
            Starting point
          </button>
          <button
            className={`px-2 py-1 ml-4 ${
              activeTab === "destination" ? "text-gray-600 border-b-[2px] border-blue-500 font-semibold" : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("destination");
              panTo(destinationLocation);
            }}
          >
            Destination
          </button>
        </div>

        {/* STARTING POINT ONLY IF ACTIVE */}
        {activeTab === "origin" && originInfo && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">Starting Point: {originInfo.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{originInfo.address}</p>

            {originInfo.photos?.length > 0 && (
              <>
                <p className="text-sm mb-2">{originInfo.photos.length} photos</p>
                <div className="grid grid-cols-3 gap-1 mb-4">
                  {originInfo.photos.slice(0, 6).map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={`Origin Photo ${i + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* DESTINATION ONLY IF ACTIVE */}
        {activeTab === "destination" && destinationInfo && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">Destination: {destinationInfo.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{destinationInfo.address}</p>

            {destinationInfo.photos?.length > 0 && (
              <>
                <p className="text-sm mb-2">{destinationInfo.photos.length} photos</p>
                <div className="grid grid-cols-3 gap-1">
                  {destinationInfo.photos.slice(0, 6).map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={`Destination Photo ${i + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomLocationPanel;
