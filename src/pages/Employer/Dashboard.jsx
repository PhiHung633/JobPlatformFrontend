import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from 'react';


import Header from './Header';
import { fetchUserById, processMomoPayment } from '../../utils/ApiFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;
  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(accessToken);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [amountToDeposit, setAmountToDeposit] = useState("");

  const idCompany = "1000";

  useEffect(() => {
    if (!idCompany) {
      navigate('/dashboard/them-cong-ti');
    }
  }, [idCompany, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.user_id;
          setUserId(userId);

          const { data, error } = await fetchUserById(userId);
          if (data) {
            setUserData(data);
          } else {
            setError(error);
          }
        } catch (err) {
          console.error("Error decoding token or fetching user:", err);
          setError("Failed to fetch user data.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  const handlePayment = async () => {
    if (!amountToDeposit || parseInt(amountToDeposit.replace(/\D/g, ""), 10) <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    const paymentData = {
      amount: parseInt(amountToDeposit.replace(/\D/g, ""), 10),
      account: userData?.email,
    };

    try {
      const { data, error } = await processMomoPayment(paymentData);

      if (error) {
        alert(`Thanh toán thất bại: ${error.message || "Có lỗi xảy ra."}`);
        return;
      }

      if (data?.shortLink) {
        alert("Đang chuyển hướng đến cổng thanh toán...");
        window.location.href = data.shortLink;
        setShowModal(false);
      } else {
        alert("Không tìm thấy liên kết thanh toán.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Có lỗi xảy ra trong quá trình xử lý thanh toán.");
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return parseInt(value.replace(/\D/g, ""), 10).toLocaleString("vi-VN");
  };

  return (
    <>
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 min-h-screen bg-white p-6 shadow-lg border-r border-gray-200">
          {/* User Info Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <div className="font-bold text-gray-800">{decodedToken.sub}</div>
                <div className="text-sm text-gray-500">Employer</div>
              </div>
            </div>
            <div className='flex items-center'>
              Số lần còn lại để đăng tin:{" "}
              {isLoading
                ? "Đang tải..."
                : userData?.availableJobPosts || "Không có dữ liệu"}
              <FontAwesomeIcon className='ml-2 cursor-pointer' icon={faPlus} onClick={() => setShowModal(true)}
              />
            </div>
          </div>
          <hr className="w-full mt-2 mb-2" />
          {/* Sidebar Links */}
          <ul className="space-y-4 w-60">
            <li>
              <Link
                to="/dashboard"
                className={`${isActive('/dashboard') ? 'text-blue-600 font-semibold bg-gray-100' : 'text-gray-800'
                  } block px-4 py-2 rounded-lg hover:bg-gray-100`}
              >
                Bảng tin
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/quan-li-cong-viec"
                className={`${isActive('/dashboard/quan-li-cong-viec') ? 'text-blue-600 font-semibold bg-gray-100' : 'text-gray-800'
                  } block px-4 py-2 rounded-lg hover:bg-gray-100`}
              >
                Quản lý tuyển dụng
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/tao-cong-viec"
                className={`${isActive('/dashboard/tao-cong-viec') ? 'text-blue-600 font-semibold bg-gray-100' : 'text-gray-800'
                  } block px-4 py-2 rounded-lg hover:bg-gray-100`}
              >
                Tạo tin tuyển dụng mới
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/quan-li-cv"
                className={`${isActive('/dashboard/quan-li-cv') ? 'text-blue-600 font-semibold bg-gray-100' : 'text-gray-800'
                  } block px-4 py-2 rounded-lg hover:bg-gray-100`}
              >
                Quản lý CV ứng viên
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/cong-ti-cua-toi"
                className={`${isActive('/dashboard/cong-ti-cua-toi') ? 'text-blue-600 font-semibold bg-gray-100' : 'text-gray-800'
                  } block px-4 py-2 rounded-lg hover:bg-gray-100`}
              >
                Công ty của tôi
              </Link>
            </li>
          </ul>
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-lg w-96 p-6">
              <h3 className="text-xl font-semibold text-gray-800">Nạp tiền</h3>
              <p className="mt-4 text-sm font-semibold text-red-600">
                (*) Lưu ý: Với <span className="text-blue-500 font-bold">100.000 VNĐ</span>, bạn sẽ được một lần đăng tin
              </p>
              <p className="mt-4 text-gray-600">Nhập số tiền bạn muốn nạp:</p>
              <input
                type="text"
                value={amountToDeposit}
                onChange={(e) => {
                  const formattedValue = formatCurrency(e.target.value);
                  setAmountToDeposit(formattedValue);
                }}
                placeholder="Số tiền"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={handlePayment}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                >
                  Thanh toán
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Main Content */}
        <div className="flex-1 p-3 bg-gray-200">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;