import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faSearch,
  faChevronDown,
  faLocationDot,
  faBriefcase,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { fetchAllJobs } from "../../utils/ApiFunctions";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import useDebounce from "../../utils/useDebounce";

const Searchbar = () => {
  const cities = [
    { label: "Tất cả tỉnh/thành phố", value: "" },
    { label: "Hà Nội", value: 1 },
    { label: "Hồ Chí Minh", value: 2 },
    { label: "Bình Dương", value: 3 },
    { label: "Bắc Ninh", value: 4 },
    { label: "Đồng Nai", value: 5 },
    { label: "Hưng Yên", value: 6 },
    { label: "Hải Dương", value: 7 },
    { label: "Đà Nẵng", value: 8 },
    { label: "Hải Phòng", value: 9 },
    { label: "An Giang", value: 10 },
    { label: "Bà Rịa-Vũng Tàu", value: 11 },
    { label: "Bắc Giang", value: 12 },
    { label: "Bắc Kạn", value: 13 },
    { label: "Bạc Liêu", value: 14 },
    { label: "Bến Tre", value: 15 },
    { label: "Bình Định", value: 16 },
    { label: "Bình Phước", value: 17 },
    { label: "Bình Thuận", value: 18 },
    { label: "Cà Mau", value: 19 },
    { label: "Cần Thơ", value: 20 },
    { label: "Cao Bằng", value: 21 },
    { label: "Cửu Long", value: 22 },
    { label: "Đắk Lắk", value: 23 },
    { label: "Đắc Nông", value: 24 },
    { label: "Điện Biên", value: 25 },
    { label: "Đồng Tháp", value: 26 },
    { label: "Gia Lai", value: 27 },
    { label: "Hà Giang", value: 28 },
    { label: "Hà Nam", value: 29 },
    { label: "Hà Tĩnh", value: 30 },
    { label: "Hậu Giang", value: 31 },
    { label: "Hoà Bình", value: 32 },
    { label: "Khánh Hoà", value: 33 },
    { label: "Kiên Giang", value: 34 },
    { label: "Kon Tum", value: 35 },
    { label: "Lai Châu", value: 36 },
    { label: "Lâm Đồng", value: 37 },
    { label: "Lạng Sơn", value: 38 },
    { label: "Lào Cai", value: 39 },
    { label: "Long An", value: 40 },
    { label: "Miền Bắc", value: 41 },
    { label: "Miền Nam", value: 42 },
    { label: "Miền Trung", value: 43 },
    { label: "Nam Định", value: 44 },
    { label: "Nghệ An", value: 45 },
    { label: "Ninh Bình", value: 46 },
    { label: "Ninh Thuận", value: 47 },
    { label: "Phú Thọ", value: 48 },
    { label: "Phú Yên", value: 49 },
    { label: "Quảng Bình", value: 50 },
    { label: "Quảng Nam", value: 51 },
    { label: "Quảng Ngãi", value: 52 },
    { label: "Quảng Ninh", value: 53 },
    { label: "Quảng Trị", value: 54 },
    { label: "Sóc Trăng", value: 55 },
    { label: "Sơn La", value: 56 },
    { label: "Tây Ninh", value: 57 },
    { label: "Thái Bình", value: 58 },
    { label: "Thái Nguyên", value: 59 },
    { label: "Thanh Hoá", value: 60 },
    { label: "Thừa Thiên Huế", value: 61 },
    { label: "Tiền Giang", value: 62 },
    { label: "Toàn Quốc", value: 63 },
    { label: "Trà Vinh", value: 64 },
    { label: "Tuyên Quang", value: 65 },
    { label: "Vĩnh Long", value: 66 },
    { label: "Vĩnh Phúc", value: 67 },
    { label: "Yên Bái", value: 68 },
    { label: "Nước Ngoài", value: 100 },
  ];

  const jobs = [
    { label: "Tất cả ngành nghề", value: "" },
    // { label: "An toàn lao động", value: 10101 },
    { label: "Kỹ thuật", value: 10102 },
    // { label: "Bán lẻ / bán sỉ", value: 10103 },
    // { label: "Báo chí / Truyền hình", value: 10004 },
    // { label: "Bảo hiểm", value: 10006 },
    // { label: "Bảo trì / Sửa chữa", value: 10104 },
    { label: "Bất động sản", value: 10007 },
    // { label: "Biên / Phiên dịch", value: 10003 },
    // { label: "Bưu chính - Viễn thông", value: 10005 },
    // { label: "Chứng khoán / Vàng / Ngoại tệ", value: 10008 },
    // { label: "Cơ khí / Chế tạo / Tự động hóa", value: 10010 },
    // { label: "Công nghệ cao", value: 10009 },
    // { label: "Công nghệ Ô tô", value: 10052 },
    { label: "Công nghệ thông tin", value: 10131 },
    // { label: "Dầu khí/Hóa chất", value: 10012 },
    // { label: "Dệt may / Da giày", value: 10013 },
    // { label: "Địa chất / Khoáng sản", value: 10111 },
    // { label: "Dịch vụ khách hàng", value: 10014 },
    // { label: "Điện / Điện tử / Điện lạnh", value: 10016 },
    // { label: "Điện tử viễn thông", value: 10015 },
    // { label: "Du lịch", value: 10011 },
    // { label: "Dược phẩm / Công nghệ sinh học", value: 10110 },
    { label: "Giáo dục", value: 10017 },
    // { label: "Hàng cao cấp", value: 10113 },
    // { label: "Hàng gia dụng", value: 10020 },
    // { label: "Hàng hải", value: 10021 },
    // { label: "Hàng không", value: 10022 },
    // { label: "Hàng tiêu dùng", value: 10117 },
    // { label: "Hành chính / Văn phòng", value: 10023 },
    // { label: "Hoá học / Sinh học", value: 10018 },
    // { label: "Hoạch định/Dự án", value: 10019 },
    // { label: "In ấn / Xuất bản", value: 10024 },
    // { label: "IT Phần cứng / Mạng", value: 10025 },
    // { label: "IT phần mềm", value: 10026 },
    { label: "Kế toán", value: 10028 },
    // { label: "Khách sạn / Nhà hàng", value: 10027 },
    // { label: "Kiến trúc", value: 10120 },
    // { label: "Kinh doanh / Bán hàng", value: 10001 },
    // { label: "Logistics", value: 10048 },
    // { label: "Luật/Pháp lý", value: 10036 },
    { label: "Marketing / Truyền thông / Quảng cáo", value: 10029 },
    // { label: "Môi trường / Xử lý chất thải", value: 10030 },
    // { label: "Mỹ phẩm / Trang sức", value: 10031 },
    // { label: "Mỹ thuật / Nghệ thuật / Điện ảnh", value: 10032 },
    // { label: "Ngân hàng / Tài chính", value: 10033 },
    // { label: "Ngành nghề khác", value: 11000 },
    // { label: "NGO / Phi chính phủ / Phi lợi nhuận", value: 10132 },
    // { label: "Nhân sự", value: 10034 },
    // { label: "Nông / Lâm / Ngư nghiệp", value: 10035 },
    // { label: "Phi chính phủ / Phi lợi nhuận", value: 10124 },
    // { label: "Quản lý chất lượng (QA/QC)", value: 10037 },
    // { label: "Quản lý điều hành", value: 10038 },
    // { label: "Sản phẩm công nghiệp", value: 10125 },
    // { label: "Sản xuất", value: 10126 },
    // { label: "Spa / Làm đẹp", value: 10130 },
    // { label: "Tài chính / Đầu tư", value: 10127 },
    // { label: "Thiết kế đồ họa", value: 10039 },
    // { label: "Thiết kế nội thất", value: 10128 },
    { label: "Thời trang", value: 10042 },
    // { label: "Thư ký / Trợ lý", value: 10129 },
    // { label: "Thực phẩm / Đồ uống", value: 10043 },
    // { label: "Tổ chức sự kiện / Quà tặng", value: 10046 },
    // { label: "Tư vấn", value: 10045 },
    // { label: "Vận tải / Kho vận", value: 10047 },
    // { label: "Xây dựng", value: 10050 },
    // { label: "Xuất nhập khẩu", value: 10049 },
    { label: "Y tế", value: 10051 },
  ];

  const [input, setInput] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isJobOpen, setIsJobOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState(cities);
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [results, setResults] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [debouncedInput] = useDebounce(searchTitle, 500);


  const handleSearch = () => {
    navigate("/tim-viec-lam", {
      state: {
        searchTitle: searchTitle,
        jobSuggestions: jobSuggestions,
      },
    });
  };


  const [filterOption, setFilterOption] = useState("1");

  const searchbarRef = useRef(null);

  const handleClickOutside = (event) => {
    if (searchbarRef.current && !searchbarRef.current.contains(event.target)) {
      setIsInputFocused(false);
      setIsJobOpen(false);
      setIsCityOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true); // Bắt đầu loading
      try {
        if (selectedJob === "Tất cả ngành nghề") setSelectedJob("");
        if (selectedCity === "Tất cả tỉnh/thành phố") setSelectedCity("");

        console.log("JOBNE", selectedJob);
        console.log("CITYNE", selectedCity);

        const { data, error } = await fetchAllJobs(0, 10, searchTitle, true, selectedJob, selectedCity);
        if (!error) {
          setJobSuggestions(data);
        } else {
          setError(error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); // Dừng loading sau khi hoàn thành
      }
    };

    if (debouncedInput && debouncedInput.trim() !== "") {
      fetchJobs();
    } else {
      setJobSuggestions([]);
    }
  }, [selectedJob, selectedCity, debouncedInput]);
  const fetchData = (value) => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => {
        const result = json.filter((user) => {
          return (
            value &&
            user &&
            user.name &&
            user.name.toLowerCase().includes(value)
          );
        });
        setResults(result);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setFilteredCities(
      cities.filter((city) =>
        city.label.toLowerCase().includes(value.toLowerCase())
      )
    );
    setIsCityOpen(true);
    setIsInputFocused(false);
  };

  const handleJobChange = (e) => {
    const value = e.target.value;
    setFilteredJobs(
      jobs.filter((job) =>
        job.label.toLowerCase().includes(value.toLowerCase())
      )
    );
    setIsJobOpen(true);
    setIsInputFocused(false);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    setIsJobOpen(false);
    setIsCityOpen(false);
  };

  const handleCitySelect = (option) => {
    setSelectedCity(option.label);
    setIsCityOpen(false);
  };

  const handleJobSelect = (option) => {
    setSelectedJob(option.label);
    setIsJobOpen(false);
    setIsCityOpen(false);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    setIsJobOpen(false);
    setIsCityOpen(false)
  };
  const handleInputBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsCityOpen(false);
      setIsJobOpen(false);
    }
  };

  return (
    <div ref={searchbarRef} className="relative">
      <div className="bg-white w-full rounded-full h-16 px-4 py-5 shadow-md border border-gray-300 flex items-center">
        <div className="flex items-center relative w-full max-w-[500px]">
          <input
            className="bg-transparent border-none w-full h-full text-xl focus:outline-none"
            placeholder="Vị trí tuyển dụng"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => {
              setInput("");
              setResults([]);
            }}
            style={{ display: input ? "block" : "none" }}
          />
        </div>

        <div className="border-l border-gray-300 h-10 mx-2 hidden-on-small"></div>

        <div className="relative w-full max-w-[230px] flex-grow hidden-on-small">
          <div
            className="flex justify-between items-center p-3 cursor-pointer rounded-lg text-lg w-full"
            onClick={() => setIsCityOpen((prev) => !prev)}
          >
            <FontAwesomeIcon
              icon={faLocationDot}
              className="mr-2 text-gray-600"
            />
            <input
              type="text"
              value={selectedCity}
              className="border-none outline-none w-full bg-transparent cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis"
              placeholder={cities[0].label}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                handleCityChange(e);
              }}
              onClick={() => setIsInputFocused(false)}
            />
            <FontAwesomeIcon
              className={`text-gray-400 text-2xl ml-2 ${isCityOpen ? "rotate-180" : ""
                }`}
              icon={faChevronDown}
            />
          </div>
          {isCityOpen && (
            <ul className="absolute left-0 right-0 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1 z-10">
              {filteredCities.map((option) => (
                <li
                  key={option.value}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleCitySelect(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-l border-gray-300 h-10 mx-2 hidden-on-small"></div>

        <div className="relative w-full max-w-[230px] flex-grow hidden-on-small">
          <div
            className="flex justify-between items-center p-3 cursor-pointer rounded-lg text-lg w-full"
            onClick={() => setIsJobOpen((prev) => !prev)}
          >
            <FontAwesomeIcon
              icon={faBriefcase}
              className="mr-2 text-gray-600"
            />
            <input
              type="text"
              value={selectedJob}
              className="border-none outline-none w-full bg-transparent cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis"
              placeholder={jobs[0].label}
              onChange={(e) => {
                setSelectedJob(e.target.value);
                handleJobChange(e);
              }}
              onClick={() => setIsInputFocused(false)}
            />
            <FontAwesomeIcon
              className={`text-gray-400 text-2xl ml-2 ${isJobOpen ? "rotate-180" : ""
                }`}
              icon={faChevronDown}
            />
          </div>
          {isJobOpen && (
            <ul className="absolute left-0 right-0 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1 z-10">
              {filteredJobs.map((option) => (
                <li
                  key={option.value}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleJobSelect(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-l border-gray-300 h-10 mx-1 hidden-on-small"></div>

        <button
          className="ml-auto bg-green-500 text-white rounded-full py-3 px-6 
                    flex items-center hover:bg-green-700 transition-colors duration-300"
          onClick={handleSearch}
        >
          <FontAwesomeIcon icon={faSearch} />
          <span className="ml-1">Tìm kiếm</span>
        </button>
      </div>

      {isInputFocused && (
        <div className="absolute top-full left-0 bg-[#f0f4ff] p-4 rounded-lg w-full flex mt-4 hidden-on-small:flex hidden-on-small:flex-col z-40">
          <div className="flex flex-col w-full max-w-[530px] min-w-[530px]">
            <div className="flex items-center">
              <div className="mr-2">Tìm kiếm theo:</div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <input
                    id="type-keyword-search-1"
                    type="radio"
                    name="type-keyword-temp"
                    value="1"
                    checked={filterOption === "1"}
                    onChange={handleFilterChange}
                    className="form-radio h-5 w-5"
                  />
                  <label htmlFor="type-keyword-search-1">Tên việc làm</label>
                </div>
                {/* <div className="flex items-center gap-1">
                  <input
                    id="type-keyword-search-2"
                    type="radio"
                    name="type-keyword-temp"
                    value="2"
                    checked={filterOption === "2"}
                    onChange={handleFilterChange}
                    className="form-radio h-5 w-5"
                  />
                  <label htmlFor="type-keyword-search-2">Tên công ty</label>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    id="type-keyword-search-3"
                    type="radio"
                    name="type-keyword-temp"
                    value="3"
                    checked={filterOption === "3"}
                    onChange={handleFilterChange}
                    className="form-radio h-5 w-5"
                  />
                  <label htmlFor="type-keyword-search-3">Cả hai</label>
                </div> */}
              </div>
            </div>

            <div className="flex flex-col mt-2 pt-2 w-full max-h-72 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <ClipLoader color="#4caf50" size={40} />
                </div>
              ) : jobSuggestions.length > 0 ? (
                Array.from(new Set(jobSuggestions.map((job) => job.title))).map((title) => (
                  <div key={title} className="p-2 w-full hover:bg-gray-200">
                    <p>{title}</p>
                  </div>
                ))
              ) : (
                <p className="p-2 text-gray-500">No results found.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col ml-5 hidden-on-small:ml-0">
            <div className="font-semibold mb-2">Việc làm bạn có thể quan tâm</div>
            <div className="flex flex-col">
              {isLoading ? (
                <div className="flex justify-center items-center h-20">
                  <ClipLoader color="#4caf50" size={40} />
                </div>
              ) : jobSuggestions.length > 0 ? (
                Array.from(new Set(jobSuggestions.map(job => job.companyName))).map((companyName) => {
                  const jobsForCompany = jobSuggestions.filter(job => job.companyName === companyName);

                  return (
                    <Link
                      to={`/viec-lam/${jobsForCompany[0].id}`}
                      className="flex items-center p-2 hover:bg-[#e0e7ff] transition-colors w-[600px] relative group"
                      key={companyName}
                    >
                      <div className="mr-2">
                        <img
                          src={jobsForCompany[0].companyImages}
                          alt={"Image"}
                          className="w-24 h-auto"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[#263a4d] font-semibold truncate">
                          {jobsForCompany[0].title}
                        </p>
                        <p className="text-gray-600 text-sm truncate">
                          {companyName}
                        </p>
                        <div className="text-green-600 text-sm font-semibold">
                          {jobsForCompany[0].salary.toLocaleString()}
                        </div>
                      </div>
                      <div className="ml-4 text-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <FontAwesomeIcon icon={faArrowRight} />
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center mt-4">Không có việc làm nào phù hợp.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
