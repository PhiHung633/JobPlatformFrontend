import { useState } from 'react';
import Carousel from 'react-grid-carousel';

const LocationCarousel = () => {
  const locations = [
    "Thành phố Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Nha Trang",
    "Huế",
    "Cần Thơ",
    "Hải Phòng",
    "Quảng Ninh"
  ];

  const [selectedLocation, setSelectedLocation] = useState("Thành phố Hồ Chí Minh");

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="py-4">
      <Carousel cols={4} rows={1} gap={10} loop>
        {locations.map((location, index) => (
          <Carousel.Item key={index}>
            <button 
              onClick={() => handleLocationClick(location)}
              className={`${
                selectedLocation === location
                  ? "bg-green-500 text-white cursor-default"
                  : "bg-gray-200 text-black hover:bg-white hover:border-green-400 hover:text-green-500"
              } text-sm font-semibold rounded-3xl px-2 w-full h-full flex items-center justify-center border border-transparent`}
            >
              {location}
            </button>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default LocationCarousel;
