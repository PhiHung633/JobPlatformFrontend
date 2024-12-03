import { faCheck, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { fetchJobById, getCv, getCvFile } from '../../utils/ApiFunctions';

const HistoryApplies = ({ applications, loading, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSelected, setIsSelected] = useState('Trạng thái');
    const [jobDetails, setJobDetails] = useState([]);
    const dropDownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleSelect = (item) => {
        setIsSelected(item);
        setIsOpen(false);
    };

    const handleViewCv = async (application, event) => {
        event.preventDefault();
        try {
            if (application.cvType === 'UPLOADED_CV') {
                const { data, error } = await getCvFile(application.cvId);
                if (data) {
                    const link = document.createElement('a');
                    link.href = data.cvUrl;
                    link.target = '_blank';
                    link.download = 'uploaded-cv.pdf';
                    link.click();
                } else {
                    console.error('Error fetching uploaded CV:', error);
                }
            } else if (application.cvType === 'CREATED_CV') {
                const { data, error } = await getCv(application.cvId);
                if (data) {
                    localStorage.setItem("selectedCvData", JSON.stringify(data));
                    window.open("/tao-cv", "_blank");
                } else {
                    console.error('Error fetching created CV:', error);
                }
            }
        } catch (error) {
            console.error('Error handling CV view:', error);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            const details = await Promise.all(
                applications.map(async (application) => {
                    const { data } = await fetchJobById(application.jobId);
                    return { ...application, jobDetails: data };
                })
            );
            setJobDetails(details);
        };

        if (applications.length > 0) {
            fetchJobs();
        }
    }, [applications]);

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (error) {
        return <p>Lỗi: {error}</p>;
    }

    if (applications.length === 0) {
        return <p>Bạn chưa ứng tuyển công việc nào.</p>;
    }

    return (
        <div className="bg-gray-100 min-h-screen w-full ml-12">
            <div className="container mx-auto px-6 max-w-screen-lg bg-white rounded-xl shadow-lg pb-5">
                <div className="flex justify-between items-center mb-5 pt-5">
                    <div className="text-lg font-bold">Việc làm đã ứng tuyển</div>
                    <div className="relative inline-block" ref={dropDownRef}>
                        <button
                            className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center justify-between w-full transition duration-200 ease"
                            onClick={toggleDropdown}
                        >
                            {isSelected}
                            <span className="ml-2 text-gray-400">&#9660;</span>
                        </button>
                        <ul
                            className={`absolute mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto w-full py-2 z-10 ${isOpen ? 'block' : 'hidden'}`}
                        >
                            {['Trạng thái', 'Đã ứng tuyển', 'NTD đã xem hồ sơ', 'Hồ sơ phù hợp', 'Hồ sơ chưa phù hợp'].map((item) => (
                                <li
                                    key={item}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${isSelected === item ? 'text-green-500 font-bold' : ''
                                        }`}
                                    onClick={() => handleSelect(item)}
                                >
                                    {item}
                                    {isSelected === item && <FontAwesomeIcon icon={faCheck} className="float-right text-green-500" />}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {jobDetails.map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-md mb-4 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0 bg-white rounded-lg h-24 w-24 border border-gray-200 p-2">
                                <img
                                    src={application.jobDetails?.companyImages || 'default-logo.png'}
                                    className="h-full w-full object-contain"
                                    alt="Company Logo"
                                />
                            </div>
                            <div className="ml-5 flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <a href="#" className="text-base font-semibold text-gray-900 hover:underline">
                                        {application.jobDetails?.title || 'N/A'}
                                    </a>
                                    <label className="text-green-600 font-semibold text-base">
                                        {application.jobDetails?.salary.toLocaleString() || 'N/A'} VNĐ
                                    </label>
                                </div>
                                <div className="text-gray-600 mb-2">
                                    <a href="#" className="text-gray-600 hover:underline">
                                        Công ty {application.jobDetails?.companyName || 'N/A'}
                                    </a>
                                </div>
                                <div className="text-sm text-gray-500 mb-2">
                                    Thời gian ứng tuyển: {new Date(application.appliedAt).toLocaleString()}
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        CV đã ứng tuyển:
                                        <a
                                            href="#"
                                            className="text-green-600 underline"
                                            onClick={(event) => handleViewCv(application, event)}
                                        >
                                            {application.cvType === 'UPLOADED_CV' ? 'CV tải lên' : 'CV tạo sẵn'}
                                        </a>
                                    </p>
                                    <div className="space-x-3">
                                        <a
                                            href="#"
                                            className="inline-flex items-center bg-green-100 text-green-600 rounded-full px-3 py-1 text-sm transition duration-300 ease hover:bg-green-200"
                                            onClick={(event) => handleViewCv(application, event)}
                                        >
                                            <FontAwesomeIcon icon={faEye} className="mr-2" />
                                            Xem chi tiết
                                        </a>
                                    </div>
                                </div>
                                <div className="border-t border-gray-300 mt-3 pt-3 flex justify-between">
                                    <div className="text-sm text-gray-600">
                                        Trạng thái: <span className="text-blue-500">{application.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryApplies;
