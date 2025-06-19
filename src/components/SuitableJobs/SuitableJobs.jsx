import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { jwtDecode } from "jwt-decode";
import { ClipLoader } from 'react-spinners';

import JobApplicationPopup from '../JobDetail/JobApplicationPopup';
import { addJobSave, deleteJobSave, fetchJobSavesByUser, checkJobApplied } from '../../utils/ApiFunctions';

const SuitableJobs = ({ bestJobs }) => {
    const [userId, setUserId] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState({});
    const [appliedJobsStatus, setAppliedJobsStatus] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (bestJobs && bestJobs.length > 0) {
            setLoading(false);
        }
    }, [bestJobs]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.user_id);
        }
    }, []);

    const checkJobStatuses = useCallback(async () => {
        if (!userId || !bestJobs || bestJobs.length === 0) return;

        const { data: savedData, error: savedError } = await fetchJobSavesByUser();
        const favoriteStatus = {};
        if (savedData) {
            savedData.forEach((save) => {
                favoriteStatus[save.jobId] = true;
            });
        } else if (savedError) {
            console.error("Error fetching job saves:", savedError);
        }
        setFavorites(favoriteStatus);

        const currentAppliedStatus = {};
        for (const { job } of bestJobs) {
            if (job && job.id) {
                const { data: appliedStatus, error: appliedError } = await checkJobApplied(userId, job.id);
                if (appliedStatus === true) {
                    currentAppliedStatus[job.id] = true;
                } else if (appliedError) {
                    console.error(`Error checking applied status for job ${job.id}:`, appliedError);
                }
            }
        }
        setAppliedJobsStatus(currentAppliedStatus);

    }, [userId, bestJobs]);

    useEffect(() => {
        checkJobStatuses();
    }, [checkJobStatuses]);

    const handleFavoriteClick = async (jobId) => {
        if (!userId) {
            navigate('/dang-nhap');
            return;
        }

        const isSaved = favorites[jobId];

        if (isSaved) {
            await deleteJobSave(jobId);
        } else {
            await addJobSave(jobId);
        }

        setFavorites((prev) => ({
            ...prev,
            [jobId]: !isSaved
        }));
    };

    const formatSalary = (salary) => {
        return salary ? `Tới ${salary.toLocaleString()} VNĐ` : 'Lương thỏa thuận';
    };

    const getDeadlineRemaining = (deadline) => {
        const today = new Date();
        const end = new Date(deadline);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? `Còn ${diffDays} ngày để ứng tuyển` : 'Hết hạn';
    };

    const handleApplyClick = (job) => {
        if (!userId) {
            navigate('/dang-nhap');
        } else {
            setSelectedJob(job);
        }
    };

    const handleCloseClick = () => {
        setSelectedJob(null);
    };

    const handleApplicationSuccess = () => {
        if (selectedJob) {
            setAppliedJobsStatus(prevStatus => ({
                ...prevStatus,
                [selectedJob.id]: true
            }));
        }
        handleCloseClick();
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full">
            <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg max-w-3xl ml-24">
                <div className='flex items-center mb-5'>
                    <div className='text-lg font-bold'>
                        <h1 className='bg-gradient-to-r from-[#263238] to-[#00b14f] text-transparent bg-clip-text font-semibold'>
                            Việc làm phù hợp với bạn
                        </h1>
                        <p className='bg-gradient-to-r from-[#263238] to-[#00b14f] text-transparent bg-clip-text text-green-500 font-normal'>
                            Khám phá cơ hội việc làm được gợi ý dựa trên mong muốn, kỹ năng và kinh nghiệm của bạn. Hãy đón lấy cơ hội thành công với công việc phù hợp nhất dành cho bạn!
                        </p>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center mb-10">
                        <ClipLoader color="#4caf50" size={40} />
                    </div>
                ) : (
                    <>
                        {bestJobs.map(({ job }, index) => (
                            <div key={job.id || index} className='border border-gray-200 rounded-md mb-4 p-4 group hover:bg-gray-100'>
                                <div className='flex'>
                                    <div className='flex-shrink-0 bg-white rounded-lg h-32 w-32 border border-gray-200 p-2'>
                                        <img src={job.companyImages} alt='Company Logo' className='h-full w-full object-fit' />
                                    </div>
                                    <div className='ml-5 flex-1'>
                                        <div className='flex items-center justify-between mb-2'>
                                            <Link to={`/viec-lam/${job.id}`} className='text-base font-semibold text-gray-900 hover:underline group-hover:text-green-500'>
                                                {job.title}
                                            </Link>
                                            <label className='text-green-600 font-semibold text-base'>
                                                {formatSalary(job.salary)}
                                            </label>
                                        </div>
                                        <div className='text-gray-600 mb-2'>
                                            <Link to={`/cong-ti/${job.id}`} className='text-gray-600 hover:underline'>
                                                {job.companyName}
                                            </Link>
                                        </div>
                                        <div className='text-sm text-gray-500 mb-2'>
                                            {`Cập nhật ${new Date(job.createAt).toLocaleDateString()}`}
                                        </div>
                                        <div className="flex items-center space-x-6 mt-4">
                                            {job.address && (
                                                <label className="bg-gray-200 rounded-xl text-sm text-gray-600 py-1 px-2">
                                                    {job.address}
                                                </label>
                                            )}
                                            {job.deadline && (
                                                <label className="bg-gray-200 rounded-xl text-sm text-gray-600 py-1 px-2">
                                                    {getDeadlineRemaining(job.deadline)}
                                                </label>
                                            )}
                                        </div>
                                        <div className='ml-auto space-x-3 mt-3 flex justify-end'>
                                            {appliedJobsStatus[job.id] ? (
                                                <button
                                                    className='bg-gray-400 text-white font-bold rounded-xl text-sm h-8 px-4 cursor-not-allowed'
                                                    disabled
                                                >
                                                    Đã ứng tuyển
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleApplyClick(job)}
                                                    className='bg-green-500 text-white font-bold text-sm h-8 px-4 rounded-xl hover:bg-green-600'
                                                >
                                                    Ứng tuyển
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleFavoriteClick(job.id)}
                                                className='bg-green-100 h-8 w-8 flex items-center justify-center rounded-xl'>
                                                <FontAwesomeIcon icon={faHeart} className={favorites[job.id] ? 'text-red-500' : 'text-green-500'} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}


                {selectedJob && (
                    <JobApplicationPopup
                        isPopupOpen={!!selectedJob}
                        job={selectedJob}
                        handleCloseClick={handleCloseClick}
                        userId={userId}
                        onApplicationSuccess={handleApplicationSuccess}
                    />
                )}

                <div className='text-center'>
                    <a href='#' className='bg-green-500 border-green-500 rounded-md text-white py-2.5 px-5 no-underline hover:bg-green-600'>
                        Xem tất cả việc làm phù hợp
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SuitableJobs;