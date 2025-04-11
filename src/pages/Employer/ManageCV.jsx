import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faSearch } from '@fortawesome/free-solid-svg-icons';
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { fetchJobs, fetchApplications, fetchUserById, fetchJobById, getCvFile, getCv, updateApplicationStatus, getBestCvMatch } from '../../utils/ApiFunctions';
import StatusModal from './StatusModal';
import InterviewInviteModal from './InterviewInviteModal';
import { CircularProgress } from "@mui/material";

const ManageCV = () => {
  const [cvs, setCvs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const location = useLocation();
  const [selectedJobId, setSelectedJobId] = useState(location.state?.jobId || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [userId, setUserId] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [currentCv, setCurrentCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const loadAllJobs = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.user_id);
    }

    let allJobs = [];
    let page = 0;
    let totalPages = 1;

    try {
      while (page < totalPages) {
        const result = await fetchJobs(userId, page, 10);
        if (result.data) {
          allJobs = [...allJobs, ...result.data];
          totalPages = result.totalPages;
          page++;
        } else {
          console.error("Lỗi khi gọi API:", result.error, result.status);
          break;
        }
      }
      setJobs(allJobs);
    } catch (err) {
      console.error("Error loading jobs:", err);
    }

    setLoading(false);
  };

  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const loadApplications = async (jobId = '', status = '') => {
    setLoading(true);
    const queryParams = {};

    if (jobId) {
      queryParams.jobId = jobId;
    } else {
      queryParams.recruiterId = userId;
    }

    queryParams.status = status || undefined;
    queryParams.name = searchTerm || undefined;
    console.log("QUERYY", queryParams)
    const result = await fetchApplications(queryParams);
    console.log("Result", result);

    if (result.data) {
      const updatedCVs = await Promise.all(
        result.data.map(async (cv) => {
          console.log("CVNE123", cv)
          const userResult = await fetchUserById(cv.userId);
          console.log("KiTa", userResult)
          const userInfo = userResult.data
            ? {
              name: userResult.data.fullName,
              email: userResult.data.email,
              phone: userResult.data.phone,
            }
            : {};

          const jobResult = await fetchJobById(cv.jobId);
          const jobInfo = jobResult.data
            ? {
              position: jobResult.data.title || 'Không xác định',
            }
            : { position: 'Không xác định' };

          return {
            ...cv,
            ...userInfo,
            ...jobInfo,
            id: cv.id,
          };
        })
      );

      setCvs(updatedCVs);
    } else {
      console.error("Lỗi khi gọi API:", result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAllJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId || jobs.length > 0) {
      loadApplications(selectedJobId, statusFilter);
    }
  }, [selectedJobId, statusFilter, searchTerm, jobs]);
  console.log(selectedJobId)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleCvClick = async (cv) => {
    console.log("CVNE456", cv)
    if (cv.cvType === "UPLOADED_CV") {
      try {
        const result = await getCvFile(cv.cvId);
        if (result.data) {
          window.open(result.data.cvUrl, "_blank");
        } else {
          console.error("Không tìm thấy CV tải lên:", result.error);
          alert("Không thể mở CV tải lên.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy CV tải lên:", error);
      }
    } else if (cv.cvType === "CREATED_CV") {
      try {
        const result = await getCv(cv.cvId);
        if (result.data) {
          localStorage.setItem("selectedCvData", JSON.stringify(result.data));
          navigate("/tao-cv");
        } else {
          console.error("Không tìm thấy CV tạo:", result.error);
          alert("Không thể mở CV tạo.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy CV tạo:", error);
      }
    } else {
      alert("Loại CV không hợp lệ.");
    }
  };

  const handleUpdateStatus = (cv) => {
    setCurrentCv(cv);
    setIsModalOpen(true);
  };

  const handleSendInterviewInvite = (cv) => {
    setCurrentCv(cv);
    setIsInviteModalOpen(true);
  };

  const handleSuccess = (data) => {
    console.log("Thư mời đã được lưu thành công:", data);
  };

  const handleSaveStatus = async (status) => {
    if (!currentCv) return;

    try {
      const { data, error } = await updateApplicationStatus(currentCv.id, status);
      if (error) {
        console.error("Failed to update status:", error);
        alert(`Cập nhật trạng thái thất bại: ${error.message || "Unknown error"}`);
      } else {
        console.log("Status updated successfully:", data);
        alert("Cập nhật trạng thái thành công!");
        window.location.reload();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
    }
  };

  const uniqueJobs = Array.from(
    new Map(jobs.map((job) => [job.title, job])).values()
  );

  return (
    <div className="p-8 bg-white">
      <h2 className="text-2xl font-semibold mb-6">Quản lý CV ứng viên</h2>

      {/* Search and Filter Section */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
          <TextField
            type="text"
            placeholder="Tìm kiếm tên, email, số điện thoại"
            className="border rounded-lg p-2 w-full pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-gray-500 cursor-pointer"
                />
              ),
            }}
          />
        </div>
        <Select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          displayEmpty
          className="w-48"
        >
          <MenuItem value="">Chọn tin tuyển dụng</MenuItem>
          {uniqueJobs.map((job) => (
            <MenuItem key={job.id} value={job.id}>
              {job.title}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          displayEmpty
          className="w-48"
        >
          <MenuItem value="">Nhập trạng thái</MenuItem>
          <MenuItem value="PENDING">Đang chờ xử lý</MenuItem>
          <MenuItem value="ACCEPTED">Đã duyệt</MenuItem>
          <MenuItem value="REJECTED">Đã từ chối</MenuItem>
          <MenuItem value="INTERVIEWING">Phỏng vấn</MenuItem>
        </Select>
      </div>

      {/* Display CVs or Empty State */}
      <div className="overflow-auto rounded-lg border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : cvs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500 mb-2">Tìm thấy 0 ứng viên</p>
            <img src="/empty-cv.webp" alt="empty folder" className="w-48 h-48 mx-auto mb-4" />
            <p className="text-gray-500">Bạn không có CV</p>
          </div>
        ) : (
          <table className="min-w-full bg-white text-sm text-left text-gray-500">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 font-medium text-gray-700">Ứng viên</th>
                <th className="px-6 py-3 font-medium text-gray-700">Chiến dịch</th>
                <th className="px-6 py-3 font-medium text-gray-700">Thông tin liên hệ</th>
                <th className="px-6 py-3 font-medium text-gray-700">Insights</th>
                <th className="px-6 py-3 font-medium text-gray-700">Trạng thái</th>
                <th className="px-6 py-3 font-medium text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cvs.map((cv, index) => (
                <tr
                  key={cv.id}
                  className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                  {/* Ứng viên */}
                  <td className="px-6 py-4 text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full text-center flex items-center justify-center">
                        {cv.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{cv.name}</p>
                      </div>
                    </div>
                  </td>

                  {/* Chiến dịch */}
                  <td className="px-6 py-4">
                    <p>{cv.position}</p>
                  </td>

                  {/* Thông tin liên hệ */}
                  <td className="px-6 py-4">
                    <p>{cv.email}</p>
                    <p className="text-xs text-gray-500">{cv.phone}</p>
                  </td>

                  {/* Insights */}
                  <td className="px-6 py-4">
                    <p>🔍 {cv.cvType === "UPLOADED_CV" ? "CV tải lên" : (cv.cvType ? "CV tạo trên JobSearch" : "Không có dữ liệu")}</p>
                    <p className="text-xs text-gray-500">{cv.appliedAt}</p>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${cv.status === "Phù hợp"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {cv.status}
                    </span>
                  </td>

                  {/* Hành động */}
                  <td className="px-10 py-4 text-center relative">
                    <div className="inline-block">
                      <button
                        onClick={() => toggleMenu(cv.id)}
                        className="py-1 px-2 text-gray-600 hover:text-gray-900"
                      >
                        <FontAwesomeIcon icon={faEllipsis} />
                      </button>
                      {openMenuId === cv.id && (
                        <div className="absolute right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <button
                            onClick={() => handleCvClick(cv)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Xem CV
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(cv)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Cập nhật trạng thái
                          </button>
                          <button
                            onClick={() => handleSendInterviewInvite(cv)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Gửi thư mời phỏng vấn
                          </button>
                        </div>
                      )}
                      <StatusModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveStatus}
                      />
                      <InterviewInviteModal
                        isOpen={isInviteModalOpen}
                        onClose={() => setIsInviteModalOpen(false)}
                        cv={currentCv}
                        onSuccess={handleSuccess}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageCV;
