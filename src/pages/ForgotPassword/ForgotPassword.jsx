import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { resetPasswordRequest } from "../../utils/ApiFunctions";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleResetPassword = async () => {
    setMessage(""); // Xóa thông báo trước đó
    setIsError(false);
    if (!email.trim()) {
      setMessage("Vui lòng nhập email.");
      setIsError(true);
      return;
    }

    const result = await resetPasswordRequest(email);
    if (result.error) {
      setMessage("Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.");
      setIsError(true);
    } else {
      setMessage("Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 -mt-72">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Quên mật khẩu</h2>
          <div className="mb-4 text-left relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-5 text-gray-500" />
            <input
              type="email"
              id="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          {message && (
            <p className={`text-sm mb-4 text-left ${isError ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </p>
          )}
          <p className="text-sm text-gray-600 mb-4 text-left">
            Bằng việc thực hiện đổi mật khẩu, bạn đã đồng ý với{' '}
            <Link to="#" className="text-green-600 underline">
              Điều khoản dịch vụ
            </Link>{' '}
            và{' '}
            <Link to="#" className="text-green-600 underline">
              Chính sách bảo mật
            </Link>{' '}
            của chúng tôi.
          </p>
          <button
            onClick={handleResetPassword}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-200"
          >
            Tạo lại mật khẩu
          </button>
          <div className="flex justify-between mt-4 text-sm">
            <Link to="/dang-nhap" className="text-green-600 hover:underline">
              Quay lại đăng nhập
            </Link>
            <Link to="/dang-ki" className="text-green-600 hover:underline">
              Đăng kí tài khoản mới
            </Link>
          </div>
        </div>
      </div>

      <div
        className="hidden md:flex w-full md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/register.webp')" }}
      />
    </div>
  );
};

export default ForgotPassword;
