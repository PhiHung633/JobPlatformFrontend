import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const LocationCarousel = ({ selectedOption, onItemSelect }) => {
  const locations = [
    "Tp Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Nha Trang",
    "Huế",
    "Cần Thơ",
    "Hải Phòng",
    "Quảng Ninh",
  ];

  const industries = [
    "Công nghệ thông tin",
    "Kế toán",
    "Marketing / Truyền Thông / Quảng Cáo",
    "Giáo dục",
    "Y tế",
    "Kỹ thuật",
    "Thời trang",
    "Bất động sản",
  ];

  const [selectedItem, setSelectedItem] = useState(""); // State để lưu item được chọn

  const dataToDisplay =
    selectedOption === "Địa điểm"
      ? locations
      : selectedOption === "Ngành nghề"
      ? industries
      : [];

  // Mặc định chọn item đầu tiên khi component render hoặc khi selectedOption thay đổi
  useEffect(() => {
    if (dataToDisplay.length > 0) {
      setSelectedItem(dataToDisplay[0]);
      if (onItemSelect) onItemSelect(dataToDisplay[0]);
    }
  }, [selectedOption]);

  const handleItemClick = (item) => {
    setSelectedItem(item); // Cập nhật state selectedItem
    if (onItemSelect) onItemSelect(item); // Gọi callback nếu có
  };

  return (
    <div className="relative w-full py-4">
      {/* Swiper */}
      <Swiper
        spaceBetween={10}
        slidesPerView={4}
        loop={true}
        navigation={true}
        modules={[Navigation]}
      >
        {dataToDisplay.map((item, index) => (
          <SwiperSlide key={index}>
            <button
              onClick={() => handleItemClick(item)} // Gọi handleItemClick khi click
              className={`text-sm font-semibold rounded-3xl px-4 py-2 w-full flex items-center justify-center
                border ${
                  selectedItem === item
                    ? "bg-green-500 text-white border-green-600"
                    : "bg-gray-200 text-black hover:bg-white hover:text-green-500 border-transparent"
                } transition`}
            >
              {item}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LocationCarousel;
