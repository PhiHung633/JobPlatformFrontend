import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faMapMarkerAlt, faHourglassHalf, faPaperPlane, faHeart, faUsers, faBuilding, faExternalLinkAlt, faClock, faUserTie, faMarsAndVenus } from '@fortawesome/free-solid-svg-icons';
import ImageGallery from '../ImageGallery/ImageGallery';
import Rating from '@mui/material/Rating';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { addJobSave, addReview, deleteJobSave, deleteReview, fetchAllReviews, fetchJobById, fetchJobSavesByUser, updateReview } from '../../utils/ApiFunctions';
import JobApplicationPopup from './JobApplicationPopup';
import JobReview from './JobReview';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';

const calculateRemainingDays = (deadline) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const differenceInTime = deadlineDate - currentDate;
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
    return differenceInDays > 0 ? `Còn ${differenceInDays} ngày` : "Đã hết hạn";
};

const JobDetail = () => {

    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [error1, setError1] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split(" ")[0].split("-");
        return `${day}/${month}/${year}`;
    };
    const [rating, setRating] = useState(2.5);
    const [feedback, setFeedback] = useState("");
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [userId, setUserId] = useState("");
    const [currentEditId, setCurrentEditId] = useState(null);
    const [hasReviewed, setHasReviewed] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.user_id);
        }
    }, []);

    useEffect(() => {
        async function loadReviews() {
            const { data, error } = await fetchAllReviews(id);
            if (data) {
                setReviews(data);
            } else {
                setError(error);
            }
        }
        loadReviews();
    }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        const reviewDto = {
            rating,
            comment: feedback,
            jobId: id,
            userId: userId
        };

        try {
            if (currentEditId) {
                const { data, error } = await updateReview(currentEditId, reviewDto);

                if (data) {
                    setReviews((prevReviews) =>
                        prevReviews.map((review) =>
                            review.id === currentEditId ? { ...review, ...data } : review
                        )
                    );
                    console.log("Đánh giá đã được cập nhật:", data);
                } else {
                    console.error("Lỗi khi cập nhật đánh giá:", error);
                    alert("Đã xảy ra lỗi khi cập nhật đánh giá. Vui lòng thử lại!");
                }
            } else {
                const { data, error } = await addReview(reviewDto);

                if (data) {
                    setReviews([data, ...reviews]);
                    console.log("Đánh giá đã được thêm:", data);
                } else if (error.status === "Bad Request") {
                    alert("Bạn đã đánh giá công việc này rồi");
                }
                else {
                    console.error("Lỗi khi thêm đánh giá:", error);
                    alert("Đã xảy ra lỗi khi thêm đánh giá. Vui lòng thử lại!");
                }
            }

            setRating(0);
            setFeedback("");
            setCurrentEditId(null);
            setShowReviewForm(false);
        } catch (err) {
            console.error("Không thể xử lý yêu cầu:", err);
            alert("Đã xảy ra lỗi khi gửi đánh giá!");
        }
    };

    const handleUpdateReview = (id) => {
        const reviewToUpdate = reviews.find((review) => review.id === id);
        if (reviewToUpdate) {
            setCurrentEditId(id);
            setRating(reviewToUpdate.rating);
            setFeedback(reviewToUpdate.comment);
            setShowReviewForm(true);
        }
    };

    const handleDeleteReview = async (id) => {
        try {
            const confirmed = window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?");
            if (!confirmed) return;

            const { data, error } = await deleteReview(id);
            setReviews(reviews.filter((review) => review.id !== id));
            console.log("Đánh giá đã được xóa:", id);

        } catch (err) {
            console.error("Không thể xóa đánh giá:", err);
            alert("Đã xảy ra lỗi khi xóa đánh giá!");
        }
    };

    useEffect(() => {
        const loadJobAndCheckSaveStatus = async () => {
            setLoading(true);
            try {
                const { data: jobData, error: jobError } = await fetchJobById(id);
                if (jobError) {
                    setError(jobError);
                    console.error(`Error fetching job: ${jobError}`);
                    setLoading(false);
                    return;
                }
    
                console.log("JOBBDAAA",jobData)
                if (jobData.status === "SHOW") {
                    setJob(jobData);
                } else {
                    setError1("Job is not available.");
                    console.error(`Job status is ${jobData.status}`);
                    setLoading(false);
                    return;
                }
    
                const { data: savesData, error: savesError } = await fetchJobSavesByUser();
                if (savesError) {
                    console.error("Error fetching job saves:", savesError);
                    setError(savesError);
                } else {
                    const isSaved = savesData.some((save) => save.jobId === jobData.id);
                    setIsFavorite(isSaved);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                setError("Unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };
    
        if (id) {
            loadJobAndCheckSaveStatus();
        }
    }, [id]);    

    const handleApplyClick = () => {
        if (!userId) {
            navigate('/dang-nhap');
        } else {
            setIsPopupOpen(true);
        }
    };

    const handleCloseClick = () => {
        setIsPopupOpen(false);
    }

    const handleFavoriteClick = async () => {
        if (!userId) {
            navigate('/dang-nhap');
        }
        else if (isFavorite) {
            await deleteJobSave(id);
            setIsFavorite(false);
        } else {
            await addJobSave(id);
            setIsFavorite(true);
        }
    };

    const handleReviewClick = () => {
        if (!userId) {
            navigate('/dang-nhap');
        } else {
            setShowReviewForm(true);
        }
    };

    useEffect(() => {
        if (error1) {
            toast.error(`Lỗi: ${error1}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [error1]);

    useEffect(() => {
        // Kiểm tra xem người dùng đã đánh giá hay chưa
        const checkUserReview = () => {
            const userReview = reviews.find((review) => review.userId === userId);
            setHasReviewed(!!userReview);
        };
        checkUserReview();
    }, [reviews, userId, id]);


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ClipLoader color="#4caf50" size={40} />
            </div>
        );
    }

    if (!job) {
        return <p className='flex justify-center items-center'>No job found.</p>;
    }
    // console.log("JOBDETAIL", job)
    // console.log("JOBMO", isPopupOpen)
    // console.log("COREVIEWMA", reviews)
    return (
        <div className="p-6 flex flex-col lg:flex-row justify-between max-w-7xl mx-auto gap-6 items-start">
            {/* Left Column: Job Detail and Job Description */}
            <div className="flex flex-col gap-6 w-full lg:w-4/5">
                {/* Job Detail Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {job.title} tại {job.companyLocation}
                    </h2>

                    <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                        <div className="flex items-center text-gray-600 mb-4 sm:mb-0">
                            <FontAwesomeIcon icon={faDollarSign} className="text-white text-xl mr-2 bg-green-600 px-4 py-3 rounded-full" />
                            <div>
                                <p className="font-medium">Mức lương</p>
                                <p className="text-sm font-bold">Trên {job.salary}</p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-600 mb-4 sm:mb-0">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white text-xl mr-2 bg-green-600 px-4 py-3 rounded-full" />
                            <div>
                                <p className="font-medium">Địa điểm</p>
                                <p className="text-sm font-bold">{job.address}</p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-600 mb-4 sm:mb-0">
                            <FontAwesomeIcon icon={faHourglassHalf} className="text-white text-xl mr-2 bg-green-600 px-4 py-3 rounded-full" />
                            <div>
                                <p className="font-medium">Kinh nghiệm</p>
                                <p className="text-sm font-bold">{job.workExperience}</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-gray-600 mb-4">
                        <FontAwesomeIcon icon={faClock} className="text-gray-400 mr-2" />
                        Hạn nộp hồ sơ: <span className="font-medium">{calculateRemainingDays(job.deadline)}</span>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handleApplyClick}
                            className="bg-green-500 text-white w-full sm:w-4/6 mr-2 py-2 px-4 rounded-xl flex items-center justify-center hover:bg-green-600">
                            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                            Ứng tuyển ngay
                        </button>
                        <button
                            onClick={handleFavoriteClick}
                            className="border border-green-500 text-green-500 py-2 px-4 rounded-xl flex items-center gap-2 hover:border-green-700"
                        >
                            <FontAwesomeIcon icon={faHeart} className={isFavorite ? 'text-red-500' : ''} />
                            {isFavorite ? 'Đã lưu' : 'Lưu tin'}
                        </button>
                    </div>
                </div>

                {/* Job Description Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className='text-xl font-bold text-gray-900 border-green-500 border-l-8 pl-2 '>Chi tiết tuyển dụng</h3>
                    <div className='mt-3'>
                        <h4 className="text-base font-semibold text-gray-800 mb-4">Mô tả công việc</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                            <li>{job.description}</li>
                        </ul>
                    </div>
                    <div className='mt-3'>
                        <h4 className="text-base font-semibold text-gray-800 mb-4">Yêu cầu ứng viên</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                            <li>Develop and produce detailed and precise 3D models for a wide range of applications, contributing to the digital transformation of numerous iconic venues globally.</li>
                            <li>Collaborate with fellow designers and developers to meet project requirements and ensure all models adhere to technical and artistic standards.</li>
                            <li>Optimize models for performance without compromising quality, ensuring compatibility across various platforms and devices.</li>
                        </ul>
                    </div>
                    <div className='mt-3'>
                        <h4 className="text-base font-semibold text-gray-800 mb-4">Quyền lợi</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                            <li>{job.benefits}</li>
                        </ul>
                    </div>
                    <div className='mt-3'>
                        <h4 className="text-base font-semibold text-gray-800 mb-2">Địa điểm làm việc</h4>
                        <ul className="list-none list-inside text-gray-600 space-y-2">
                            <li>-{job.address}</li>
                        </ul>
                    </div>
                    <div className="text-gray-500 mb-4 mt-3">
                        Hạn nộp hồ sơ: <span className="font-medium">{calculateRemainingDays(job.deadline)}</span>
                    </div>

                    <div className="flex mt-4">
                        <button
                            onClick={handleApplyClick}
                            className="bg-green-500 text-white mr-2 py-2 px-4 rounded-xl flex items-center justify-center hover:bg-green-600">
                            Ứng tuyển ngay
                        </button>
                        <button
                            onClick={handleFavoriteClick}
                            className="border border-green-500 text-green-600 py-2 px-4 rounded-xl flex items-center 
                            hover:border-green-700"
                        >
                            {isFavorite ? 'Đã lưu' : 'Lưu tin'}
                        </button>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                    <h3 className="text-xl font-bold text-gray-900 border-green-500 border-l-8 pl-2 mb-4">
                        Đánh giá công việc
                    </h3>

                    {/* Danh sách đánh giá */}
                    {reviews.length === 0 && !error ? (
                        <p className="text-gray-500 italic">Hiện tại không có đánh giá nào.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <JobReview
                                    key={review.id}
                                    review={review}
                                    onUpdate={handleUpdateReview}
                                    onDelete={handleDeleteReview}
                                />
                            ))}
                        </div>
                    )}

                    {!showReviewForm && (
                        <button
                            onClick={handleReviewClick}
                            className={`py-2 px-4 rounded-xl mt-4 ${hasReviewed
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                            disabled={hasReviewed} // Vô hiệu hóa nếu đã đánh giá
                        >
                            {hasReviewed ? "Đã đánh giá" : "Viết đánh giá"}
                        </button>
                    )}

                    {showReviewForm && (
                        <>
                            <hr className="border border-t-2 mt-5" />
                            <form onSubmit={handleSubmitReview} className="mt-6">
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Đánh giá:</label>
                                    <Rating
                                        name="job-rating"
                                        value={rating}
                                        precision={0.5}
                                        onChange={(event, newValue) => setRating(newValue)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Phản hồi:</label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        className="border rounded-md w-full p-2"
                                        rows="4"
                                        placeholder="Nhập phản hồi của bạn"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600"
                                >
                                    Gửi đánh giá
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    className="ml-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>

            {/* Right Column: Company Details */}
            <div className="flex flex-col gap-4 w-full lg:w-2/5">
                {/* Company Details Block */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex items-center mb-4">
                        <img
                            src={job.companyImages}
                            alt="Company Logo"
                            className="w-12 h-12 rounded-full border border-gray-200 mr-3"
                        />
                        <h3 className="text-md font-semibold text-gray-800 leading-tight">
                            {job.companyName}
                        </h3>
                    </div>

                    <div className="text-gray-600 mb-2 flex items-center">
                        <FontAwesomeIcon icon={faUsers} className="mr-2 text-gray-300" />
                        <span className="text-sm flex">Quy mô: <p className='ml-2 font-bold'>{job.companySize} nhân viên</p></span>
                    </div>

                    <div className="text-gray-600 mb-2 flex items-center">
                        <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-300" />
                        <span className="text-sm flex">Lĩnh vực: <p className='ml-2 font-bold'>{job.industry}</p></span>
                    </div>

                    <div className="text-gray-600 mb-4 flex items-start">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-300" />
                        <span className="text-sm">
                            <span className="text-sm flex">Địa điểm: <p className='ml-2 font-bold'>{job.companyLocation}</p></span>
                        </span>
                    </div>

                    <button className="flex items-center text-green-400 pt-2 w-full justify-center text-sm font-bold">
                        Xem trang công ty
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-1 text-xs" />
                    </button>
                </div>

                {/* Thông tin chung Block */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin chung</h4>

                    <div className="text-gray-600 mb-3 flex items-center">
                        <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                            <FontAwesomeIcon icon={faUserTie} className="text-sm" />
                        </div>
                        <span className="text-sm flex flex-col">Cấp bậc <span className="font-bold">{job.level}</span></span>
                    </div>

                    <div className="text-gray-600 mb-3 flex items-center">
                        <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                            <FontAwesomeIcon icon={faHourglassHalf} className="text-sm" />
                        </div>
                        <span className="text-sm flex flex-col">Kinh nghiệm <span className="font-bold">{job.workExperience}</span></span>
                    </div>

                    <div className="text-gray-600 mb-3 flex items-center">
                        <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                            <FontAwesomeIcon icon={faUsers} className="text-sm" />
                        </div>
                        <span className="text-sm flex flex-col">Số lượng tuyển <span className="font-bold">{job.numberOfRecruits} người</span></span>
                    </div>

                    <div className="text-gray-600 mb-3 flex items-center">
                        <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                            <FontAwesomeIcon icon={faClock} className='text-sm' />
                        </div>
                        <span className="text-sm flex flex-col">Hình thức làm việc <span className="font-bold">{job.workType}</span></span>
                    </div>

                    <div className="text-gray-600 flex items-center">
                        <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                            <FontAwesomeIcon icon={faMarsAndVenus} className="text-sm" />
                        </div>
                        <span className="text-sm flex flex-col">
                            Giới tính <span className="font-bold">Không yêu cầu</span>
                        </span>
                    </div>
                </div>
            </div>

            {isPopupOpen && (
                <JobApplicationPopup isPopupOpen={isPopupOpen} job={job} handleCloseClick={handleCloseClick} userId={userId} />
            )}
        </div>
    );
}

export default JobDetail;