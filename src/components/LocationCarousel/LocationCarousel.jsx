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
    "Giáo dục",
    "Y tế",
    "Kỹ thuật",
    "Marketing / Truyền Thông / Quảng Cáo",
    "Thời trang",
    "Bất động sản",
  ];

  const [selectedItem, setSelectedItem] = useState("");

  const dataToDisplay =
    selectedOption === "Địa điểm"
      ? locations
      : selectedOption === "Ngành nghề"
        ? industries
        : [];

  const dynamicSwiperProps =
    selectedOption === "Địa điểm"
      ? {
        spaceBetween: 100,
        slidesPerView: 4,
        loop: true,
      }
      : {
        spaceBetween: 20,
        slidesPerView: "auto",
        loop: true,
      };

  // --- FIX START ---
  // Mặc định chọn item đầu tiên CHỈ KHI selectedOption thay đổi
  // hoặc khi component được mount lần đầu.
  useEffect(() => {
    if (dataToDisplay.length > 0) {
      const defaultItem = dataToDisplay[0];
      setSelectedItem(defaultItem);
      // Gọi onItemSelect chỉ khi defaultItem thực sự thay đổi
      // để tránh loop nếu parent component cũng có state dựa trên onItemSelect
      if (onItemSelect) onItemSelect(defaultItem);
    }
  }, [selectedOption]); // <<< REMOVED dataToDisplay from dependencies
  // --- FIX END ---


  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (onItemSelect) onItemSelect(item);
  };

  return (
    <div className="relative w-full py-4">
      <Swiper
        {...dynamicSwiperProps}
        navigation={true}
        modules={[Navigation]}
      >
        {dataToDisplay.map((item, index) => (
          <SwiperSlide
            key={index}
            className={
              selectedOption === "Ngành nghề" ? "!w-auto" : ""
            }
          >
            <button
              onClick={() => handleItemClick(item)}
              className={`text-sm font-semibold rounded-3xl px-6 py-2 flex items-center justify-center
                border ${selectedItem === item
                  ? "bg-green-500 text-white border-green-600"
                  : "bg-gray-200 text-black hover:bg-white hover:text-green-500 border-transparent"
                } transition
                ${selectedOption === "Địa điểm"
                  ? "w-48"
                  : "whitespace-nowrap"
                }
              `}
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