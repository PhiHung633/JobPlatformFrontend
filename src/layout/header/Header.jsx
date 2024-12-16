import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBell,
  faBriefcase,
  faBuilding,
  faCheckToSlot,
  faChevronRight,
  faEnvelope,
  faFile,
  faHeart,
  faLaptopCode,
  faMedal,
  faMessage,
  faShield,
  faSquare,
  faStar,
  faBars,
  faGear,
  faMagnifyingGlass,
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";

import { onMessage } from "firebase/messaging";
import { messaging } from '../../utils/firebase.js'

import DropdownItem from "../../components/DropdownItem/DropdownItem";
import { fetchNotifications, fetchUserById } from "../../utils/ApiFunctions";


function formatDate(dateString) {
  const date = new Date(dateString);
  return format(date, 'dd/MM/yyyy');
}

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [errortb, setErrorTB] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [currentRole, setCurrentRole] = useState("")
  const navigate = useNavigate();
  let tempIdCounter = 0;

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.user_id);
      setIsLoggedIn(true);
      setUserEmail(decodedToken.sub);
      setCurrentRole(decodedToken.role)
    } else {
      setIsLoggedIn(false);
      setUserId("");
      setUserEmail("");
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.sub);
      setUserId(decodedToken.user_id);
    } else {
      setIsLoggedIn(false);
    }
  }, [localStorage.getItem("accessToken")]);

  const toggleDropdown = (menu) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path, subPaths = []) => {
    return location.pathname === path || subPaths.includes(location.pathname) ? "text-green-600" : "";
  };

  const fetchUser = async () => {
    const { data, error } = await fetchUserById(userId);
    if (data) {
      setUserName(data.fullName)
      setAvatar(data.avatarUrl)
    } else {
      setError(error);
    }
  }


  const fetchData = async () => {
    const { data, error } = await fetchNotifications(userId, pagination.page, pagination.size);
    if (data) {
      setNotifications(data.notifications);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      }));
    } else {
      setErrorTB(error);
    }
  };


  useEffect(() => {
    const count = notifications.filter((notification) => !notification.isRead).length;
    setUnreadCount(count);
  }, [notifications]);


  const loadMore = () => {
    if (pagination.page + 1 < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };


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

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.sub);
      fetchUser();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchUser();
      fetchData();
    } else {
      setUserName("");
      setNotifications([]);
      setUnreadCount(0);
      setPagination({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0,
      });
    }
  }, [isLoggedIn, userId]);

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm px-4">
      <div className="flex items-center justify-between">
        <Link to={"/"}>
          <div className="flex items-center">
            <img
              src="/logo.jpg"
              alt="Tuyen dung"
              className=" w-40 h-20 cursor-pointer"
            />
          </div>
        </Link>

        <ul className="hidden lx:flex items-center gap-10">
          <Link to={"/"} >
            <li className={`relative group text-center font-semibold text-base cursor-pointer ${isActive("/", ["/viec-lam-da-ung-tuyen", "/viec-lam-da-luu", "/viec-lam-phu-hop", "/viec-lam-it", "/viec-lam-senior"])}`}>
              Việc làm
              <div className="absolute top-full left-0 bg-white rounded-lg py-2 px-3 w-80 opacity-0 invisible transform translate-y-2 transition ease-in-out duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                <ul>
                  <DropdownItem icon={faMagnifyingGlass} text="Tìm việc làm" to="/" isActive={location.pathname === "/"} />
                  <hr className="border-t-2 my-2" />
                  <DropdownItem icon={faBriefcase} text="Việc làm đã ứng tuyển" to="/viec-lam-da-ung-tuyen" isActive={location.pathname === "/viec-lam-da-ung-tuyen"} />
                  <DropdownItem icon={faHeart} text="Việc làm đã lưu" to="/viec-lam-da-luu" isActive={location.pathname === "/viec-lam-da-luu"} />
                  <DropdownItem icon={faCheckToSlot} text="Việc làm phù hợp" to="/viec-lam-phu-hop" isActive={location.pathname === "/viec-lam-phu-hop"} />
                </ul>
              </div>
            </li>
          </Link>
          <Link to={"/mau-cv"}>
            <li className={`relative group text-center font-semibold text-base cursor-pointer ${isActive("/mau-cv", ["/tao-cv", "/quan-ly-cv", "/mau-cv", "/tai-cv"])}`}>
              Hồ sơ & CV
              <div className="absolute top-full left-0 bg-white rounded-lg py-2 px-3 w-80 opacity-0 invisible transform translate-y-2 transition ease-in-out duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                <ul>
                  <DropdownItem icon={faFile} text="Tạo CV" to="/tao-cv" isActive={location.pathname === "/tao-cv"} />
                  <DropdownItem icon={faFile} text="CV của tôi" to="/cv-cua-toi" isActive={location.pathname === "/cv-cua-toi"} />
                  <hr className="border-t-2 my-2" />
                  <DropdownItem icon={faFile} text="Tải CV lên" to="/tai-cv" isActive={location.pathname === "/tai-cv"} />
                </ul>
              </div>
            </li>
          </Link>
          <Link to={"/cong-ti"}>
            <li className={`relative group text-center font-semibold text-base cursor-pointer ${isActive("/cong-ti", ["/top-cong-ti"])}`}>
              Công ty
              <div className="absolute top-full left-0 bg-white rounded-lg py-2 px-3 w-80 opacity-0 invisible transform translate-y-2 transition ease-in-out duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                <ul>
                  <DropdownItem icon={faBuilding} text="Danh sách công ty" to="/cong-ti" isActive={location.pathname === "/cong-ti"} />
                  <DropdownItem icon={faStar} text="Top công ty" to="/top-cong-ti" isActive={location.pathname === "/top-cong-ti"} />
                </ul>
              </div>
            </li>
          </Link>
        </ul>

        <ul className="hidden lx:flex items-center space-x-5">
          {isLoggedIn ? (
            <>
              <li className="relative">
                <button
                  onClick={togglePopup}
                  className="flex items-center justify-center w-9 h-9 bg-green-100 rounded-full text-green-600"
                >
                  <FontAwesomeIcon icon={faBell} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Popup */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-80 h-44 overflow-y-auto bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Thông báo</span>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-sm text-green-600 hover:underline"
                      >
                        Đánh dấu là đã đọc
                      </button>
                    </div>
                    <div className="p-4">
                      {errortb && (
                        <div className="text-red-500 text-sm">
                          Không thể tải thông báo. Vui lòng thử lại.
                        </div>
                      )}
                      {notifications.length === 0 && !error && (
                        <div className="text-sm text-gray-500 text-center">
                          Hiện không có thông báo nào.
                        </div>
                      )}
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
                      {pagination.page + 1 < pagination.totalPages && (
                        <button
                          onClick={loadMore}
                          className="mt-2 w-full text-green-600 text-sm hover:underline"
                        >
                          Xem thêm
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
              <li className="relative group">
                <a className="flex items-center justify-center w-9 h-9 bg-green-100 rounded-full text-green-600">
                  <FontAwesomeIcon icon={faMessage} />
                </a>
              </li>
              <li className="relative group">
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full object-cover cursor-pointer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://media4.giphy.com/media/xTk9ZvMnbIiIew7IpW/giphy.gif?cid=6c09b952souzn361oda9jrwdqfbhyupzrijte9zxczqrfh69&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g";
                  }}
                />
                <div className="absolute right-0 mt-1 w-80 bg-white rounded-lg py-4 px-5 opacity-0 invisible transform -translate-y-5 transition ease-in-out duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                  <div className="flex items-center mb-4">
                    <img
                      src={avatar}
                      alt="User Avatar"
                      className="mr-2 w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://media4.giphy.com/media/xTk9ZvMnbIiIew7IpW/giphy.gif?cid=6c09b952souzn361oda9jrwdqfbhyupzrijte9zxczqrfh69&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g";
                      }}
                    />
                    <div>
                      <p className="font-semibold">{userName}</p>
                      <p className="text-xs text-gray-500">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  <ul>
                    <DropdownItem icon={faGear} text="Cài đặt thông tin cá nhân" to={"/cai-dat-thong-tin-ca-nhan"} />
                    <DropdownItem icon={faShield} text="Đổi mật khẩu" to={"/doi-mat-khau"} />
                    {currentRole === "ROLE_RECRUITER" && (
                      <DropdownItem
                        icon={faBriefcase}
                        text="Trang nhà tuyển dụng"
                        to={"/dashboard"}
                      />
                    )}
                    {currentRole === "ROLE_ADMIN" && (
                      <DropdownItem
                        icon={faUserCog}
                        text="Trang quản trị"
                        to={"/admin"}
                      />
                    )}
                    <DropdownItem icon={faArrowRightFromBracket} text="Đăng xuất" onClick={() => {
                      localStorage.removeItem("accessToken");
                      localStorage.removeItem("refreshToken");
                      navigate("/dang-nhap");
                    }} />
                  </ul>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={"/dang-nhap"} className="border border-green-600 bg-white
                 text-green-600 py-2 px-14 rounded transition  duration-300 hover:bg-green-100 hover:text-green-500">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link to={"/dang-ki"} className="bg-green-600 text-white py-2 px-10 rounded 
                  transition duration-300 hover:bg-green-700">
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link to={"/dang-ki-danh-cho-nha-tuyen-dung"} className="bg-black text-white py-2 px-10 rounded 
                  transition duration-300 hover:bg-green-700">
                  Đăng tuyển & tìm hồ sơ
                </Link>
              </li>
            </>
          )}
        </ul>

        <button onClick={toggleMenu} className="lx:hidden text-xl">
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {menuOpen && (
        <div className="lx:hidden bg-white shadow-md rounded-b-lg mt-2 p-4">
          {isLoggedIn ? (
            <div className="mt-4">
              <div className="flex items-center mb-4" onClick={() => toggleDropdown("profile")}>
                <img
                  src={avatar}
                  alt="Avatar"
                  className="mr-2 w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://media4.giphy.com/media/xTk9ZvMnbIiIew7IpW/giphy.gif?cid=6c09b952souzn361oda9jrwdqfbhyupzrijte9zxczqrfh69&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g";
                  }
                  }
                />
                <div>
                  <p className="font-semibold">Phi Hùng</p>
                  <p className="text-xs text-gray-500">
                    Mã ứng viên: <span className="font-bold">#3666666</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    nguyenhoangphihung633@gmail.com
                  </p>
                </div>
              </div>
              {dropdownOpen.profile && (
                <ul>
                  <DropdownItem icon={faEnvelope} text="Tin nhắn" />
                  <DropdownItem icon={faFile} text="Hồ sơ của tôi" />
                  <DropdownItem icon={faSquare} text="Thông báo" />
                  <DropdownItem icon={faShield} text="Bảo mật" />
                  <DropdownItem icon={faGear} text="Cài đặt tài khoản" />
                  <DropdownItem icon={faArrowRightFromBracket} text="Đăng xuất" />
                </ul>
              )}
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <a href="#" className="flex items-center justify-between w-full text-green-600">
                Đăng nhập
              </a>
              <a href="#" className="flex items-center justify-between w-full text-green-600">
                Đăng ký
              </a>
            </div>
          )}
          <hr className="border-t-2 my-2" />
          <ul className="space-y-4">
            <li className="relative group text-left font-semibold text-sm cursor-pointer list-none mb-5">
              <div
                className="flex items-center justify-between w-full text-green-600"
                onClick={() => toggleDropdown("vieclam")}
              >
                Việc làm
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`transform transition-transform duration-200 ${dropdownOpen.vieclam ? "rotate-90" : ""
                    }`}
                />
              </div>
              {dropdownOpen.vieclam && (
                <ul className="ml-4 mt-2 space-y-2">
                  <DropdownItem icon={faMagnifyingGlass} text="Tìm việc làm" />
                  <DropdownItem
                    icon={faBriefcase}
                    text="Việc làm đã ứng tuyển"
                  />
                  <DropdownItem icon={faHeart} text="Việc làm đã lưu" />
                  <DropdownItem icon={faCheckToSlot} text="Việc làm phù hợp" />
                  <DropdownItem icon={faLaptopCode} text="Việc làm IT" />
                  <DropdownItem icon={faMedal} text="Việc làm Senior" />
                </ul>
              )}
            </li>
            <li className="relative group text-left font-semibold text-sm cursor-pointer list-none mb-5">
              <div
                className="flex items-center justify-between w-full text-green-600"
                onClick={() => toggleDropdown("hosocv")}
              >
                Hồ sơ & CV
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`transform transition-transform duration-200 ${dropdownOpen.hosocv ? "rotate-90" : ""
                    }`}
                />
              </div>
              {dropdownOpen.hosocv && (
                <ul className="ml-4 mt-2 space-y-2">
                  <DropdownItem icon={faFile} text="Tạo CV" />
                  <DropdownItem icon={faFile} text="Quản lý CV" />
                  <DropdownItem icon={faFile} text="Mẫu CV" />
                  <DropdownItem icon={faFile} text="Tải CV lên" />
                </ul>
              )}
            </li>

            <li className="relative group text-left font-semibold text-sm cursor-pointer list-none mb-5">
              <div
                className="flex items-center justify-between w-full text-green-600"
                onClick={() => toggleDropdown("congty")}
              >
                Công ty
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`transform transition-transform duration-200 ${dropdownOpen.congty ? "rotate-90" : ""
                    }`}
                />
              </div>
              {dropdownOpen.congty && (
                <ul className="ml-4 mt-2 space-y-2">
                  <DropdownItem icon={faBuilding} text="Danh sách công ty" />
                  <DropdownItem icon={faStar} text="Top công ty" />
                </ul>
              )}
            </li>

            <hr className="border-t-2 my-2" />
            <li className="group text-left font-semibold text-sm cursor-pointer list-none">
              <div
                className="flex items-center justify-between w-full text-green-600"
              >
                Đăng tuyển dụng
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
