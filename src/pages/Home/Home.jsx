import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faFilter } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';
import Searchbar from '../../components/Searchbar/Searchbar';
import JobItem from "../../components/JobItem/JobItem";
import LocationCarousel from '../../components/LocationCarousel/LocationCarousel';
import ImageSlider from '../../components/ImageSlider/ImageSlider';
import { fetchAllJobs } from '../../utils/ApiFunctions';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const images = [
    { src: 'register.webp', alt: 'Image 3' },
    { src: 'recruitment.jpg', alt: 'Image 4' },
    { src: 'jobfair.jpg', alt: 'Image 5' }
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
        // "Mức lương", // Uncomment if you add these features
        // "Kinh nghiệm", // Uncomment if you add these features
        "Ngành nghề"
    ];
    const [selectedItem, setSelectedItem] = useState("Tp Hồ Chí Minh");

    const isInitialMount = useRef(true);

    const handleChange = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        setPage(0);
        if (option === "Địa điểm") {
            setSelectedItem("Tp Hồ Chí Minh");
        } else if (option === "Ngành nghề") {
            setSelectedItem("Công nghệ thông tin");
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const loadJobs = async (currentPage, industryParam = '', addressParam = '') => {
        setLoading(true);
        const response = await fetchAllJobs(currentPage, 9, '', false, industryParam, addressParam);

        if (response && response.data) {
            const now = new Date();
            const filteredJobsByDeadline = response.data.filter(job => new Date(job.deadline) > now);

            setJobs(filteredJobsByDeadline);

            const totalFilteredElementsForPagination = filteredJobsByDeadline.length;
            const totalFilteredPagesForPagination = Math.ceil(totalFilteredElementsForPagination / 9);

            setTotalPages(totalFilteredPagesForPagination);
            setTotalElements(totalFilteredElementsForPagination);


            if (!filteredJobsByDeadline.length) {
                setPage(0);
            }

        } else if (response && response.error) {
            console.log("Error fetching jobs:", response.error);
            setJobs([]);
            setTotalPages(0);
            setTotalElements(0);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }

        let industryToFetch = "";
        let addressToFetch = "";

        if (selectedOption === "Ngành nghề") {
            industryToFetch = selectedItem;
        } else if (selectedOption === "Địa điểm") {
            addressToFetch = selectedItem === "Tp Hồ Chí Minh" ? "Hồ Chí Minh" : selectedItem;
        }
        loadJobs(page, industryToFetch, addressToFetch);

    }, [page, selectedItem, selectedOption]);

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 0) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    const handleItemSelected = (item) => {
        setPage(0);
        setSelectedItem(item);
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
                            Tiếp cận nhiều tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam
                        </p>
                    </div>

                    <div className="mt-6">
                        <Searchbar setResults />
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
                                        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="ml-20" /> {/* Corrected chevron direction */}
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Array(9).fill(0).map((_, index) => ( // Render 9 skeletons for loading
                                            <div key={index} className="p-2">
                                                <Skeleton height={180} />
                                                <div className="mt-2">
                                                    <Skeleton height={20} width={`80%`} />
                                                    <Skeleton height={15} width={`60%`} className="mt-1" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : jobs.length === 0 ? (
                                    <p>Hiện tại chưa có công việc phù hợp với yêu cầu của bạn</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Array.from(new Set(jobs.map(job => `${job.title}|${job.companyName}`))).map((uniqueJob) => {
                                            const [title, companyName] = uniqueJob.split('|');
                                            const jobToDisplay = jobs.find(job => job.title === title && job.companyName === companyName);
                                            return (
                                                <div key={jobToDisplay.id} className="p-2 h-full">
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
                                            className={`border rounded-full w-8 h-8 flex items-center justify-center ${page === 0 ? "border-gray-300 text-gray-300 cursor-not-allowed" : "border-green-500 text-green-500"
                                                }`}
                                            disabled={page === 0}
                                        >
                                            <FontAwesomeIcon icon={faChevronLeft} />
                                        </button>
                                        <span className="text-gray-500">
                                            <span className="text-green-500 font-bold">
                                                {totalPages === 0 ? 0 : page + 1}
                                            </span>
                                            / {totalPages} trang
                                        </span>
                                        <button
                                            onClick={handleNextPage}
                                            className={`border rounded-full w-8 h-8 flex items-center justify-center ${page >= totalPages - 1 || totalPages === 0 ? "border-gray-300 text-gray-300 cursor-not-allowed" : "border-green-500 text-green-500"
                                                }`}
                                            disabled={page >= totalPages - 1 || totalPages === 0}
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