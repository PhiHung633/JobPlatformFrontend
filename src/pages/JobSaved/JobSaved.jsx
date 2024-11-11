import { faDollar, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { fetchJobSavesByUser } from "../../utils/ApiFunctions";

const JobSaved = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadJobSaves = async () => {
            const { data, error } = await fetchJobSavesByUser();
            if (data) {
                setSavedJobs(data);
            } else {
                setError(error);
            }
        };
        loadJobSaves();
    }, []);

    return (
        <div className="flex max-w-5xl mx-52 gap-6 mt-10">
            <div className="w-3/5 bg-white rounded-xl shadow-md overflow-hidden self-start">
                <div className="bg-gradient-to-r from-green-600 to-green-400 p-6 text-white">
                    <h2 className="text-2xl font-semibold">Việc làm đã lưu</h2>
                    <p className="mt-2">Xem lại danh sách những việc làm mà bạn đã lưu trước đó. Ứng tuyển ngay để không bỏ lỡ cơ hội nghề nghiệp dành cho bạn.</p>
                </div>

                {error ? (
                    <p className="text-red-500 text-center">Có lỗi xảy ra khi tải dữ liệu.</p>
                ) :savedJobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-3/5">
                        <img src="/empty.webp" alt="No jobs saved" className="w-36 h-28 mb-4" />
                        <p className="text-gray-600 text-center mb-4">Bạn chưa lưu công việc nào!</p>
                        <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-600">
                            Tìm việc ngay
                        </button>
                    </div>
                ) : (
                    <div className="p-4 space-y-4">
                        {savedJobs.map((job) => (
                            <div key={job.id} className="bg-white border border-green-400 p-4 rounded-lg shadow-md">
                                <div className="flex items-start mb-3">
                                    <img src={job.user.company.images} alt="Company logo" className="w-14 h-14 rounded-full mr-3" />
                                    <div className="flex flex-col w-full">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-lg font-bold text-green-600 truncate-text w-80">{job.job.title}</h4>
                                            <span className="flex ml-10 text-green-500">
                                                {job.salary}
                                            </span>
                                        </div>
                                        <p className="text-gray-500">{job.user.company.name}</p>
                                        <p className="text-xs text-gray-400">Đã lưu: {job.savedAt}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex gap-5">
                                        <span className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faLocationDot} className="text-green-400" />
                                            <p className="text-sm text-gray-500">{job.user.company.location}</p>
                                        </span>
                                        <p className="text-xs text-gray-400"></p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="bg-green-500 text-white font-semibold py-1 px-4 rounded-lg hover:bg-green-600">Ứng tuyển</button>
                                        <button className="bg-gray-200 text-gray-600 font-semibold py-1 px-4 rounded-lg hover:bg-gray-300">Bỏ lưu</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-2/5 self-start">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Có thể bạn quan tâm</h3>

                <div className="bg-white rounded-xl shadow-md p-4 border border-green-400">
                    <div className="p-2 rounded-lg mb-4">
                        <div className="flex items-center mb-3">
                            <img src="/logo-cong-ty-dat-xanh-mien-nam.jpg" alt="Company logo" className="w-14 h-14 rounded-full mr-3" />
                            <div>
                                <h4 className=" text-base font-bold">Công ty CP Đầu tư và Dịch vụ Đất Xanh Miền Nam</h4>
                            </div>
                        </div>
                        <ul className="space-y-5">
                            <li className="flex flex-col space-y-3 text-gray-800">
                                <span>Chuyên Viên Hành Chính - 2 Năm Kinh Nghiệm</span>
                                <div className="flex gap-5">
                                    <span className="flex items-center gap-1">
                                        <span className="inline-flex justify-center items-center w-5 h-5 bg-green-400 rounded-full">
                                            <FontAwesomeIcon icon={faDollar} className="text-white text-xs" />
                                        </span>
                                        <p className="text-sm text-green-500">
                                            Thỏa thuận
                                        </p>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="inline-flex justify-center items-center w-5 h-5 bg-green-400 rounded-full">
                                            <FontAwesomeIcon icon={faLocationDot} className="text-white text-xs" />
                                        </span>
                                        <p className="text-sm text-gray-500">
                                            Hồ Chí Minh
                                        </p>
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <button className="w-full bg-green-500 text-white font-semibold py-2 rounded-xl hover:bg-green-600">
                        Tìm hiểu ngay
                    </button>
                </div>
            </div>
        </div>
    );

};

export default JobSaved;
