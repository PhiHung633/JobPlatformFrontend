import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBarv2 from "../../components/Searchbarv2/Searchbarv2";
import { faDollar, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const JobsSearch = () => {
    const [sortOption, setSortOption] = useState("newest");

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };
    return (
        <>
            {/* Search Bar */}
            <div className="mb-4">
                <SearchBarv2 />
            </div>
            <div className="container mx-auto max-w-6xl mt-8 px-6">
                <div className="flex items-center gap-4">
                    <span className="text-gray-400 font-semibold">Ưu tiên hiển thị theo:</span>
                    <label className="flex items-center gap-2 text-gray-700">
                        <input
                            type="radio"
                            name="sort"
                            value="newest"
                            checked={sortOption === "newest"}
                            onChange={handleSortChange}
                            className="form-radio text-green-500 w-5 h-5 focus:ring-0 focus:ring-offset-0"
                        />
                        Mới nhất
                    </label>
                    <label className="flex items-center gap-2 text-gray-700">
                        <input
                            type="radio"
                            name="sort"
                            value="highSalary"
                            checked={sortOption === "highSalary"}
                            onChange={handleSortChange}
                            className="form-radio text-green-500 w-5 h-5 focus:ring-0 focus:ring-offset-0"
                        />
                        Lương cao đến thấp
                    </label>
                    <label className="flex items-center gap-2 text-gray-700">
                        <input
                            type="radio"
                            name="sort"
                            value="relevance"
                            checked={sortOption === "relevance"}
                            onChange={handleSortChange}
                            className="form-radio text-green-500 w-5 h-5 focus:ring-0 focus:ring-offset-0" // Increased size
                        />
                        Ngày đăng
                    </label>
                </div>
            </div>

            <div className="container mx-auto px-6 py-4 max-w-6xl "> 
                {/* Job Result */}
                <div className="flex justify-between gap-6"> 

                    <div className="flex-[6]">
                        <div className="w-full max-w-3xl"> 
                            <div className="flex items-center p-4 border rounded-xl bg-green-50 border-gray-200 shadow-sm hover:border-green-500 duration-300 group">
                                <div className="flex">
                                    <img
                                        src="https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/trung-tam-do-kiem-va-sua-chua-thiet-bi-vien-thong-mobifone-chi-nhanh-tong-cong-ty-vien-thong-mobifone-be99ecb83616ab938080d3e195b604ac-6710c2239e084.jpg"
                                        alt="Mobifone Logo"
                                        className="w-32 h-28 mr-4 border border-gray-500 rounded-xl"
                                    />
                                    <div className="flex flex-col justify-between">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-bold text-gray-800 flex-1 group-hover:text-green-400 duration-300">
                                                Chuyên Viên Đo Kiểm Tối Ưu/ Chuyên Viên Công Nghệ Thông Tin/ Chuyên Viên Sản Xuất Thiết Bị
                                            </h3>
                                            <span className="text-sm text-green-500 font-semibold ml-4">Thoả thuận</span>
                                        </div>

                                        <p className="text-sm text-gray-500">
                                            TRUNG TÂM ĐO KIỂM VÀ SỬA CHỮA THIẾT BỊ VIỄN THÔNG MOBIFONE - CHI NHÁNH...
                                        </p>
                                        <div className="flex space-x-2 mt-2 border-b-2 pb-2">
                                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-xl">Hà Nội</span>
                                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-xl">Không yêu cầu kinh nghiệm</span>
                                        </div>

                                        <div className="flex justify-between items-center mt-2 relative">
                                            <div className="text-sm text-gray-800">Kỹ sư hệ thống</div>
                                            <div className="flex items-center ml-auto">
                                                <button className="absolute right-10 text-white font-semibold hidden group-hover:block bg-green-500 px-5 py-2 rounded-xl shadow-md">
                                                    Ứng tuyển
                                                </button>
                                                <span className="text-xs text-gray-500 mr-4 group-hover:hidden ">Cập nhật 2 giờ trước</span>
                                                <button className="text-red-400 text-xl focus:outline-none">❤</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="flex-[2]">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Có thể bạn quan tâm</h3>
                        <div className="bg-white rounded-xl shadow-md p-4 border border-green-400">
                            <div className="p-2 rounded-lg mb-4">
                                <div className="flex items-center mb-3">
                                    <img src="/logo-cong-ty-dat-xanh-mien-nam.jpg" alt="Company logo" className="w-14 h-14 rounded-full mr-3" />
                                    <div>
                                        <h4 className="text-base font-bold">Công ty CP Đầu tư và Dịch vụ Đất Xanh Miền Nam</h4>
                                    </div>
                                </div>
                                <ul className="space-y-5">
                                    <li className="flex flex-col space-y-3 text-gray-800">
                                        <span>Chuyên Viên Hành Chính - 2 Năm Kinh Nghiệm</span>
                                        <div className="flex gap-5">
                                            <span className="flex items-center gap-1">
                                                <span className="inline-flex justify-center items-center w-5 h-5 bg-green-400 rounded-full">
                                                    <FontAwesomeIcon icon={faDollar} className="text-white text-xs" />
                                                </span>
                                                <p className="text-sm text-green-500">Thỏa thuận</p>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="inline-flex justify-center items-center w-5 h-5 bg-green-400 rounded-full">
                                                    <FontAwesomeIcon icon={faLocationDot} className="text-white text-xs" />
                                                </span>
                                                <p className="text-sm text-gray-500">Hồ Chí Minh</p>
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <button className="w-full bg-green-500 text-white font-semibold py-2 rounded-xl hover:bg-green-600">
                                Tìm hiểu ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export default JobsSearch;
