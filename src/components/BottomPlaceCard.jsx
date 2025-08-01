import { FaChevronUp, FaChevronDown, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const dummyData = [
  {
    id: 1,
    title: "Islamabad - Faisal Mosque",
    rating: 4.8,
    description: "Famous mosque with unique architecture at the foot of Margalla Hills.",
    images: [
      "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nr-AvWCKhRD7JpH3On48KFuQ5b30d7bHOhqS_KL-ir1oUm17EuwbANivyQCQ1Bj9oxiuaSM9ekkLaNei8t9Po5tHirpOdYdvyhu5gFXB3NyeeDHl6Z5Y2g-O5UNVLpukUAfV5Hd=w540-h312-n-k-no",
      "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQNrQmqwRbzJBsAjc304yUU0BAuh-PsxPY26gWC_yvyxtvGvTNP_8dMR_8M3ePpeGHami8rPB71oWdxEgog8fbOoOIgAEarwqq6uy-1GA",
    ],
  },
  {
    id: 2,
    title: "Lok Virsa Museum",
    rating: 4.6,
    description: "Museum showcasing Pakistan's cultural heritage and traditional crafts.",
    images: [
      "https://lh3.googleusercontent.com/gps-cs-s/AC9h4noPScx8mfxACe3_olxoyNTD7FFJXUt1UbcbJKSQ4awgIvvltdG_o7VfOo0Av7g8R78kH19q9E1WStotLIxScIe4-hcSdSWp7Af3Ndk0Ti_fOGEb6QDzNXmcqJThqGlzw991sOdGmQ=w540-h312-n-k-no",
      "https://lh3.googleusercontent.com/gps-cs-s/AC9h4noPScx8mfxACe3_olxoyNTD7FFJXUt1UbcbJKSQ4awgIvvltdG_o7VfOo0Av7g8R78kH19q9E1WStotLIxScIe4-hcSdSWp7Af3Ndk0Ti_fOGEb6QDzNXmcqJThqGlzw991sOdGmQ=w540-h312-n-k-no",
    ],
  },
];

export default function BottomLocationPanel() {


  return (
    <div className={`fixed top-[100rem] left-0 h-[380px] w-[400px] z-40 transition-all duration-300  bg-white shadow-xl border-t border-gray-200  overflow-hidden`}>
      {/* Toggle Button */}
      <div className="flex justify-center items-center py-2 cursor-pointer">
        
      </div>

      {/* Content */}
      <div className={`overflow-y-auto h-[300px] px-4 `}>
        <div className="space-y-4">
          {dummyData.map((location) => (
            <div key={location.id} className="bg-gray-100 rounded-xl p-3 shadow-sm">
              {/* Carousel */}
              <Carousel
                showThumbs={false}
                showStatus={false}
                infiniteLoop
                autoPlay
                interval={4000}
                className="rounded-xl overflow-hidden"
              >
                {location.images.map((img, index) => (
                  <div key={index}>
                    <img src={img} alt={location.title} className="h-40 object-cover w-full" />
                  </div>
                ))}
              </Carousel>

              {/* Details */}
              <div className="pt-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    {location.title}
                  </h2>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <FaStar />
                    <span className="text-sm font-medium text-gray-700">{location.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{location.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
