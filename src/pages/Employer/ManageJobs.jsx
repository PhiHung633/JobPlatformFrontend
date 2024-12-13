import { useState, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { jwtDecode } from "jwt-decode";
import { fetchJobs } from '../../utils/ApiFunctions';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const loadJobs = async (page = 0) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.user_id);
      }
      console.log("UACOMA",userId)
      const result = await fetchJobs(userId, page, 10, searchTerm);
      console.log("RESULTT",result)
      if (result.data) {
        setJobs(result.data);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      } else {
        console.error('Error fetching jobs:', result.error);
      }
    } catch (error) {
      console.error('Error in loadJobs:', error);
    }
  };

  const handleDelete = (id) => {
    const updatedJobs = jobs.filter((job) => job.id !== id);
    setJobs(updatedJobs);
  };

  const handleEdit = (job) => {
    navigate('/dashboard/tao-cong-viec', {
      state: {
        id: job.id,
        title: job.title,
        description: job.description,
        workExperience: job.workExperience,
        benefits: job.benefits,
        salary: job.salary,
        industry:job.industry,
        level:job.level,
        workType:job.workType,
        address:job.address,
        numberOfRecruits:job.numberOfRecruits,
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
  console.log("JOBNE",jobs)
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

      {/* Jobs table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-6 text-left text-gray-700 font-semibold">Tên công việc</th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold">Trạng thái</th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold">CV ứng tuyển</th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold">Hành động</th>
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
                  <td className="py-4 px-6 border-b flex space-x-2">
                    <Button
                      variant="contained"
                      startIcon={<EditOutlinedIcon />}
                      onClick={() => handleEdit(job)}
                      className="py-1 px-4 bg-yellow-500 text-white rounded-lg transition duration-200"
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<DeleteOutlineOutlinedIcon />}
                      color="error"
                      onClick={() => handleDelete(job.id)}
                      className="py-1 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      Xóa
                    </Button>
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
    </div>
  );
};

export default ManageJobs;
