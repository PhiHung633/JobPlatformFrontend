import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBarv2 from "../../components/Searchbarv2/Searchbarv2";
import { faDollar, faHeart, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO, parse } from "date-fns";
import { vi } from "date-fns/locale";
import JobApplicationPopup from "../../components/JobDetail/JobApplicationPopup";
import { addJobSave, deleteJobSave, fetchJobSavesByUser } from "../../utils/ApiFunctions";

const JobsSearch = () => {
    const [sortOption, setSortOption] = useState("newest");
    const location = useLocation();
    const navigate = useNavigate();
    const { searchTitle, jobSuggestions } = location.state || { searchTitle: "", jobSuggestions: [] };
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [favorites, setFavorites] = useState({});

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const navigateToJobDetails = (jobId) => {
        navigate(`/viec-lam/${jobId}`);
    };

    const handleApplyClick = () => {
        setIsPopupOpen(true);
    };

    const handleCloseClick = () => {
        setIsPopupOpen(false);
    };

    const getRelativeTime = (dateString) => {
        if (!dateString) return "Cập nhật gần đây";

        try {
            const date = parseISO(dateString);
            return `Đăng ${formatDistanceToNow(date, { locale: vi, addSuffix: true })}`;
        } catch (error) {
            console.error("Invalid date format:", error);
            return "Cập nhật gần đây";
        }
    };

    const handleFavoriteClick = async (jobId) => {
        if (favorites[jobId]) {
            await deleteJobSave(jobId);
            setFavorites((prev) => ({ ...prev, [jobId]: false }));
        } else {
            await addJobSave(jobId);
            setFavorites((prev) => ({ ...prev, [jobId]: true }));
        }
    };

    useEffect(() => {
        const checkJobSaveStatus = async () => {
            const { data, error } = await fetchJobSavesByUser();
            if (error) {
                console.error("Error fetching job saves:", error);
                return;
            }

            const savedJobs = new Set(data.map((save) => save.jobId));
            const updatedFavorites = jobSuggestions.reduce((acc, job) => {
                acc[job.id] = savedJobs.has(job.id);
                return acc;
            }, {});

            setFavorites(updatedFavorites);
        };

        if (jobSuggestions.length > 0) {
            checkJobSaveStatus();
        }
    }, [jobSuggestions]);
    console.log("JOBBNe",jobSuggestions)
    return (
        <>
            {/* Search Bar */}
            <div className="mb-4">
                <SearchBarv2 searchTitle={searchTitle} />
            </div>

            <div className="container mx-auto max-w-6xl mt-8 px-6">
                {/* Title based on search */}
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Tuyển dụng {jobSuggestions.length} việc làm: <span className="text-green-500">{searchTitle || "Tất cả công việc"}</span>
                </h1>
            </div>

            <div className="container mx-auto px-6 py-4 max-w-6xl">
                {/* Job Results */}
                <div>
                    <div className="w-full max-w-3xl">
                        {jobSuggestions.length > 0 ? (
                            jobSuggestions.map((job) => (
                                <div
                                    key={job.id}
                                    className="flex items-center p-6 border rounded-xl bg-green-50 border-gray-200 shadow-sm hover:border-green-500 duration-300 group mb-6"
                                >
                                    <div className="flex w-full">
                                        <img
                                            src={job.companyImages || "https://via.placeholder.com/150"}
                                            alt={`${job.company} Logo`}
                                            className="w-36 h-32 mr-6 border border-gray-500 rounded-xl cursor-pointer"
                                            onClick={() => navigateToJobDetails(job.id)}
                                        />
                                        <div className="flex flex-col justify-between flex-1">
                                            <div className="flex justify-between items-center">
                                                <h3
                                                    className="text-xl font-bold text-gray-800 flex-1 group-hover:text-green-400 duration-300 cursor-pointer"
                                                    onClick={() => navigateToJobDetails(job.id)}
                                                >
                                                    {job.title}
                                                </h3>
                                                <span className="text-base text-green-500 font-semibold ml-4">
                                                    {job.salary.toLocaleString() || "Thoả thuận"} VNĐ
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{job.companyName}</p>
                                            <div className="flex space-x-3 mt-3 border-b-2 pb-3">
                                                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-xl">
                                                    {job.companyLocation}
                                                </span>
                                                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-xl">
                                                    {job.workExperience || "Không yêu cầu kinh nghiệm"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-3 relative">
                                                <div className="text-sm text-gray-800">{job.level}</div>
                                                <div className="flex items-center ml-auto">
                                                    <button
                                                        className="absolute right-10 text-white font-semibold hidden group-hover:block 
                                                                bg-green-500 px-6 py-2 rounded-xl shadow-md"
                                                        onClick={handleApplyClick}
                                                    >
                                                        Ứng tuyển
                                                    </button>
                                                    <span className="text-xs text-gray-500 mr-4 group-hover:hidden">
                                                        {getRelativeTime(job.createAt) || "Cập nhật gần đây"}
                                                    </span>
                                                    <button
                                                        className="ml-auto text-gray-400 transition-colors duration-200"
                                                        onClick={() => handleFavoriteClick(job.id)}
                                                    >
                                                        <FontAwesomeIcon icon={faHeart} className={favorites[job.id] ? 'text-red-500' : ''} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Không có công việc nào phù hợp với tìm kiếm.</p>
                        )}
                    </div>
                </div>
                {isPopupOpen && (
                    <JobApplicationPopup isPopupOpen={isPopupOpen} job={jobSuggestions} handleCloseClick={handleCloseClick} />
                )}
            </div>
        </>
    );
};

export default JobsSearch;
