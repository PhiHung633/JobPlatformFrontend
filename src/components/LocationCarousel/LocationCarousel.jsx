import { useEffect, useState } from "react";
import Carousel from "react-grid-carousel";

const LocationCarousel = ({ selectedOption, onItemSelect }) => {
  const locations = [
    "Thành phố Hồ Chí Minh",
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

  const [selectedItem, setSelectedItem] = useState(null);

  const dataToDisplay =
    selectedOption === "Địa điểm"
      ? locations
      : selectedOption === "Ngành nghề"
        ? industries
        : [];

  // Chỉ thiết lập giá trị mặc định khi `selectedOption` thay đổi
  useEffect(() => {
    if (dataToDisplay.length) {
      setSelectedItem(dataToDisplay[0]); // Đặt giá trị mặc định
      onItemSelect(dataToDisplay[0]); // Truyền giá trị mặc định ra ngoài
    }
  }, [selectedOption]); // Chỉ chạy khi `selectedOption` thay đổi

  const handleItemClick = (item) => {
    setSelectedItem(item);
    onItemSelect(item);
  };

  return (
    <div className="py-4">
      <Carousel cols={4} rows={1} gap={10} loop>
        {dataToDisplay.map((item, index) => (
          <Carousel.Item key={index}>
            <button
              onClick={() => handleItemClick(item)}
              className={`${selectedItem === item
                  ? "bg-green-500 text-white cursor-default"
                  : "bg-gray-200 text-black hover:bg-white hover:border-green-400 hover:text-green-500"
                } text-sm font-semibold rounded-3xl px-2 w-full h-full flex items-center justify-center border border-transparent`}
            >
              {item}
            </button>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default LocationCarousel;
