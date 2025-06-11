import { faLocationDot, faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { fetchAllJobs } from '../../utils/ApiFunctions';
import { Link } from 'react-router-dom';
import useDebounce from '../../utils/useDebounce';

const SearchBarv2 = ({ searchTitle = '' }) => {
    const [searchData, setSearchData] = useState({
        jobTitle: searchTitle,
        location: '',
        industry: ''
    });
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [jobSuggestions, setJobSuggestions] = useState([]);
    const [filterOption, setFilterOption] = useState("1");
    const debouncedSearchTitle = useDebounce(searchData.jobTitle, 500);

    const formRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setIsInputFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fetch job data từ API
    const fetchJobs = async () => {
        try {
            let job = searchData.industry;
            let city = searchData.location;
            console.log("UAPHAIKOTA", searchData)
            if (job === "Tất cả ngành nghề") job = "";
            if (city === "Tất cả tỉnh/thành phố") city = "";

            const { data, error } = await fetchAllJobs(0, 10, searchData.jobTitle, true, job, city);

            if (!error) {
                setJobSuggestions(data);
            } else {
                console.error("Lỗi:", error);
            }
        } catch (err) {
            console.error("Lỗi hệ thống:", err.message);
        }
    };

    const handleFilterChange = (e) => {
        setFilterOption(e.target.value);
    };

    const handleInputChange = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });

        // Nếu người dùng nhập vào tên công việc thì gọi API
        if (e.target.name === "jobTitle") {
            fetchJobs();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    useEffect(() => {
        if (debouncedSearchTitle.trim() !== "") {
            fetchJobs();
        }
    }, [debouncedSearchTitle]);

    return (
        <form ref={formRef}
            onSubmit={handleSubmit} className="bg-[#19734E] p-4 rounded-lg flex justify-center relative">
            <div className="flex items-center w-full max-w-3xl bg-white rounded-xl overflow-hidden px-5">
                <div className="relative w-full">
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        name="jobTitle"
                        value={searchData.jobTitle}
                        onChange={handleInputChange}
                        placeholder="Vị trí tuyển dụng, tên công ty"
                        className="w-full pl-10 pr-4 py-2 focus:outline-none border-none"
                        onFocus={() => setIsInputFocused(true)}
                    />
                </div>

                <div className="relative border-l border-gray-300 pl-3">
                    <FontAwesomeIcon
                        icon={faLocationDot}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <select
                        name="location"
                        value={searchData.location}
                        onChange={handleInputChange}
                        className="pl-10 pr-4 py-2 border-none focus:outline-none"
                    >
                        <option value="">Tất cả tỉnh/thành phố</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    </select>
                </div>
            </div>

            <div className="relative w-48 ml-4">
                <select
                    name="industry"
                    value={searchData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-green-500"
                >
                    <option value="">Tất cả ngành nghề</option>
                    <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                    <option value="Marketing">Marketing</option>
                </select>
            </div>

            <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 ml-4 rounded-xl hover:bg-green-600"
            >
                Tìm kiếm
            </button>

            {isInputFocused && (
                <div className="bg-[#f0f4ff] p-7 rounded-xl flex mt-12 hidden-on-small:flex hidden-on-small:flex-col absolute z-50">
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
                            </div>
                        </div>

                        <div className="flex flex-col mt-2 pt-2 w-full max-h-72 overflow-y-auto">
                            {jobSuggestions.length > 0 ? (
                                jobSuggestions.map((result, id) => (
                                    <div key={id} className="p-2 w-full hover:bg-gray-200">
                                        <p>{result.title}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="p-2 text-gray-500 text-center italic">Không tìm thấy kết quả.</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col ml-5 hidden-on-small:ml-0">
                        <div className="font-semibold mb-2">Việc làm bạn có thể quan tâm</div>
                        <div className="flex flex-col">
                            {
                                jobSuggestions.length > 0 ? (
                                    jobSuggestions.map((job, index) => (
                                        <Link
                                            href={job.link}
                                            className="flex items-center p-2 hover:bg-[#e0e7ff] transition-colors w-[600px] relative group"
                                            key={index}
                                        >
                                            <div className="mr-2">
                                                <img
                                                    src={job.companyImages}
                                                    alt={job.companyName}
                                                    className="w-24 h-auto"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[#263a4d] font-semibold truncate">
                                                    {job.title}
                                                </p>
                                                <p className="text-gray-600 text-sm truncate">
                                                    {job.companyName}
                                                </p>
                                                <div className="text-green-600 text-sm font-semibold">
                                                    {job.salary ? `${job.salary.toLocaleString()} VNĐ` : "Thoả thuận"}
                                                </div>
                                            </div>
                                            <div className="ml-4 text-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                <FontAwesomeIcon icon={faArrowRight} />
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center mt-4">Không có việc làm nào phù hợp.</p>
                                )}
                        </div>
                    </div>

                </div>
            )}
        </form>
    );
};

export default SearchBarv2;
