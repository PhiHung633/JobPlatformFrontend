import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useEffect } from 'react';

import Header from './Header';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;
  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(accessToken);

  const idCompany = "1000"; 

  useEffect(() => {
    if (!idCompany) {
      navigate('/dashboard/them-cong-ti');
    }
  }, [idCompany, navigate]); 

  return (
    <>
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white p-6 shadow-lg border-r border-gray-200">
          {/* User Info Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <div className="font-bold text-gray-800">{decodedToken.sub}</div>
                <div className="text-sm text-gray-500">Employer</div>
              </div>
            </div>
          </div>
          <hr className="w-full mt-2 mb-2" />
          {/* Sidebar Links */}
          <ul className="space-y-4">
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
            {/* <li>
              <Link
                to={`/dashboard/them-cong-ti/${idCompany}`}
                className={`${isActive('/dashboard/them-cong-ti') ? 'text-blue-600 font-semibold bg-gray-100' : 'text-gray-800'
                  } block px-4 py-2 rounded-lg hover:bg-gray-100`}
              >
                Công ti của tôi
              </Link>
            </li> */}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-5 bg-gray-200">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
