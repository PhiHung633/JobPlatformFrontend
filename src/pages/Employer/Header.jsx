import { useState, useEffect } from "react";
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { format } from 'date-fns';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { onMessage } from "firebase/messaging";
import { messaging } from '../../utils/firebase.js'
import { fetchNotifications } from "../../utils/ApiFunctions";
import { Link, useNavigate } from "react-router-dom";

// function formatDate(dateString) {
//   const date = new Date(dateString);
//   return format(date, 'dd/MM/yyyy');
// }

const Header = () => {
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  let tempIdCounter = 0;

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.user_id);
    }
  }, []);

  const toggleUserPopup = () => {
    setIsUserPopupOpen(!isUserPopupOpen);
    setIsNotificationPopupOpen(false);
  };

  const toggleNotificationPopup = () => {
    setIsNotificationPopupOpen(!isNotificationPopupOpen);
    setIsUserPopupOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/dang-nhap");
    setIsUserPopupOpen(false);
  };

  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await fetchNotifications(userId, pagination.page, pagination.size);
    if (data) {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...data.notifications,
      ]);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      }));
    } else {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, pagination.page]);

  const loadMore = () => {
    if (pagination.page + 1 < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  useEffect(() => {
    const count = notifications.filter((notification) => !notification.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      if (payload && payload.data && payload.data.message) {
        console.log("Message received: ", payload.data.message);
        toast.info(payload.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const newNotification = {
          id: `temp-${Date.now()}-${tempIdCounter++}`,
          message: payload.data.message,
          isRead: false,
          createdAt: Date.now()
        };

        setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
        setUnreadCount((prevCount) => prevCount + 1);
      } else {
        console.error("Invalid payload: ", payload);
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="flex justify-between items-center bg-blue-900 text-white p-4 shadow-md relative sticky top-0 z-50">
      {/* Logo and Menu */}
      <div className="flex items-center space-x-3">
        <FaBars className="text-xl cursor-pointer" />
        <Link to={"/"} className="text-xl font-bold">JobSearch</Link>
      </div>

      {/* Notification and User Avatar */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <div className="relative">
          <FaBell
            className="text-xl cursor-pointer"
            onClick={toggleNotificationPopup}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          {isNotificationPopupOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <span className="font-semibold text-gray-800">Thông báo</span>
                <button
                  onClick={() => setIsNotificationPopupOpen(false)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Đóng
                </button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {loading && pagination.page === 0 ? (
                  <div className="text-center text-gray-500">Đang tải...</div>
                ) : notifications.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center">
                    Hiện không có thông báo nào.
                  </div>
                ) : (
                  <>
                    <ul className="space-y-2">
                      {notifications.map((notification, index) => (
                        <div
                          key={notification.id || index}
                          className="mb-3 p-3 hover:bg-green-50 rounded-lg group"
                        >
                          <h4 className="font-medium text-gray-900 group-hover:text-green-600">
                            {notification.message}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      ))}
                    </ul>
                    {pagination.page + 1 < pagination.totalPages && (
                      <div className="text-center mt-4">
                        <button
                          onClick={loadMore}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Tải thêm
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Icon */}
        <div className="relative">
          <FaUserCircle
            className="text-2xl cursor-pointer"
            onClick={toggleUserPopup}
          />
          {isUserPopupOpen && (
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
