import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faFilter } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Searchbar from '../../components/Searchbar/Searchbar';
import JobItem from "../../components/JobItem/JobItem";
import LocationCarousel from '../../components/LocationCarousel/LocationCarousel';
import ImageSlider from '../../components/ImageSlider/ImageSlider';
import { fetchAllJobs } from '../../utils/ApiFunctions';
import { ClipLoader } from 'react-spinners';

const images = [
    { src: 'register.webp', alt: 'Image 3' },
    { src: 'register.webp', alt: 'Image 4' },
    { src: 'register.webp', alt: 'Image 5' }
];

const Home = () => {
    const [selectedOption, setSelectedOption] = useState("Địa điểm");
    const [isOpen, setIsOpen] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const options = [
        "Địa điểm",
        "Mức lương",
        "Kinh nghiệm",
        "Ngành nghề"
    ];
    const [selectedItem, setSelectedItem] = useState("")

    const handleChange = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const loadJobs = async (currentPage, industry = "", address = "") => {
        setLoading(true);
        console.log("INDUSTRY", industry)
        const response = await fetchAllJobs(currentPage, 9, '', false, industry, address);
        if (response && response.data) {
            const filteredJobs = response.data.filter(job => job.status === "SHOW");
            setJobs(filteredJobs);
            if (!jobs.length)
                setLoading(false);
            // setJobs(response.data);
            // if (!jobs.length) {
            //     setTotalPages(0);
            //     setTotalElements(0);
            //     setLoading(false);
            //     return;
            // }
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } else if (response && response.error) {
            console.log("Error fetching jobs:", response.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedOption === "Ngành nghề") {
            loadJobs(page, selectedItem, "");
        } else if (selectedOption === "Địa điểm") {
            console.log("THANHPHO", selectedItem)
            if (selectedItem === "Thành phố Hồ Chí Minh")
                setSelectedItem("Hồ Chí Minh");
            loadJobs(page, "", selectedItem);
        } else {
            loadJobs(page);
        }
    }, [page, selectedItem, selectedOption]);

    const handleNextPage = () => {
        if (jobs.length > 0) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 0 && jobs.length > 0) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    const handleItemSelected = (item) => {
        setSelectedItem(item);
        // console.log("Item được chọn từ LocationCarousel:", item);
    };

    return (
        <>
            <div className="bg-[#EFFFF6] py-4 w-full">
                <div className="px-8 max-w-[1280px] mx-auto">
                    <div className="text-center">
                        <h1 className="text-green-600 text-3xl font-bold mb-2">
                            Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc.
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">
                            Tiếp cận <span className="font-bold text-black">40,000+</span> tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam
                        </p>
                    </div>

                    <div className="mt-6">
                        <Searchbar setResults />
                    </div>

                    <div className="mt-4 text-center text-gray-600">
                        <span className="mr-6">Vị trí chờ bạn khám phá <span className="text-green-500 font-bold">44,818</span></span>
                        <span className="mr-6">Việc làm mới nhất <span className="text-green-500 font-bold">3,048</span></span>
                        <span>Cập nhật lúc: <span className="text-green-500 font-bold">14:39 17/10/2024</span></span>
                    </div>
                </div>
            </div>
            <div className='px-8 max-w-[1280px] mx-auto'>
                <ImageSlider images={images} initialSlide={0} />
            </div>
            <section className=" w-full">
                <div className="container mx-auto px-8">
                    <div className="relative py-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <h2 className="text-2xl font-bold text-green-500">Việc làm tốt nhất</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-black">
                                    <a href="">Xem tất cả</a>
                                </span>
                                <span className="flex items-center border border-green-500 rounded-full w-8 h-8 justify-center cursor-pointer" onClick={handlePrevPage}>
                                    <FontAwesomeIcon icon={faChevronLeft} className="text-green-500" />
                                </span>
                                <span className="flex items-center border border-green-500 rounded-full w-8 h-8 justify-center cursor-pointer" onClick={handleNextPage}>
                                    <FontAwesomeIcon icon={faChevronRight} className="text-green-500" />
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <div className="bg-white border border-gray-500 rounded-[10px] p-2 w-80 mt-0 relative">
                                <div className="flex items-center">
                                    <span className="flex items-center bg-transparent border-none font-medium text-lg">
                                        <FontAwesomeIcon icon={faFilter} className="text-gray-500 mr-2" />
                                        Lọc theo:
                                    </span>
                                    <span className="ml-4 cursor-pointer text-center flex-grow" onClick={toggleDropdown}>
                                        {selectedOption}
                                        <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronUp} className="ml-20" />
                                    </span>
                                    {isOpen && (
                                        <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-md z-10 w-full">
                                            <ul className="list-none p-0 m-0">
                                                {options.map((option) => (
                                                    <li
                                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                                        key={option}
                                                        onClick={() => handleChange(option)}
                                                    >
                                                        {option}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='w-[700px]'>
                                <LocationCarousel
                                    selectedOption={selectedOption}
                                    onItemSelect={handleItemSelected}
                                />
                            </div>
                        </div>

                        <div className="mt-12">
                            <div className="pb-1">
                                {loading ? (
                                    <div className="flex justify-center items-center min-h-screen">
                                        <ClipLoader color="#4caf50" size={40} />
                                    </div>
                                ) : jobs.length === 0 ? (
                                    <p>Hiện tại chưa có công việc phù hợp với yêu cầu của bạn</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Array.from(new Set(jobs.map(job => `${job.title}|${job.companyName}`))).map((uniqueJob) => {
                                            const [title, companyName] = uniqueJob.split('|');
                                            const jobToDisplay = jobs.find(job => job.title === title && job.companyName === companyName);
                                            return (
                                                <div key={jobToDisplay.id} className="p-2">
                                                    <JobItem job={jobToDisplay} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                <div className="mt-4">
                                    <div className="mt-4 text-center flex items-center justify-center gap-2">
                                        <button
                                            onClick={handlePrevPage}
                                            className={`border rounded-full w-8 h-8 flex items-center justify-center ${page === 0 ? "border-gray-300 text-gray-300" : "border-green-500 text-green-500"
                                                }`}
                                            disabled={page === 0}
                                        >
                                            <FontAwesomeIcon icon={faChevronLeft} />
                                        </button>
                                        <span className="text-gray-500">
                                            <span className="text-green-500 font-bold">
                                                {totalPages === 0 ? page : page + 1}
                                            </span>
                                            / {totalPages} trang
                                        </span>
                                        <button
                                            onClick={handleNextPage}
                                            className={`border rounded-full w-8 h-8 flex items-center justify-center ${page === totalPages - 1 ? "border-gray-300 text-gray-300" : "border-green-500 text-green-500"
                                                }`}
                                            disabled={page === totalPages - 1}
                                        >
                                            <FontAwesomeIcon icon={faChevronRight} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
