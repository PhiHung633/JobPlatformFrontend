import { faLocationDot, faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

const SearchBarv2 = () => {
    const [searchData, setSearchData] = useState({
        jobTitle: '',
        location: '',
        industry: ''
    });
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [results, setResults] = useState([]);
    const [jobSuggestions, setJobSuggestions] = useState([
        { title: "Frontend Developer", companyName: "ABC Company", salary: "$3000", logo: "path/to/logo" },
        { title: "Backend Developer", companyName: "XYZ Corp", salary: "$2500", logo: "path/to/logo" }
    ]);
    const [filterOption, setFilterOption] = useState("1");

    // Fetch data based on search input value
    const fetchData = (value) => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((response) => response.json())
            .then((json) => {
                const result = json.filter((user) => {
                    return (
                        value &&
                        user &&
                        user.name &&
                        user.name.toLowerCase().includes(value.toLowerCase())  // Match input value with user name
                    );
                });
                setResults(result);
            });
    };

    const handleFilterChange = (e) => {
        setFilterOption(e.target.value);
    };

    const handleInputChange = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });

        // If the input is from jobTitle, fetch data based on it
        if (e.target.name === "jobTitle") {
            fetchData(e.target.value); // Pass the input value to fetchData
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Search data:', searchData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[#19734E] p-4 rounded-lg flex justify-center ">
            <div className="flex items-center w-full max-w-3xl bg-white rounded-xl overflow-hidden px-5 relative">
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
                        <option value="">Địa điểm</option>
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
                    <option value="">Ngành nghề</option>
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
                                <div className="flex items-center gap-1">
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
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col mt-2 pt-2 w-full max-h-72 overflow-y-auto">
                            {results.length > 0 ? (
                                results.map((result, id) => (
                                    <div key={id} className="p-2 w-full hover:bg-gray-200">
                                        <p>{result.name}</p>
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
                            {jobSuggestions.map((job, index) => (
                                <a
                                    href={job.link}
                                    className="flex items-center p-2 hover:bg-[#e0e7ff] transition-colors w-[500px] relative group"
                                    key={index}
                                >
                                    <div className="mr-2">
                                        <img
                                            src={job.logo}
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
                                            {job.salary}
                                        </div>
                                    </div>
                                    <div className="ml-4 text-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
};

export default SearchBarv2;
