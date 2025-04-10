import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCheckCircle , FiUsers , FiBarChart2, FiHelpCircle  } from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed h-screen w-64 bg-gray-900 text-gray-300 flex flex-col p-6">
      {/* Logo Section */}
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 rounded-full h-10 w-10 flex items-center justify-center">
          <span className="text-white text-xl font-bold">Job</span>
        </div>
        <h1 className="text-white text-2xl font-semibold ml-3">Quản trị</h1>
      </div>

      {/* Menu Section */}
      <div className="mb-6">
        <p className="text-gray-500 uppercase text-sm mb-4">Menu</p>
        <ul>
          <li
            className={`flex items-center mb-4 px-2 py-2 rounded-md ${
              isActive('/admin') ? 'text-white bg-gray-800 border-l-4 border-blue-500 font-bold' : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <FiCheckCircle className="mr-3" />
            <Link to="/admin">Duyệt tin tuyển dụng</Link>
          </li>
          <li
            className={`flex items-center mb-4 px-2 py-2 rounded-md ${
              isActive('/admin/users') ? 'text-white bg-gray-800 border-l-4 border-blue-500 font-bold' : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <FiUsers className="mr-3" />
            <Link to="/admin/users">Quản lý người dùng</Link>
          </li>
          <li
            className={`flex items-center mb-4 px-2 py-2 rounded-md ${
              isActive('/admin/statistics') ? 'text-white bg-gray-800 border-l-4 border-blue-500 font-bold' : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <FiBarChart2 className="mr-3" />
            <Link to="/admin/statistics">Thống kê</Link>
          </li>
          <li
            className={`flex items-center mb-4 px-2 py-2 rounded-md ${
              isActive('/admin/questions') ? 'text-white bg-gray-800 border-l-4 border-blue-500 font-bold' : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <FiHelpCircle className="mr-3" />
            <Link to="/admin/questions">Câu hỏi IQ</Link>
          </li>
          
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
