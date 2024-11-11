import { useState } from 'react';
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Toggle popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Handle logout action
  const handleLogout = () => {
    alert('Bạn đã đăng xuất');
    setIsPopupOpen(false); // Đóng popup sau khi nhấn Đăng xuất
  };

  return (
    <div className="flex justify-between items-center bg-blue-900 text-white p-4 shadow-md relative">
      {/* Logo and Menu */}
      <div className="flex items-center space-x-3">
        <FaBars className="text-xl cursor-pointer" />
        <div className="text-xl font-bold">JobSearch</div>
      </div>

      {/* Notification and User Avatar */}
      <div className="flex items-center space-x-4">
        <FaBell className="text-xl cursor-pointer" />
        <div className="relative">
          <FaUserCircle
            className="text-2xl cursor-pointer"
            onClick={togglePopup}
          />

          {/* Popup Menu */}
          {isPopupOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg z-50">
              <ul className="flex flex-col">
                <li
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="text-black mr-2" />
                  <span>Đăng xuất</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
