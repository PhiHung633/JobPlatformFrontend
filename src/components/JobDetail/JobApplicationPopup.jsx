import { useState, useEffect } from "react";
import { addApplication, fetchCvs, fetchCvsFile } from "../../utils/ApiFunctions";
import { Link } from "react-router-dom";

const JobApplicationPopup = ({ isPopupOpen, job, handleCloseClick, userId }) => {
    console.log("HULAA",job.title)
    const [onlineCVs, setOnlineCVs] = useState([]);
    const [uploadedCVs, setUploadedCVs] = useState([]);
    const [selectedCV, setSelectedCV] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const onlineResponse = await fetchCvs(userId, 0, 10);
                const uploadedResponse = await fetchCvsFile(userId);
                console.log("ONEE", onlineResponse);
                console.log("TWEE", uploadedResponse);

                if (onlineResponse.data) {
                    setOnlineCVs(onlineResponse.data.cvs);
                }

                if (uploadedResponse.data) {
                    setUploadedCVs(uploadedResponse.data.cvs);
                }
            } catch (error) {
                console.error("Error fetching CVs:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isPopupOpen) {
            fetchData();
        }
    }, [isPopupOpen, userId]);

    const handleCvClick = (cv) => {
        localStorage.setItem("selectedCvData", JSON.stringify(cv));
        window.open("/tao-cv", "_blank"); 
    };

    const handleSelectCV = (cv) => {
        setSelectedCV(cv);
    };

    const handleSubmitApplication = async () => {
        if (selectedCV === null) {
            alert("Vui lòng chọn CV trước khi ứng tuyển.");
            return;
        }
        const cvType = selectedCV.type === "CV Online" ? "CREATED_CV" : "UPLOADED_CV";

        const applicationData = {
            jobId: job.id,         
            status: "PENDING",     
            cvId: selectedCV.id,   
            cvType: cvType
        };
        
        console.log("CREAAANE",applicationData)
        const { data, error } = await addApplication(applicationData);

        if (data) {
            alert("Bạn đã ứng tuyển thành công!");
            handleCloseClick();
        } else {
            console.error("Lỗi khi nộp hồ sơ:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại sau.");
        }
    };

    if (loading) {
        return (
            isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative">
                        <p className="text-gray-600 text-center">Đang tải...</p>
                    </div>
                </div>
            )
        );
    }

    return (
        isPopupOpen && (
            <div className="mt-20 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative">
                    <h2 className="text-xl font-bold mb-4 text-green-600">
                        Ứng tuyển <span className="font-bold">{job.title || job[0].title } tại {job.companyLocation || job[0].companyLocation}</span>
                    </h2>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Chọn CV để ứng tuyển</h3>

                        {selectedCV === null && (
                            <div className="border border-gray-300 rounded-xl p-4 mb-4">
                                {/* CV Online */}
                                <div className="pl-2 mb-4">
                                    <p className="font-semibold text-gray-800 mb-2">CV Online</p>
                                    {onlineCVs.length > 0 ? (
                                        onlineCVs.map((cv, index) => (
                                            <div
                                                key={cv.id || index}
                                                className="border rounded-xl group hover:border-green-500 mb-2"
                                            >
                                                <div className="flex items-center justify-between px-4 py-2">
                                                    <div className="flex items-center space-x-2">
                                                        <p className="text-gray-700">{cv.jobPosition || "CV không tên"}</p>
                                                        <button
                                                            className="text-green-600 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => handleCvClick(cv)}
                                                        >
                                                            Xem
                                                        </button>
                                                    </div>
                                                    <button
                                                        className="bg-green-500 text-white px-4 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => handleSelectCV({ type: "CV Online", ...cv })}
                                                    >
                                                        Chọn CV
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">Không có CV Online nào</p>
                                    )}
                                </div>

                                {/* Uploaded CV */}
                                <div className="pl-2 mb-4">
                                    <p className="font-semibold text-gray-800 mb-2">CV đã tải lên</p>
                                    {uploadedCVs.length > 0 ? (
                                        uploadedCVs.slice(0, 5).map((cv, index) => (
                                            <div
                                                key={cv.id || index}
                                                className="border rounded-xl group hover:border-green-500 mb-2"
                                            >
                                                <div className="flex items-center justify-between px-4 py-2">
                                                    <div className="flex items-center space-x-2">
                                                        <p className="text-gray-700">{cv.cvName || "CV không tên"}</p>
                                                        <Link
                                                            to={cv.cvUrl}
                                                            className="text-green-600 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Xem
                                                        </Link>
                                                    </div>
                                                    <button
                                                        className="bg-green-500 text-white px-4 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => handleSelectCV({ type: "CV đã tải lên", ...cv })}
                                                    >
                                                        Chọn CV
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">Không có CV đã tải lên nào</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedCV && (
                            <div className="flex items-center justify-between border border-green-500 rounded-xl px-4 py-2">
                                <div className="flex items-center space-x-2">
                                    <p className="font-semibold text-green-600">
                                        {selectedCV.type}: <span className="text-gray-700">{selectedCV.jobPosition ?? selectedCV.cvName}</span>
                                    </p>
                                    <Link
                                        to={selectedCV.cvUrl}
                                        className="text-green-600 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Xem
                                    </Link>
                                </div>
                                <button
                                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg flex items-center hover:bg-gray-200"
                                    onClick={() => setSelectedCV(null)}
                                >
                                    Thay đổi
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl mr-2 hover:bg-gray-400"
                            onClick={handleCloseClick}
                        >
                            Hủy
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
                            onClick={handleSubmitApplication} // Gọi hàm nộp hồ sơ ứng tuyển
                        >
                            Nộp hồ sơ ứng tuyển
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default JobApplicationPopup;
