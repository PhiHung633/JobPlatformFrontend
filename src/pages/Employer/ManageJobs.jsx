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
import { fetchJobs, updateJob } from '../../utils/ApiFunctions';
import Swal from 'sweetalert2';
import Tooltip from '@mui/material/Tooltip';


const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    loadJobs(currentPage);
  }, [currentPage, searchTerm]);
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
                      <td className="py-4 px-6 border-b">
                        <Button
                          variant="outlined"
                          startIcon={<FolderOpenIcon />}
                          onClick={() => handleManageCV(job.title, job.id)}
                          className="py-1 px-4 bg-blue-500 text-white rounded-lg transition duration-200"
                        >
                          {job.cvCount} CV ứng tuyển
                        </Button>
                      </td>
                      <td className="py-4 px-6 border-b">
                        <Button
                          variant="contained"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() => handleEdit(job)}
                          className="py-1 px-4 bg-yellow-500 text-white rounded-lg transition duration-200"
                        >
                          Sửa
                        </Button>
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
