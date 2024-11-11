import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faMapMarkerAlt, faHourglassHalf, faPaperPlane, faHeart, faUsers, faBuilding, faExternalLinkAlt, faClock, faUserTie, faMarsAndVenus } from '@fortawesome/free-solid-svg-icons';
import ImageGallery from '../ImageGallery/ImageGallery';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchJobById } from '../../utils/ApiFunctions';

const JobDetail = () => {

    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadJob = async () => {
            const { data, error, status } = await fetchJobById(id);
            if (data) {
                setJob(data);
            } else {
                setError(error);
                console.error(`Error fetching job: ${error}`);
            }
            setLoading(false);
        };
        loadJob();
    }, [id]);

    if (loading) {
        return <p>Loading job details...</p>;
    }

    if (error) {
        return <p>Error fetching job details: {error.message}</p>;
    }

    if (!job) {
        return <p>No job found.</p>;
    }

    return (
        <div className="p-6 flex justify-between max-w-5xl mx-56 gap-6 items-start">
            {/* Left Column: Job Detail and Job Description */}
            <div className="flex flex-col gap-6 w-4/5">
                {/* Job Detail Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {job.title}
                    </h2>

                    <div className="flex justify-between mb-4">
                        <div className="flex items-center text-gray-600">
                            <FontAwesomeIcon icon={faDollarSign} className="text-white text-xl mr-2 bg-green-600 px-4 py-3 rounded-full" />
                            <div>
                                <p className="font-medium">Mức lương</p>
                                <p className="text-sm font-bold">Trên {job.salary}</p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-600">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white text-xl mr-2 bg-green-600 px-4 py-3 rounded-full" />
                            <div>
                                <p className="font-medium">Địa điểm</p>
                                <p className="text-sm font-bold">{job.company.location}</p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-600">
                            <FontAwesomeIcon icon={faHourglassHalf} className="text-white text-xl mr-2 bg-green-600 px-4 py-3 rounded-full" />
                            <div>
                                <p className="font-medium">Kinh nghiệm</p>
                                <p className="text-sm font-bold">{job.workExperience}</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-gray-600 mb-4">
                        <FontAwesomeIcon icon={faClock} className="text-gray-400 mr-2" />
                        Hạn nộp hồ sơ: <span className="font-medium">{job.deadline}</span>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button className="bg-green-500 text-white w-4/6 mr-2 py-2 px-4 rounded-xl flex items-center justify-center hover:bg-green-600">
                            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                            Ứng tuyển ngay
                        </button>
                        <button className="border border-green-500 text-green-500 py-2 px-4 rounded-xl flex items-center hover:border-green-700">
                            <FontAwesomeIcon icon={faHeart} className="mr-2 text-green border-green-500" />
                            Lưu tin
                        </button>
                    </div>
                </div>

                {/* Job Description Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className='text-xl font-bold text-gray-900 border-green-500 border-l-8 pl-2 '>Chi tiết tuyển dụng</h3>
                    <ImageGallery />
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
                            <li>-{job.company.location}</li>
                        </ul>
                    </div>
                    <div className="text-gray-500 mb-4 mt-3">
                        Hạn nộp hồ sơ: <span className="font-medium">{job.deadline}</span>
                    </div>

                    <div className="flex mt-4">
                        <button className="bg-green-500 text-white mr-2 py-2 px-4 rounded-xl flex items-center justify-center hover:bg-green-600">
                            Ứng tuyển ngay
                        </button>
                        <button className="border border-green-500 text-green-600 py-2 px-4 rounded-xl flex items-center hover:border-green-700">
                            Lưu tin
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column: Company Details */}
            <div className="flex flex-col gap-4 w-2/5">
                {/* Company Details Block */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex items-center mb-4">
                        <img
                            src="company-logo.png"
                            alt="Company Logo"
                            className="w-12 h-12 rounded-full border border-gray-200 mr-3"
                        />
                        <h3 className="text-md font-semibold text-gray-800 leading-tight">
                            {job.company.name}
                        </h3>
                    </div>

                    <div className="text-gray-600 mb-2 flex items-center">
                        <FontAwesomeIcon icon={faUsers} className="mr-2 text-gray-300" />
                        <span className="text-sm flex">Quy mô: <p className='ml-2 font-bold'>{job.company.companySize} nhân viên</p></span>
                    </div>

                    <div className="text-gray-600 mb-2 flex items-center">
                        <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-300" />
                        <span className="text-sm flex">Lĩnh vực: <p className='ml-2 font-bold'>{job.company.industry}</p></span>
                    </div>

                    <div className="text-gray-600 mb-4 flex items-start">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-300" />
                        <span className="text-sm">
                        <span className="text-sm flex">Địa điểm: <p className='ml-2 font-bold'>{job.company.location}</p></span>
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
                        <span className="text-sm flex flex-col">Cấp bậc <span className="font-bold">Nhân viên</span></span>
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
                        <span className="text-sm flex flex-col">Số lượng tuyển <span className="font-bold">2 người</span></span>
                    </div>

                    <div className="text-gray-600 mb-3 flex items-center">
                        <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                            <FontAwesomeIcon icon={faClock} className='text-sm' />
                        </div>
                        <span className="text-sm flex flex-col">Hình thức làm việc <span className="font-bold">Toàn thời gian</span></span>
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
        </div>
    );
}

export default JobDetail;
