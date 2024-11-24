// Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiGrid, FiCalendar, FiUser, FiFileText, FiSettings, FiBarChart2, FiLayers } from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed h-screen w-64 bg-gray-900 text-gray-300 flex flex-col p-6">
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 rounded-full h-10 w-10 flex items-center justify-center">
          <span className="text-white text-xl font-bold">Job</span>
        </div>
        <h1 className="text-white text-2xl font-semibold ml-3">Quản trị</h1>
      </div>
      <div className="mb-6">
        <p className="text-gray-500 uppercase text-sm mb-4">Menu</p>
        <ul>
          <li className={`flex items-center mb-4 ${isActive('/admin') ? 'text-white bg-gray-700 rounded-md px-3 py-2' : 'text-gray-300 hover:text-white'}`}>
            <FiGrid className="mr-3" />
            <Link to="/admin">Duyệt tin tuyển dụng</Link>
          </li>
          <li className={`flex items-center mb-4 ${isActive('/admin/calendar') ? 'text-white bg-gray-700 rounded-md px-3 py-2' : 'text-gray-300 hover:text-white'}`}>
            <FiCalendar className="mr-3" />
            <Link to="/admin/calendar">Calendar</Link>
          </li>
          <li className={`flex items-center mb-4 ${isActive('/admin/profile') ? 'text-white bg-gray-700 rounded-md px-3 py-2' : 'text-gray-300 hover:text-white'}`}>
            <FiUser className="mr-3" />
            <Link to="/admin/profile">Profile</Link>
          </li>
          <li className={`flex items-center mb-4 ${isActive('/admin/forms') ? 'text-white bg-gray-700 rounded-md px-3 py-2' : 'text-gray-300 hover:text-white'}`}>
            <FiFileText className="mr-3" />
            <Link to="/admin/forms">Forms</Link>
          </li>
          <li className={`flex items-center mb-4 ${isActive('/admin/tables') ? 'text-white bg-gray-700 rounded-md px-3 py-2' : 'text-gray-300 hover:text-white'}`}>
            <FiLayers className="mr-3" />
            <Link to="/admin/tables">Tables</Link>
          </li>
          <li className={`flex items-center mb-4 ${isActive('/admin/settings') ? 'text-white bg-gray-700 rounded-md px-3 py-2' : 'text-gray-300 hover:text-white'}`}>
            <FiSettings className="mr-3" />
            <Link to="/admin/settings">Settings</Link>
          </li>
        </ul>
      </div>
      <div>
        <p className="text-gray-500 uppercase text-sm mb-4">Others</p>
        <ul>
          <li className={`flex items-center mb-4 ${isActive('/admin/chart') ? 'text-white bg-gray-700 rounded-md px-3 py-2' : 'text-gray-300 hover:text-white'}`}>
            <FiBarChart2 className="mr-3" />
            <Link to="/admin/chart">Chart</Link>
          </li>
          <li className={`flex items-center mb-4 ${isActive('/admin/ui-elements') ? 'text-white bg-gray-700 rounded-md px-3 py-2' : 'text-gray-300 hover:text-white'}`}>
            <FiLayers className="mr-3" />
            <Link to="/admin/ui-elements">UI Elements</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
