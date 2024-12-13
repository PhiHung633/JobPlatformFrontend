import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaStar, FaDownload, FaTrash, FaUpload, FaRobot } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import Modal from "react-modal";
import { fetchCvs, deleteCv, uploadCv, fetchCvsFile, deleteCvUpload, evaluateCv, evaluateCvFile } from "../../utils/ApiFunctions";

function CvList() {
    const [cvs, setCvs] = useState([]);
    const [uploadedCvs, setUploadedCvs] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    let fileInput = null;
    const [currentPage, setCurrentPage] = useState(0);
    const [userId, setUserId] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [evaluationContent, setEvaluationContent] = useState("");
    const [modalIsOpenFile, setModalIsOpenFile] = useState(false);
    const [evaluationContentFile, setEvaluationContentFile] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.user_id);
        }
    }, []);
    useEffect(() => {
        if (!userId) return;

        const getCvsData = async () => {
            const response = await fetchCvs(userId, currentPage, 10);
            if (!response.error) {
                setCvs(response.data.cvs);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            } else {
                console.log("Error:", response.error);
            }
        };

        const getUploadedCvs = async () => {
            const response = await fetchCvsFile(userId);
            console.log("rESSNE", response)
            if (!response.error) {
                setUploadedCvs(response.data.cvs || []);
            } else {
                console.log("Error fetching uploaded CVs:", response.error);
            }
        };

        getCvsData();
        getUploadedCvs();
    }, [userId, currentPage]);

    const handleCvClick = (cv) => {
        localStorage.setItem("selectedCvData", JSON.stringify(cv));
        navigate("/tao-cv");
    };
    const handleAddCv = () => {
        navigate("/tao-cv");
    };

    const handleDeleteCv = async (cvId) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa CV này không?");
        if (isConfirmed) {
            const response = await deleteCv(cvId);
            if (!response.error) {
                setCvs((prevCvs) => prevCvs.filter((cv) => cv.id !== cvId));
                setTotalElements((prevTotal) => prevTotal - 1);
            } else {
                console.log("Error deleting CV:", response.error);
            }
        }
    };

    const handleEvaluateCv = async (id) => {
        const { data, error } = await evaluateCv(id);

        if (error) {
            console.error("Error evaluating CV:", error);
            alert("Đã xảy ra lỗi khi đánh giá CV. Vui lòng thử lại.");
        } else {
            const content = data?.candidates[0]?.content?.parts[0]?.text || "Không có dữ liệu.";
            setEvaluationContent(content);
            setModalIsOpen(true);
        }
    };

    const handleEvaluateCvFile = async (id) => {
        const { data, error } = await evaluateCvFile(id);
        console.log("DATANE",data)
        if (error) {
            console.error("Error evaluating CV:", error);
            alert("Đã xảy ra lỗi khi đánh giá CV. Vui lòng thử lại.");
        } else {
            const content = data?.candidates[0]?.content?.parts[0]?.text || "Không có dữ liệu.";
            setEvaluationContentFile(content);
            setModalIsOpenFile(true);
        }
    };

    const handleDeleteUploadedCv = async (cvId) => {
        console.log("CVID", cvId)
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa CV này không?");
        if (isConfirmed) {
            const response = await deleteCvUpload(cvId);
            if (!response.error) {
                setUploadedCvs((prevCvs) => prevCvs.filter((cv) => cv.id !== cvId));
                setTotalElements((prevTotal) => prevTotal - 1);
                console.log("CV deleted successfully");
            } else {
                console.error("Error deleting CV:", response.error);
                alert("Xóa CV không thành công. Vui lòng thử lại.");
            }
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            //userid
            const response = await uploadCv(file, userId);

            if (!response.error) {
                const fileUrl = response.data?.cvUrl;
                const fileName = file.name;

                setUploadedCvs((prev) => [
                    ...prev,
                    { id: Date.now(), fileName, fileUrl, createdAt: new Date() },
                ]);
                setTotalElements((prevTotal) => prevTotal + 1);

                console.log("File uploaded successfully:", response.data);
            } else {
                console.log("Error uploading file:", response.error);
            }
        }
    };

    const handleUploadClick = () => {
        fileInput.click();
    };

    console.log("UPDD", uploadedCvs)
    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">CV đã tạo trên JobSearch</h2>
                    <button
                        onClick={() => handleAddCv()}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600">
                        <FaPlus className="w-5 h-5" />
                        <span>Tạo mới</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {cvs.map((cv) => (
                        <div key={cv.id} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex items-center gap-4">
                                <div className=" w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                    <img
                                        src={cv.imageCV}
                                        alt="Ảnh"
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3
                                        className="text-green-600 font-semibold cursor-pointer hover:underline"
                                        onClick={() => handleCvClick(cv)}
                                    >
                                        {cv.jobPosition}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        Cập nhật lần cuối {new Date(cv.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center text-gray-600">
                                <div className="flex gap-2">
                                    {/* <button className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">
                                        <FaStar />
                                        <span>Đặt làm CV chính</span>
                                    </button> */}

                                    <button
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                                        onClick={() => handleEvaluateCv(cv.id)}
                                    >
                                        <FaRobot />
                                        <span>Đánh giá CV bằng AI</span>
                                    </button>
                                    <Modal
                                        isOpen={modalIsOpen}
                                        onRequestClose={() => setModalIsOpen(false)}
                                        style={{
                                            content: {
                                                maxWidth: "600px",
                                                margin: "auto",
                                                marginTop: "50px",
                                                padding: "20px",
                                                borderRadius: "10px",
                                                border: "1px solid #ccc",
                                                height:"500px",
                                                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
                                            },
                                            overlay: {
                                                backgroundColor: "rgba(0, 0, 0, 0.5)"
                                            }
                                        }}
                                    >
                                        <h2>Đánh giá CV</h2>
                                        <div className="whitespace-pre-line">{evaluationContent}</div>
                                        <button
                                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            onClick={() => setModalIsOpen(false)}
                                        >
                                            Đóng
                                        </button>
                                    </Modal>
                                </div>
                                <div>
                                    <button
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-red-200 text-red-600 rounded hover:bg-red-300"
                                        onClick={() => handleDeleteCv(cv.id)}
                                    >
                                        <FaTrash />
                                        <span>Xóa</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">CV đã tải lên JobSearch</h2>
                    <button
                        onClick={handleUploadClick}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600">
                        <FaUpload className="w-5 h-5" />
                        <span>Tải CV lên</span>
                    </button>
                </div>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    ref={(input) => (fileInput = input)}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                <div className="grid grid-cols-1 gap-6">
                    {Object.values(uploadedCvs).map((cv) => (
                        <div key={cv.id} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-500">PDF</span>
                                </div>
                                <div className="flex-1">
                                    <h3
                                        className="text-green-600 font-semibold cursor-pointer hover:underline"
                                        onClick={() => window.open(cv.cvUrl, "_blank")}
                                    >
                                        {cv.cvName}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        Cập nhật lần cuối {new Date(cv.uploadedAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center text-gray-600">
                                <div className="flex gap-2">
                                    <button
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                                        onClick={() => window.open(cv.cvUrl, "_blank")}
                                    >
                                        <FaDownload />
                                        <span>Tải xuống</span>
                                    </button>
                                    <button
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-red-200 text-red-600 rounded hover:bg-red-300"
                                        onClick={() => handleDeleteUploadedCv(cv.id)}
                                    >
                                        <FaTrash />
                                        <span>Xóa</span>
                                    </button>
                                </div>
                                <div>
                                    <button
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                                        onClick={() => handleEvaluateCvFile(cv.id)}
                                    >
                                        <FaRobot />
                                        <span>Đánh giá CV bằng AI</span>
                                    </button>
                                    <Modal
                                        isOpen={modalIsOpenFile}
                                        onRequestClose={() => setModalIsOpenFile(false)}
                                        style={{
                                            content: {
                                                maxWidth: "600px",
                                                margin: "auto",
                                                marginTop: "50px",
                                                padding: "12px",
                                                borderRadius: "10px",
                                                border: "1px solid #ccc",
                                                height:"500px",
                                                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
                                            },
                                            overlay: {
                                                backgroundColor: "rgba(0, 0, 0, 0.5)"
                                            }
                                        }}
                                    >
                                        <h2>Đánh giá CV</h2>
                                        <div className="whitespace-pre-line">{evaluationContentFile}</div>
                                        <button
                                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            onClick={() => setModalIsOpenFile(false)}
                                        >
                                            Đóng
                                        </button>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* <div className="mt-6 text-sm text-gray-600">
                Tổng số trang: {totalPages}, Tổng số CVs: {totalElements}
            </div> */}
        </div>
    );
}

export default CvList;
