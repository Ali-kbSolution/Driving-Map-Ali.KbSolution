// src/components/Sidebar.jsx
// import { useState } from "react";
import { FaAngleDoubleLeft } from "react-icons/fa";
// import { MdReport } from "react-icons/md";
// import waze from "../img/waze.png"
// import garbage from "../img/garbage-truck.png"
import car from "../img/traffic.png"
// import embed from "../img/left-and-right.png"
// import edit from "../img/edit.png"
// import about from "../img/help.png"
// import partner from "../img/partners.png"
// import language from "../img/translate.png"
// import support from "../img/info.png"
import "../App.css";



const Sidebar = ({ isOpen, onClose , showTraffic , setShowTraffic }) => {
 
  // const [report, setReports] = useState(false);
  // const [ShowWaze, setShowWaze] = useState(false);
  // const [Checkgarbage, setCheckGarbage] = useState(false);

  if (!isOpen) return null;


 
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-[300px] bg-white shadow-xl z-50  space-y-4 transition-transform duration-300 transform translate-x-0">
        <div className="flex justify-between items-center pt-4 pl-3 pr-3 ">
          <h2 className="text-2xl  text-gray-800  font-medium">Wave</h2>
          <button
            onClick={onClose}
            className="text-gray-500  hover:text-black text-base"
          >
            <FaAngleDoubleLeft />
          </button>
        </div>

        <hr />
         {/* traffice jams */}

        <div className="flex justify-between  items-center px-5">
           <div className="flex items-center w-[244px]">
          <img src={car} className="car w-[25px]">
         
          </img>
          <h3 className="text-[13px] font-normal text-gray-500  ml-4 mr-8">
            Show Traffic jams
          </h3>
          </div>
          <button
             checked={showTraffic}
            onClick={() => setShowTraffic(!showTraffic)}
            className={`relative inline-flex h-[20px] w-[47px] items-center rounded-full transition-colors duration-300 ${
              showTraffic ? "bg-blue-600" : "bg-gray-500"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                showTraffic ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

          {/* <div className="flex justify-between  items-center px-5">
           <div className="flex items-center w-[244px]">
          <div className="car text-[25px] text-yellow-500">
           <MdReport />
          </div>
          <h3 className="text-[13px] font-normal text-gray-500  ml-4 mr-8">
          Show reports
          </h3>
          </div>
          <button
          checked={report}
            onClick={()=> setReports(!report)}
            className={`relative inline-flex h-[20px] w-[47px] items-center rounded-full transition-colors duration-300 ${
              report ? "bg-blue-600" : "bg-gray-500"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                report ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>


          <div className="flex justify-between  items-center px-5">
           <div className="flex items-center w-[244px]">
          <img src={waze} className="car w-[25px] text-blue-700">
          </img>
          <h3 className="text-[13px] font-normal text-gray-500  ml-4 mr-8">
           
Show other Wazers
          </h3>
          </div>
          <button
            checked={ShowWaze}
            onClick={() => setShowWaze(!ShowWaze)}
            className={`relative inline-flex h-[20px] w-[47px] items-center rounded-full transition-colors duration-300 ${
              ShowWaze ? "bg-blue-600" : "bg-gray-500"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                ShowWaze ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

          <div className="flex justify-between  items-center px-5">
           <div className="flex items-center w-[244px]">
          <img src={garbage} className="car w-[25px] text-green-700">
          </img>
          <h3 className="text-[13px] font-normal text-gray-500   ml-4 ">
           Show garbage trucks and snowplows
          </h3>
          </div>
          <button
          checked={Checkgarbage}
            onClick={ () => setCheckGarbage(!Checkgarbage)}
            className={`relative inline-flex h-[20px] w-[47px] items-center rounded-full transition-colors duration-300 ${
              Checkgarbage ? "bg-blue-600" : "bg-gray-500"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                Checkgarbage ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <hr />
          <div className="embed px-6 py-3">
             <div className="flex gap-4 items-center ">
               <img src={embed} className="w-[25px] " alt="" />
               <h4 className="text-[13px] text-gray-500">Share and embed</h4>
             </div>
             <div className="flex gap-4 items-center mt-4">
               <img src={edit} className="w-[25px]" alt="" />
               <h4 className="text-[13px] text-gray-500">Edit the map</h4>
             </div>
          </div>

          <hr />

          <div className="embed px-6 py-3">
             <div className="flex gap-4 items-center ">
               <img src={about} className="w-[25px] " alt="" />
               <h4 className="text-[13px] text-gray-500">About Waze</h4>
             </div>
             <div className="flex gap-4 items-center mt-4">
               <img src={partner} className="w-[25px]" alt="" />
               <h4 className="text-[13px] text-gray-500">
Partners</h4>
             </div>
             <div className="flex gap-4 items-center mt-4">
               <img src={language} className="w-[25px]" alt="" />
               <h4 className="text-[13px] text-gray-500">
Select language</h4>
             </div>
             <div className="flex gap-4 items-center mt-4">
               <img src={support} className="w-[25px]" alt="" />
               <h4 className="text-[13px] text-gray-500">
Support</h4>
             </div>
          </div>

          <hr /> */}
      </div>
    </>
  );
};

export default Sidebar;
