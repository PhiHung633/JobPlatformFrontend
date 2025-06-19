import { faClock, faDollar, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useCallback } from "react"; // Import useCallback
import { parseISO, differenceInDays } from 'date-fns';
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Button from '@mui/material/Button';
import JobApplicationPopup from "../../components/JobDetail/JobApplicationPopup";
import { fetchJobSavesByUser, fetchJobById, deleteJobSave, checkJobApplied } from "../../utils/ApiFunctions"; // Import checkJobApplied
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function calculateDaysRemaining(deadline) {
    const deadlineDate = parseISO(deadline);
    const today = new Date();
    const diffInDays = differenceInDays(deadlineDate, today);

    if (diffInDays > 0) return `Còn ${diffInDays} ngày`;
    if (diffInDays === 0) return 'Hôm nay là deadline';
    return 'Đã hết hạn';
}

const JobSaved = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userId, setUserId] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentJobForApply, setCurrentJobForApply] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.user_id);
        }
    }, []);

    const loadJobSaves = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await fetchJobSavesByUser();
        if (data) {
            const jobDetailsPromises = data.map(async (save) => {
                const { data: jobDetail, error: jobError } = await fetchJobById(save.jobId);
                if (jobDetail) {
                    let hasApplied = false;
                    if (userId) {
                        const { data: appliedStatus, error: appliedError } = await checkJobApplied(userId, jobDetail.id);
                        if (appliedStatus === true) {
                            hasApplied = true;
                        } else if (appliedError) {
                            console.error(`Error checking applied status for job ${jobDetail.id}:`, appliedError);
                        }
                    }
                    return { ...jobDetail, savedAt: save.savedAt, hasApplied };
                } else {
                    console.error("Error fetching job details:", jobError);
                    return null;
                }
            });
            const allJobDetails = await Promise.all(jobDetailsPromises);
            setSavedJobs(allJobDetails.filter((job) => job !== null));
        } else {
            setError(error);
        }
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        if (userId) {
            loadJobSaves();
        }
    }, [refreshTrigger, userId, loadJobSaves]);

    const handleFavoriteClick = async (jobId) => {
        const { data, error } = await deleteJobSave(jobId);
        if (!error) {
            console.log("Job unsaved successfully!");
            setRefreshTrigger(prev => prev + 1);
        } else {
            console.error("Error unsaving job:", error);
            setError("Có lỗi xảy ra khi bỏ lưu công việc.");
        }
    };

    const handleApplyClick = (job) => {
        setCurrentJobForApply(job);
        setIsPopupOpen(true);
    };

    const handleCloseClick = () => {
        setIsPopupOpen(false);
        setCurrentJobForApply(null);
        setRefreshTrigger(prev => prev + 1);
    }

    const handleApplicationSuccess = () => {
        setSavedJobs(prevJobs =>
            prevJobs.map(job =>
                job.id === currentJobForApply.id ? { ...job, hasApplied: true } : job
            )
        );
        handleCloseClick();
    };

    if (loading) {
        return (
            <div className="flex max-w-5xl mx-auto gap-6 mt-10">
                <div className="w-full bg-white rounded-xl shadow-md overflow-hidden self-start">
                    <div className="bg-gradient-to-r from-green-600 to-green-400 p-6 text-white">
                        <Skeleton width={200} height={24} />
                        <Skeleton count={2} className="mt-2" />
                    </div>

                    <div className="p-4 space-y-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-white border border-green-400 p-4 rounded-lg shadow-md">
                                <div className="flex items-start mb-3">
                                    <Skeleton width={96} height={96} className="rounded-xl mr-3" />
                                    <div className="flex flex-col w-full">
                                        <div className="flex justify-between items-center">
                                            <Skeleton width="60%" height={20} />
                                            <Skeleton width="30%" height={20} />
                                        </div>
                                        <Skeleton width="40%" height={16} className="mt-4 mb-2" />
                                        <Skeleton width="30%" height={12} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex gap-5">
                                        <Skeleton width={120} height={24} />
                                        <Skeleton width={140} height={24} />
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton width={80} height={32} />
                                        <Skeleton width={80} height={32} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex max-w-5xl mx-auto gap-6 mt-10">
            <div className="w-full bg-white rounded-xl shadow-md overflow-hidden self-start">
                <div className="bg-gradient-to-r from-green-600 to-green-400 p-6 text-white">
                    <h2 className="text-2xl font-semibold">Việc làm đã lưu</h2>
                    <p className="mt-2">
                        Xem lại danh sách những việc làm mà bạn đã lưu trước đó. Ứng tuyển ngay để không bỏ lỡ cơ hội nghề nghiệp dành cho bạn.
                    </p>
                </div>

                {error ? (
                    <p className="text-red-500 text-center p-4">Có lỗi xảy ra khi tải dữ liệu.</p>
                ) : savedJobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-3/5 py-20"> {/* Increased py for better spacing */}
                        <img src="/empty.webp" alt="No jobs saved" className="w-36 h-28 mb-4" />
                        <p className="text-gray-600 text-center mb-4">Bạn chưa lưu công việc nào!</p>
                        <Link to={"/"}>
                            <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-600">
                                Tìm việc ngay
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="p-4 space-y-4">
                        {savedJobs.map((job) => (
                            <div key={job.id} className="bg-white border border-green-400 p-4 rounded-lg shadow-md">
                                <div className="flex items-start mb-3">
                                    <img src={job.companyImages || "/placeholder.png"} alt="Company logo" className="w-24 h-24 rounded-xl mr-3 border" />
                                    <div className="flex flex-col w-full">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-lg font-bold text-green-600 truncate-text w-80">{job.title}</h4>
                                            <span className="flex ml-10 text-green-500 text-lg font-semibold">{job.salary ? job.salary.toLocaleString() + ' VNĐ' : "Thỏa thuận"}</span>
                                        </div>
                                        <p className="text-gray-500 mb-3 mt-5">{job.companyName}</p>
                                        <p className="text-xs text-gray-400">Đã lưu: {new Date(job.savedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex gap-5">
                                        <span className="flex items-center gap-1 bg-gray-200 px-3 rounded-xl">
                                            <FontAwesomeIcon icon={faLocationDot} className="text-green-400" />
                                            <p className="">{job.companyLocation || "Chưa rõ"}</p>
                                        </span>
                                        <span className="flex items-center gap-1 bg-gray-200 px-3 rounded-xl">
                                            <FontAwesomeIcon icon={faClock} className="text-green-400" />
                                            <p>
                                                {job.deadline
                                                    ? calculateDaysRemaining(job.deadline)
                                                    : 'Không có deadline'}
                                            </p>
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        {job.hasApplied ? (
                                            <Button
                                                variant="contained"
                                                disabled
                                                className="bg-gray-400 text-white font-semibold py-1 px-4 rounded-lg"
                                            >
                                                Đã ứng tuyển
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleApplyClick(job)}
                                                className="bg-green-500 text-white font-semibold py-1 px-4 rounded-lg hover:bg-green-600"
                                            >
                                                Ứng tuyển
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            onClick={() => handleFavoriteClick(job.id)}
                                            className="bg-gray-200 text-gray-600 font-semibold py-1 px-4 rounded-lg hover:bg-red-600"
                                        >
                                            Bỏ lưu
                                        </Button>
                                    </div>
                                </div>
                                {isPopupOpen && currentJobForApply?.id === job.id && (
                                    <JobApplicationPopup
                                        isPopupOpen={isPopupOpen}
                                        job={currentJobForApply}
                                        handleCloseClick={handleCloseClick}
                                        userId={userId}
                                        onApplicationSuccess={handleApplicationSuccess}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobSaved;