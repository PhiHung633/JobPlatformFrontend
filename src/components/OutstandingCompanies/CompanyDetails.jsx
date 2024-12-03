import { useEffect, useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaRegHeart, FaHeart } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { parseISO, differenceInDays } from 'date-fns';
import { jwtDecode } from "jwt-decode";
import { addJobSave, deleteJobSave, fetchJobSavesByUser, getCompanyById } from "../../utils/ApiFunctions";
import JobApplicationPopup from "../JobDetail/JobApplicationPopup";

function calculateDaysRemaining(deadline) {
    const deadlineDate = parseISO(deadline);
    const today = new Date();
    const diffInDays = differenceInDays(deadlineDate, today);

    if (diffInDays > 0) return `Còn ${diffInDays} ngày`;
    if (diffInDays === 0) return 'Hôm nay là deadline';
    return 'Đã hết hạn';
}

const CompanyDetails = () => {

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [searchJob, setSearchJob] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [userId, setUserId] = useState("");
    const [savedJobs, setSavedJobs] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    console.log("ID:", id);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.user_id);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const companyResponse = await getCompanyById(id);
                setCompany(companyResponse.data);

                const savedJobsResponse = await fetchJobSavesByUser();
                setSavedJobs(savedJobsResponse.data.map(job => job.jobId));
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err);
                setCompany(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message || "Something went wrong"}</div>;
    if (!company) return <div>No company data available</div>;

    const filteredJobs = company?.jobs?.filter(
        (job) =>
            job.title.toLowerCase().includes(searchJob.toLowerCase()) &&
            (locationFilter === "" || job.location.includes(locationFilter))
    ) || [];

    const toggleFavorite = async (jobId) => {
        if (savedJobs.includes(jobId)) {
            await deleteJobSave(jobId);
            setSavedJobs(savedJobs.filter(id => id !== jobId));
        } else {
            await addJobSave(jobId);
            setSavedJobs([...savedJobs, jobId]);
        }
    };

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setIsPopupOpen(true);
    };

    const handleCloseClick = () => {
        setIsPopupOpen(false);
        setSelectedJob(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 px-20 py-10">
            {/* Header */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="relative">
                    <img
                        src={"/banner_company.webp"}
                        alt="Banner"
                        className="w-full h-56 object-cover"
                    />
                    <div className="absolute transform -translate-y-1/2 left-12">
                        <img
                            src={company.images}
                            alt="Logo"
                            className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
                        />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-700 to-green-400 text-white p-6 flex justify-between items-center">
                    <div className="ml-40">
                        <h1 className="text-2xl font-bold">{company.name}</h1>
                        <div className="flex items-center gap-6 mt-2">
                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:underline overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]"
                            >
                                🌐 {company.website}
                            </a>
                            <span>🏢 {company.companySize}</span>
                            <span>⭐ {company.followers}</span>
                        </div>
                    </div>
                    <button className="px-6 py-2 bg-white text-green-600 font-semibold rounded-lg shadow hover:bg-gray-200">
                        + Theo dõi công ty
                    </button>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6">
                {/* Giới thiệu công ty */}
                <div className="col-span-2 bg-white p-6 shadow-md rounded-lg">
                    <h2 className="text-xl font-bold text-green-700 mb-4">Giới thiệu công ty</h2>
                    <p className="text-gray-600">
                        {company.description}
                    </p>
                </div>

                {/* Thông tin liên hệ */}
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <h2 className="text-xl font-bold text-green-700 mb-4">Thông tin liên hệ</h2>
                    <p className="text-gray-600">
                        📍 <strong>Địa chỉ công ty:</strong> {company.location}
                    </p>
                </div>
            </div>
            {/* Tuyển dụng */}
            <div className="bg-white shadow-md rounded-lg p-6 mt-5">
                <h2 className="text-xl font-bold text-green-700 mb-4">Tuyển dụng</h2>

                {/* Thanh tìm kiếm */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tên công việc, vị trí ứng tuyển..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none"
                            value={searchJob}
                            onChange={(e) => setSearchJob(e.target.value)}
                        />
                    </div>
                    <div className="relative flex-1">
                        <FaMapMarkerAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tất cả tỉnh/thành phố"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700">
                        <FaSearch />
                        Tìm kiếm
                    </button>
                </div>

                {/* Danh sách công việc */}

                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 border rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-lg hover:bg-gray-50 group"
                        >
                            <div className="w-20 h-20 flex-shrink-0">
                                <img
                                    src={job.companyImages}
                                    alt="Logo"
                                    className="w-full h-full object-cover rounded-md border"
                                />
                            </div>

                            {/* Thông tin công việc */}
                            <div className="flex-1">
                                <Link to={`/viec-lam/${job.id}`}>
                                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 group-hover:underline flex items-center gap-2">
                                        {job.title}
                                    </h3>
                                </Link>
                                <p className="text-gray-600 text-sm mb-3">
                                    {job.company}
                                </p>
                                <div className="flex space-x-4">
                                    <span className="bg-gray-200 px-3 rounded-xl">{job.companyLocation}</span>
                                    <span className="bg-gray-200 px-3 rounded-xl">
                                        {job.deadline
                                            ? calculateDaysRemaining(job.deadline)
                                            : 'Không có deadline'}
                                    </span>
                                </div>
                            </div>

                            {/* Mức lương, nút ứng tuyển và trái tim */}
                            <div className="text-right">
                                <p className="text-green-700 font-semibold text-sm flex items-center gap-1 justify-end">
                                    {job.salary.toLocaleString()} VNĐ
                                </p>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleApplyClick(job)}
                                        className="mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700"
                                    >
                                        Ứng tuyển
                                    </button>
                                    <button
                                        onClick={() => toggleFavorite(job.id)}
                                        className="mt-2 text-green-500 hover:text-green-700 bg-gray-100 p-2 rounded-full"
                                    >
                                        {savedJobs.includes(job.id) ? (
                                            <FaHeart size={18} />
                                        ) : (
                                            <FaRegHeart size={18} />
                                        )}
                                    </button>
                                    {isPopupOpen && (
                                        <JobApplicationPopup isPopupOpen={isPopupOpen} job={job} handleCloseClick={handleCloseClick} userId={userId} />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">Không tìm thấy công việc nào.</p>
                )}
                {isPopupOpen && selectedJob && (
                    <JobApplicationPopup
                        isPopupOpen={isPopupOpen}
                        job={selectedJob}
                        handleCloseClick={handleCloseClick}
                        userId={userId}
                    />
                )}
            </div>
        </div>
    );
};

export default CompanyDetails;
