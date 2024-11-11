import { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';

const sampleJobs = [
  { id: 1, title: 'Frontend Developer', status: 'Đang tuyển', cvCount: 5 },
  { id: 2, title: 'Backend Developer', status: 'Hết hạn', cvCount: 3 },
];

const ManageJobs = () => {
  const [jobs, setJobs] = useState(sampleJobs);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id) => {
    const updatedJobs = jobs.filter(job => job.id !== id);
    setJobs(updatedJobs);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 mt-10 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Quản lý tin tuyển dụng</h2>
        <button className="flex items-center py-2 px-4 bg-green-500 text-white rounded-lg">
          <FaPlus className="mr-2" />
          Thêm tin tuyển dụng mới
        </button>
      </div>

      {/* Search bar with icon */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm tên công việc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-4 pr-10 border rounded-lg"
        />
        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
      </div>

      {/* Jobs table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold border-b">Tên công việc</th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold border-b">Trạng thái</th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold border-b">CV ứng tuyển</th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-100">
                <td className="py-4 px-6 border-b">{job.title}</td>
                <td className="py-4 px-6 border-b">{job.status}</td>
                <td className="py-4 px-6 border-b">{job.cvCount} CV</td>
                <td className="py-4 px-6 border-b flex space-x-2">
                  <button className="py-1 px-3 bg-yellow-500 text-white rounded-lg">Sửa</button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="py-1 px-3 bg-red-500 text-white rounded-lg"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageJobs;
