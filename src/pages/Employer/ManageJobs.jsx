import { useState, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { jwtDecode } from "jwt-decode";
import { extendJob, fetchJobs, getBestCvMatch, getCv, getCvFile, updateJob } from '../../utils/ApiFunctions';
import Swal from 'sweetalert2';
import Tooltip from '@mui/material/Tooltip';
import { ClipLoader } from 'react-spinners';
import useDebounce from '../../utils/useDebounce';


const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [userId, setUserId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(true);
  const debouncedInput = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  const loadJobs = async (page = 0) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.user_id);
        const result = await fetchJobs(decodedToken.user_id, page, 10, searchTerm);
        console.log("RESULTT", result)
        if (result.data) {
          setJobs(result.data);
          setTotalPages(result.totalPages);
          setTotalElements(result.totalElements);
        } else {
          console.error('Error fetching jobs:', result.error);
        }
      }
    } catch (error) {
      console.error('Error in loadJobs:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, status) => {
    const confirmation = await Swal.fire({
      title: 'Xác nhận thay đổi trạng thái?',
      text: `Bạn có chắc chắn muốn ${status === 'SHOW' ? `'Hiển thị'` : `'Ẩn'`} tin tuyển dụng này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
    });

    if (confirmation.isConfirmed) {
      Swal.fire({
        title: 'Đang thay đổi trạng thái...',
        text: 'Vui lòng chờ trong giây lát.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        const statusUpdated = { status };
        const response = await updateJob(jobId, statusUpdated);
        if (response && !response.error) {
          Swal.fire({
            title: 'Thành công!',
            text: 'Trạng thái đã được thay đổi.',
            icon: 'success',
          });
          loadJobs(currentPage); // Refresh the job list
        } else {
          Swal.fire({
            title: 'Lỗi!',
            text: 'Không thể thay đổi trạng thái. Vui lòng thử lại.',
            icon: 'error',
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Đã xảy ra lỗi trong quá trình xử lý.',
          icon: 'error',
        });
      }
    }
  }

  const handleEdit = (job) => {
    navigate('/dashboard/tao-cong-viec', {
      state: {
        id: job.id,
        title: job.title,
        description: job.description,
        requirement: job.requirement,
        workExperience: job.workExperience,
        benefits: job.benefits,
        salary: job.salary,
        industry: job.industry,
        level: job.level,
        workType: job.workType,
        address: job.address,
        numberOfRecruits: job.numberOfRecruits,
        deadline: job.deadline,
      },
    });
  };
  const handleAddJobSample = (job) => {
    navigate('/dashboard/tao-cong-viec', {
      state: {
        id: "",
        title: job.title,
        description: job.description,
        requirement: job.requirement,
        workExperience: job.workExperience,
        benefits: job.benefits,
        salary: job.salary,
        industry: job.industry,
        level: job.level,
        workType: job.workType,
        address: job.address,
        numberOfRecruits: job.numberOfRecruits,
        deadline: job.deadline,
      },
    });
  };

  const handleAdd = () => {
    navigate('/dashboard/tao-cong-viec');
  };

  const handleManageCV = (jobTitle, jobId) => {
    navigate('/dashboard/quan-li-cv', {
      state: {
        jobTitle,
        jobId,
      },
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadJobs(newPage);
  };

  const handleFindSuitableCandidates = (jobTitle, jobId) => {
    if (jobId) {
      navigate('/dashboard/quan-li-cv', {
        state: {
          jobTitle,
          jobId,
          mode: "search"
        },
      });
    } else {
      alert("Vui lòng chọn một tin tuyển dụng trước.");
    }
  };

  // const handleFindSuitableCandidates = async (jobId) => {
  //   setLoading1(true);
  //   if (jobId) {
  //     try {
  //       const response = await getBestCvMatch(jobId, 10);
  //       console.log("THIRALAVAY", response.data);
  //       setCvs(response.data);
  //       setOpenModal(true);
  //       setLoading1(false);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy danh sách CV:", error);
  //       alert("Đã có lỗi xảy ra khi tìm ứng viên.");
  //     }
  //   } else {
  //     alert("Vui lòng chọn một tin tuyển dụng trước.");
  //   }
  // };

  const handleExtendJob = async (jobId) => {
    if (!jobId) return;

    const confirmExtend = window.confirm("Nếu gia hạn bạn sẽ mất một lần đăng tin. Bạn có chắc chắn muốn gia hạn?");
    if (!confirmExtend) return;

    try {
      const response = await extendJob(jobId);
      if (response.status === 200) {
        alert("Bạn đã gia hạn thành công");
      }
    } catch (error) {
      console.error("Lỗi khi gia hạn công việc:", error);
      alert("Đã có lỗi xảy ra khi gia hạn công việc");
    }
  };

  const handleCvClick = async (cv) => {
    console.log("CVNE456", cv)
    // if (cv.cvType === "UPLOADED_CV") {
    //   try {
    //     const result = await getCvFile(cv.cvId);
    //     if (result.data) {
    //       window.open(result.data.cvUrl, "_blank");
    //     } else {
    //       console.error("Không tìm thấy CV tải lên:", result.error);
    //       alert("Không thể mở CV tải lên.");
    //     }
    //   } catch (error) {
    //     console.error("Lỗi khi lấy CV tải lên:", error);
    //   }
    // } else if (cv.cvType === "CREATED_CV") {
    try {
      const result = await getCv(cv.id);
      if (result.data) {
        localStorage.setItem("selectedCvData", JSON.stringify(result.data));
        window.open("/tao-cv", "_blank");
      } else {
        console.error("Không tìm thấy CV tạo:", result.error);
        alert("Không thể mở CV tạo.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy CV tạo:", error);
    }
    // } else {
    //   alert("Loại CV không hợp lệ.");
    // }
  };
  useEffect(() => {
    loadJobs(currentPage);
  }, [currentPage, debouncedInput]);
  console.log("JOBNE", jobs)
  return (
    <div className="p-8 mt-10 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Quản lý tin tuyển dụng</h2>
        <Button
          variant="outlined"
          onClick={handleAdd}
          className="flex items-center py-2 px-4 bg-green-500 text-white rounded-xl shadow-md hover:shadow-lg transition duration-300"
        >
          <FaPlus className="mr-2" />
          Thêm tin tuyển dụng mới
        </Button>
      </div>

      {/* Search bar with icon */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm tên công việc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}  // Cập nhật searchTerm khi người dùng nhập
          className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
        />
        <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="ml-4 text-blue-500 font-medium">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <>


          {/* Jobs table */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-6 text-left text-gray-700 font-semibold">Tên công việc</th>
                  <th className="py-3 px-6 text-left text-gray-700 font-semibold">Trạng thái</th>
                  <th className="py-3 px-6 text-left text-gray-700 font-semibold">CV ứng tuyển</th>
                  <th className="py-3 px-6 text-left text-gray-700 font-semibold">Hành động</th>
                  <th className="py-3 px-6 text-left text-gray-700 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition duration-200">
                      <td className="py-4 px-6 border-b">{job.title}</td>
                      <td className="py-4 px-6 border-b">
                        {new Date(job.deadline) > new Date() ? 'Đang tuyển' : 'Hết hạn'}
                      </td>
                      <td className="py-4 px-4 border-b">
                        <Button
                          variant="outlined"
                          startIcon={<FolderOpenIcon />}
                          onClick={() => handleManageCV(job.title, job.id)}
                          className="py-3 px-12 w-36 bg-blue-500 text-white rounded-lg transition duration-200"
                        >
                          {job.cvCount} <p className='text-xs'>CV ứng viên</p>
                        </Button>
                      </td>
                      <td className="py-2 px-3 border-b">
                        <div className="flex gap-1">
                          <Tooltip title="Sửa" arrow>
                            <Button
                              onClick={() => handleEdit(job)}
                              className="min-w-0 w-6 h-6 text-xs bg-yellow-500 text-white rounded-full hover:opacity-80"
                            >
                              ✏️
                            </Button>
                          </Tooltip>
                          <Tooltip title="Tìm ứng viên phù hợp" arrow>
                            <Button
                              onClick={() => handleFindSuitableCandidates(job.title, job.id)}
                              className="min-w-0 w-6 h-6 text-xs bg-purple-600 text-white rounded-full hover:opacity-80"
                            >
                              🔍
                            </Button>
                          </Tooltip>
                          <Tooltip title="Gia hạn công việc" arrow>
                            <Button
                              onClick={() => handleExtendJob(job.id)}
                              className="min-w-0 w-6 h-6 text-xs bg-purple-600 text-white rounded-full hover:opacity-80"
                            >
                              ⏳
                            </Button>
                          </Tooltip>
                          <Tooltip title="Tạo công việc theo mẫu" arrow>
                            <Button
                              onClick={() => handleAddJobSample(job)}
                              className="min-w-0 w-6 h-6 text-xs bg-purple-600 text-white rounded-full hover:opacity-80"
                            >
                              📝
                            </Button>
                          </Tooltip>
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b">
                        {(() => {
                          switch (job.status) {
                            case 'PENDING_APPROVAL':
                              return (
                                <Button
                                  variant="contained"
                                  startIcon={<CheckCircleOutlineIcon />}
                                  sx={{ width: '150px' }}
                                  disabled={true}
                                  onClick={() => handleStatusChange(job.id, 'SHOW')}
                                  className="py-1 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                >
                                  Chờ duyệt
                                </Button>
                              );
                            case 'SHOW':
                              return (
                                <>
                                  <Tooltip title="Đang ở trạng thái Hiển thị. Click để Ẩn">
                                    <Button
                                      variant="contained"
                                      startIcon={<VisibilityOutlinedIcon />}
                                      sx={{ width: '150px' }}
                                      onClick={() => handleStatusChange(job.id, 'HIDE')}
                                      className="py-1 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                                    >
                                      Hiển thị
                                    </Button>
                                  </Tooltip>
                                </>
                              );
                            case 'HIDE':
                              return (
                                <>
                                  <Tooltip title="Đang ở trạng thái Ẩn. Click để Hiển thị">
                                    <Button
                                      variant="contained"
                                      sx={{ width: '150px' }}
                                      startIcon={<VisibilityOffOutlinedIcon />}
                                      onClick={() => handleStatusChange(job.id, 'SHOW')}
                                      className="py-1 px-4 bg-gray-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                                    >
                                      Đang ẩn
                                    </Button>
                                  </Tooltip>
                                </>
                              );
                            case 'DISQUALIFIED':
                              return (
                                <Button
                                  variant="contained"
                                  sx={{ width: '150px' }}
                                  startIcon={<BlockOutlinedIcon />}
                                  disabled={true}
                                  onClick={() => handleStatusChange(job.id, 'SHOW')}
                                  color=''
                                  className="py-1 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                >
                                  Bị từ chối
                                </Button>
                              );
                            default:
                              return null;
                          }
                        })()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 px-6 text-center text-gray-500">
                      Không có tin tuyển dụng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {openModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full">
                  <h3 className="text-xl font-bold mb-4">Ứng viên phù hợp</h3>
                  {loading1 ? (
                    <div className="flex justify-center items-center mb-10">
                      <ClipLoader color="#4caf50" size={40} />
                    </div>
                  ) : (<>
                    <ul className="space-y-4 max-h-[400px] overflow-y-auto">
                      {cvs.filter(item => item.score > 0).length > 0 ? (
                        cvs
                          .filter(item => item.score > 0)
                          .map((item, index) => (
                            <li key={index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition">
                              <span className="font-medium">{item.cv.fullName}</span>
                              <button
                                onClick={() => handleCvClick(item.cv)}
                                className="text-blue-600 hover:underline"
                              >
                                Xem CV
                              </button>
                            </li>
                          ))
                      ) : (
                        !loading1 && (
                          <p className="text-gray-500 p-4">Không tìm thấy ứng viên phù hợp.</p>
                        )
                      )}
                    </ul>
                  </>
                  )}
                  <div className="mt-6 text-right">
                    <button
                      onClick={() => setOpenModal(false)}
                      className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-gray-600">Tổng số công việc: {totalElements}</span>
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-4 py-2">Trang {currentPage + 1} / {totalPages}</span>
              <button
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageJobs;
