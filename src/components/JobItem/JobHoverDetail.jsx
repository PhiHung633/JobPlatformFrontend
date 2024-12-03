import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBusinessTime, faClock, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { fetchCompanyById } from '../../utils/ApiFunctions';
// import dayjs from 'dayjs';

const JobHoverDetail = ({ job }) => {
    // const [company, setCompany] = useState(null);
    // const [daysLeft, setDaysLeft] = useState(null);

    // useEffect(() => {
    //     async function getCompanyDetails() {
    //         const result = await fetchCompanyById(job.companyId);
    //         if (result.error) {
    //             console.error("Error fetching company details:", result.error);
    //         } else {
    //             setCompany(result.data);
    //         }
    //     }
    //     if (job.companyId) {
    //         getCompanyDetails();
    //     }
    //     if (job.deadline) {
    //         const deadlineDate = dayjs(job.deadline, 'DD-MM-YYYY HH:mm:ss').startOf('day'); // Bắt đầu ngày
    //         const currentDate = dayjs().startOf('day'); // Lấy thời gian hiện tại, bắt đầu ngày

    //         // Tính số ngày còn lại
    //         const remainingDays = deadlineDate.diff(currentDate, 'day');

    //         // Cập nhật số ngày còn lại, hiển thị 0 nếu hạn đã qua
    //         setDaysLeft(remainingDays > 0 ? remainingDays : 0);
    //     }
    // }, [job.companyId, job.deadline]);

    const navigate = useNavigate();

    const handleApply = () => {
        navigate(`/viec-lam/${job.id}`);
    };

    const handleViewDetails = () => {
        navigate(`/viec-lam/${job.id}`);
    };

    return (
        <div className="p-6 w-[600px] bg-white rounded-2xl shadow-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:border-green-500">
            <div className="flex gap-4">
                <div className="mr-4">
                    <img
                        src={job.companyImages || "https://via.placeholder.com/70"}
                        alt="Company Logo"
                        className="w-[120px] h-[90px] object-cover rounded-lg border-2 border-gray-200"
                    />
                </div>
                <div className="flex flex-col justify-between">
                    <h3 className="text-xl font-bold text-gray-800 hover:text-green-500 transition duration-300">
                        {job.title}
                    </h3>
                    <span className="text-gray-600 text-base font-medium">
                        {job.companyName || "Tên công ty"}
                    </span>
                    <span className="text-green-600 text-lg font-semibold">
                        {job.salary.toLocaleString() || "Mức lương"} VNĐ
                    </span>
                </div>
            </div>

            <div className="mt-4 flex gap-4 flex-wrap">
                <div className="flex items-center bg-gray-100 text-gray-700 rounded-lg px-3 py-2">
                    <FontAwesomeIcon icon={faLocationDot} className="text-green-500 mr-2" />
                    <span>{job.companyLocation || "Địa điểm"}</span>
                </div>
                <div className="flex items-center bg-gray-100 text-gray-700 rounded-lg px-3 py-2">
                    <FontAwesomeIcon icon={faBusinessTime} className="text-green-500 mr-2" />
                    <span>{job.workExperience || "Kinh nghiệm"}</span>
                </div>
                <div className="flex items-center bg-gray-100 text-gray-700 rounded-lg px-3 py-2">
                    <FontAwesomeIcon icon={faClock} className="text-green-500 mr-2" />
                    <span>
                        {/* {daysLeft !== null ? `Còn ${daysLeft} ngày` : "Hạn nộp"} */}
                        {job.deadline}
                    </span>
                </div>
            </div>

            <div className="mt-6 max-h-[200px] overflow-y-auto">
                <div className="border-t border-gray-200 pt-4">
                    <span className="font-bold text-lg text-gray-800">Mô tả công việc</span>
                    <p className="text-gray-600 mt-2">{job.description || "Nội dung mô tả công việc..."}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                    <span className="font-bold text-lg text-gray-800">Yêu cầu ứng viên</span>
                    <p className="text-gray-600 mt-2">{job.requirements || "Yêu cầu công việc..."}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                    <span className="font-bold text-lg text-gray-800">Quyền lợi</span>
                    <p className="text-gray-600 mt-2">{job.benefits || "Thông tin quyền lợi..."}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                    <span className="font-bold text-lg text-gray-800">Địa điểm làm việc</span>
                    {/*  */}
                    <p className="text-gray-600 mt-2">{job.companyLocation || "Vị trí làm việc..."}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={handleApply}
                    className="px-4 py-2 rounded-lg border border-green-500 text-green-500 font-semibold hover:bg-green-500
                    hover:text-white transition duration-300">
                    Ứng tuyển
                </button>
                <button
                    onClick={handleViewDetails}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium 
                    hover:bg-green-600 transition duration-300">
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
};

export default JobHoverDetail;
