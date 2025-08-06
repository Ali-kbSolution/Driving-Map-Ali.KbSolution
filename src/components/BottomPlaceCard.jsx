import React, { useRef, useState } from "react";
import { FaDirections, FaShareAlt, FaSave } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";


const BottomLocationPanel = ({
  info,
  routes,
  destinationInfo,
  originInfo,
  panTo,
  originLocation,
  destinationLocation,
  map 
}) => {
  const [activeTab, setActiveTab] = useState("origin"); // NEW
      const [startNav, setStartNav] = useState(false);
      const [shareLocation , setShareLocation] =useState(false) ;
      const [UrlLocation , setUrlLocation] = useState("") ;
          const userMarkerRef = useRef(null);

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

const sendMyLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      console.log("Share this location:\n" + mapsLink);
      // You can also copy to clipboard or send via WhatsApp, etc.
      setUrlLocation(mapsLink)
      setShareLocation(true)

    },
    (error) => {
      alert("Location access failed: " + error.message);
    },
    { enableHighAccuracy: true }
  );
};



 const handleStartNavigation = () => {
    setStartNav(true);

    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const pos = { lat: latitude, lng: longitude };

        // Marker ko update karo
        if (userMarkerRef.current) {
          userMarkerRef.current.setPosition(pos);
        }

        // Map ko follow karwao
        if (map) {
          map.setCenter(pos);
        }
      },
      (error) => {
        console.error("Tracking error:", error);
      },
      { enableHighAccuracy: true }
    );
  };
  return (

    <>
     {!startNav && (
            <button className="hidden"
              onClick={handleStartNavigation}
          
            >
              Start
            </button>
          )}
    <div className="relative text-black w-[350px] overflow-y-auto">
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
        <FaShareAlt title="Share" onClick={sendMyLocation} />
        <FaDirections title="Directions" />
        <FaSave title="Save" />
      </div>
       {shareLocation && (
 <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 shadow-lg w-[550px] h-[200px] text-center">
      <div className="flex justify-end">
       <button
        className="flex items-center text-left"
        onClick={() => setShareLocation(false)}
      >
       <IoMdClose />
      </button>
      </div>
      <h2 className="text-xl text-gray-600 font-medium mb-5">Share Location</h2>
      <div className="block">
        <div className="flex justify-between items-center text-center">
        <div className="block">
      <p className="text-white bg-slate-600 p-3 rounded-full  break-all text-sm">{UrlLocation}</p>
      </div>
      <div className="block">
      <button
        className=" px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-blue-700"
        onClick={() => {
          navigator.clipboard.writeText(UrlLocation);
          alert("Link copied to clipboard!");
        }}
      >
        Copy
      </button>
      </div>
      </div>
</div>
     
    </div>
  </div>
       )}
      <div className=" py-2 w-[350px]  overflow-y-auto">
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
    <h2 className="text-xl font-semibold mb-1">{originInfo.name}</h2>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{originInfo.address}</p>

    {/* ✅ Photos */}
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

    {/* ✅ Rating Info */}
    <p className="text-black dark:text-white">Rating: {originInfo.rating || "N/A"}</p>
    <p className="text-black dark:text-white">Total Ratings: {originInfo.totalRatings || "N/A"}</p>

    {/* ✅ Reviews */}
    {originInfo.reviews?.length > 0 && (
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">User Reviews</h3>
        <div className="space-y-3">
          {originInfo.reviews.slice(0, 3).map((review, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                {review.profile_photo_url && (
                  <img
                    src={review.profile_photo_url}
                    alt="Author"
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <p className="text-sm font-medium text-black dark:text-white">
                  {review.author_name}
                </p>
                <span className="text-xs text-yellow-500 ml-auto">
                  ⭐ {review.rating}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}


        {/* DESTINATION ONLY IF ACTIVE */}
        {activeTab === "destination" && destinationInfo && (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-1">{destinationInfo.name}</h2>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{destinationInfo.address}</p>

    {/* ✅ Photos */}
    {destinationInfo.photos?.length > 0 && (
      <>
        <p className="text-sm mb-2">{destinationInfo.photos.length} photos</p>
        <div className="grid grid-cols-3 gap-1 mb-4">
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

    {/* ✅ Rating Info */}
    <p className="text-black dark:text-white">Rating: {destinationInfo.rating || "N/A"}</p>
    <p className="text-black dark:text-white">Total Ratings: {destinationInfo.totalRatings || "N/A"}</p>

    {/* ✅ Reviews */}
    {destinationInfo.reviews?.length > 0 && (
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">User Reviews</h3>
        <div className="space-y-3">
          {destinationInfo.reviews.slice(0, 3).map((review, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                {review.profile_photo_url && (
                  <img
                    src={review.profile_photo_url}
                    alt="Author"
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <p className="text-sm font-medium text-black dark:text-white">
                  {review.author_name}
                </p>
                <span className="text-xs text-yellow-500 ml-auto">
                  ⭐ {review.rating}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}
      </div>
    </div>
    </>
  );
};

export default BottomLocationPanel;
