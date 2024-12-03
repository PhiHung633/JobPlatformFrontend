import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import JobHoverDetail from './JobHoverDetail';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addJobSave, deleteJobSave, fetchJobSavesByUser } from '../../utils/ApiFunctions';

const JobItem = ({ job }) => {
    const [showHoverInfo, setShowHoverInfo] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkJobSaveStatus = async () => {
            const { data, error } = await fetchJobSavesByUser();
            if (error) {
                console.error("Error fetching job saves:", error);
                return;
            }
            const isSaved = data.some((save) => save.jobId === job.id);
            setIsFavorite(isSaved);
        };

        checkJobSaveStatus();
    }, [job.id]);

    const handleFavoriteClick = async () => {
        if (isFavorite) {
            await deleteJobSave(job.id);
            setIsFavorite(false);
        } else {
            // Nếu chưa lưu, thêm job save
            await addJobSave(job.id);
            setIsFavorite(true);
        }
    };

    return (
        <div className="p-6 w-[400px] bg-white rounded-xl shadow-lg mb-6 border-2 border-transparent transition-transform duration-300 hover:border-gray-300 hover:shadow-2xl hover:scale-105 group">
            <div className="flex items-center">
                <Link to={`/viec-lam/${job.id}`}>
                    <div className="mr-3">
                        <div className="avatar w-[70px] h-[70px] rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                            <img
                                src={job.companyImages || "https://via.placeholder.com/70"}
                                alt="Company Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </Link>
                <div className="flex-grow max-w-[280px]">
                    <h3 className="font-semibold text-lg">
                        <Link to={`/viec-lam/${job.id}`}>
                            <p
                                className="whitespace-nowrap overflow-hidden text-ellipsis hover:underline hover:text-green-500 group-hover:text-green-500"
                                onMouseEnter={() => setShowHoverInfo(true)}
                                onMouseLeave={() => setShowHoverInfo(false)}
                            >
                                {job.title}
                            </p>
                        </Link>
                    </h3>
                    {showHoverInfo &&
                        <div
                            className="absolute z-10 mt-1"
                            onMouseEnter={() => setShowHoverInfo(true)}
                            onMouseLeave={() => setShowHoverInfo(false)}
                        >
                            <JobHoverDetail job={job} />
                        </div>
                    }
                    <Link to={"/cong-ti"}>
                        <span className="text-gray-500 text-sm block overflow-hidden text-ellipsis whitespace-nowrap mt-1">
                            {job.companyName || "Company Name"}
                        </span>
                    </Link>
                    <div className="flex mt-3">
                        <div className="flex gap-3">
                            <div className="font-semibold text-sm px-4 py-1 bg-green-100 rounded-full text-green-600">
                                <span>{job.salary.toLocaleString()} VNĐ</span>
                            </div>
                            <div className="font-semibold text-sm px-4 py-1 bg-blue-100 rounded-full text-blue-600">
                                <span>{job.companyLocation || "Location"}</span>
                            </div>
                        </div>
                        <button
                            className="ml-auto text-gray-400 transition-colors duration-200"
                            onClick={handleFavoriteClick}
                        >
                            <FontAwesomeIcon icon={faHeart} className={isFavorite ? 'text-red-500' : ''} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobItem;
