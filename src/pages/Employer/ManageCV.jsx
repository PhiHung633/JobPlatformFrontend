import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const ManageCV = () => {
  const [cvs, setCvs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-8 bg-white">
      <h2 className="text-2xl font-semibold mb-6">Quản lý CV ứng viên</h2>
      
      {/* Search and Filter Section */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Tìm kiếm tên, email, số điện thoại"
            className="border rounded-lg p-2 w-full pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          />
        </div>
        <select className="border rounded-lg p-2">
          <option>Chọn tin tuyển dụng</option>
        </select>
        <select className="border rounded-lg p-2">
          <option>Nhập trạng thái</option>
        </select>
      </div>

      {/* Display CVs or Empty State */}
      <div className="border rounded-lg p-6 bg-gray-50 text-center">
        {cvs.length === 0 ? (
          <>
            <p className="text-lg text-gray-500 mb-2">Tìm thấy 0 ứng viên</p>
            <img src="/empty-cv.webp" alt="empty folder" className="w-48 h-48 mx-auto mb-4" />
            <p className="text-gray-500">Bạn không có CV</p>
          </>
        ) : (
          <ul>
            {cvs.map((cv) => (
              <li key={cv.id} className="flex justify-between items-center mb-4 p-4 border rounded-lg">
                <span>{cv.name} - {cv.position}</span>
                <button
                  onClick={() => alert(`Xem CV của: ${cv.name} - Ứng tuyển vị trí: ${cv.position}`)}
                  className="py-1 px-3 bg-blue-500 text-white rounded-lg"
                >
                  Xem CV
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageCV;
