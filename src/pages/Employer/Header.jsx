import { useState, useEffect, useRef } from "react";
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt, FaFacebookMessenger } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { format } from 'date-fns';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { onMessage } from "firebase/messaging";
import { messaging } from '../../utils/firebase.js'
import { fetchNotifications, markReadNotification } from "../../utils/ApiFunctions";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faMessage } from "@fortawesome/free-solid-svg-icons";


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
  const [selectedNotiId, setSelectedNotiId] = useState(null);
  const bottomRef = useRef(null);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);


  const toggleMenuNoti = (notiId) => {
    setSelectedNotiId((prevId) => (prevId === notiId ? null : notiId));
  };
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationPopupOpen(false);
        setSelectedNotiId(null);
      }
    };

    if (isNotificationPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationPopupOpen]);

  const loadMore = () => {
    if (pagination.page + 1 < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.page + 1 < pagination.totalPages) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [pagination.page, pagination.totalPages]);

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

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotis = notifications.filter(noti => !noti.isRead);
      await Promise.all(
        unreadNotis.map(noti => markReadNotification(noti.id, true))
      );

      setNotifications(prev =>
        prev.map(noti =>
          !noti.isRead ? { ...noti, isRead: true } : noti
        )
      );
      fetchData();

    } catch (error) {
      console.log("Lỗi khi đánh dấu tất cả là đã đọc:", error);
    }
  }

  const handleIsReadNotification = async (id, isRead) => {
    const newIsRead = !isRead;  // Toggle the isRead state
    const response = await markReadNotification(id, newIsRead);
    if (!response.error) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((noti) =>
          noti.id === id ? { ...noti, isRead: newIsRead } : noti
        )
      );
      fetchData();
      setSelectedNotiId(null);
    } else {
      console.log("Lỗi khi đánh dấu thông báo", response.error);
    }
  };

  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-3 shadow-lg sticky top-0 z-50">
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
            className="text-xl cursor-pointer hover:text-blue-300 transition duration-200"
            onClick={toggleNotificationPopup}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          {isNotificationPopupOpen && (
            <div ref={notificationRef} className="absolute right-0 mt-3 w-80 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-200 z-50">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <span className="font-semibold text-gray-800">Thông báo</span>
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Đánh dấu là đã đọc
                </button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {pagination.size === 0 ? (
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
                          className="relative mb-3 p-3 hover:bg-green-50 rounded-lg group"
                        >
                          <div className="flex justify-between">
                            <Link to={notification.link} onClick={(e) => {
                              if (!notification.isRead) {
                                e.preventDefault();
                                handleIsReadNotification(notification.id, notification.isRead);
                              }
                            }} className="flex-1">
                              <h4 className={`${!notification.isRead ? 'font-bold text-gray-900' : 'font-normal text-gray-700'} group-hover:text-green-600`}>
                                {notification.message}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {new Date(notification.createdAt).toLocaleDateString('en-GB')}
                              </p>
                            </Link>

                            <FontAwesomeIcon
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleMenuNoti(notification.id);
                              }}
                              className="mt-12 opacity-0 group-hover:opacity-100 transition-opacity right-0 cursor-pointer"
                              icon={faEllipsis}
                            />
                          </div>
                          {selectedNotiId === notification.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg text-sm z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleIsReadNotification(notification.id, notification.isRead);
                                  setSelectedNotiId(null);
                                }}
                                className="block w-full px-4 py-2 hover:bg-gray-700"
                              >
                                {notification.isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </ul>
                    {/* {pagination.page + 1 < pagination.totalPages && (
                      <div className="text-center mt-4">
                        <button
                          onClick={loadMore}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Tải thêm
                        </button>
                      </div>
                    )} */}
                    <div ref={bottomRef}></div>

                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <div>
          <Link to={"/tin-nhan"} className="">
            <FontAwesomeIcon icon={faMessage} />
          </Link>
        </div>
        {/* User Icon */}
        <div className="relative">
          <FaUserCircle
            className="text-2xl cursor-pointer hover:text-blue-300 transition duration-200"
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
