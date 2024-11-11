import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signUpUser } from '../../utils/ApiFunctions';

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setSuccessMessage('');
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: "ROLE_JOB_SEEKER",
      };

      const response = await signUpUser(userData);
      setSuccessMessage("Đăng ký thành công! Bạn có thể đăng nhập.");
      setError('');
    } catch (err) {
      console.log("Error11", err);
      if (err.error.password) {
        setError(
          err.error.password
        ); // Handle object error
      } else if (typeof err === 'object' && err.error) {
        setError(err.error || 'Đăng ký thất bại, vui lòng thử lại.');
      } else {
        setError(err || 'Đăng ký thất bại, vui lòng thử lại.');
      }
      setSuccessMessage('');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex w-full min-h-screen bg-white">
        <div className="flex w-full md:w-1/2 justify-center p-14">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-center">Chào mừng bạn đến với ....</h2>
            <p className="text-center text-gray-600">Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 relative">
                <FontAwesomeIcon icon={faUser} className="absolute left-3 top-5 text-gray-500" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded mt-2"
                  placeholder="Nhập họ tên"
                  required
                />
              </div>
              <div className="mb-4 relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded mt-2"
                  placeholder="Nhập email"
                  required
                />
              </div>
              <div className="mb-4 relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-5 text-gray-500" />
                <input
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded mt-2"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button type="button" onClick={() => togglePasswordVisibility('password')} className="absolute right-3 top-5">
                  <FontAwesomeIcon icon={showPassword.password ? faEye : faEyeSlash} className="text-gray-500" />
                </button>
              </div>
              <div className="mb-4 relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-5 text-gray-500" />
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded mt-2"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
                <button type="button" onClick={() => togglePasswordVisibility('confirmPassword')} className="absolute right-3 top-5">
                  <FontAwesomeIcon icon={showPassword.confirmPassword ? faEye : faEyeSlash} className="text-gray-500" />
                </button>
              </div>

              {error && <p className="text-red-500">{error}</p>}
              {successMessage && <p className="text-green-500">{successMessage}</p>}

              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox" required />
                  <span className="ml-2">Tôi đã đọc và đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của ...</span>
                </label>
              </div>
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
                Đăng ký
              </button>
            </form>
            <div className="flex items-center justify-center mt-6">
              <span className="text-gray-600">Hoặc đăng nhập bằng</span>
            </div>
            <div className="flex justify-between mt-4">
              <button className="bg-red-500 text-white w-full py-2 mx-1 rounded-lg">Google</button>
            </div>
            <div className="mt-6 text-center">
              Bạn đã có tài khoản ?
              <Link to={"/dang-nhap"} className="text-green-600"> Đăng nhập ngay</Link>
            </div>
          </div>
        </div>

        <div
          className="hidden md:flex w-1/2 bg-cover bg-center min-h-screen"
          style={{ backgroundImage: "url('/register.webp')" }}
        ></div>
      </div>
    </div>
  );
};

export default RegistrationForm;
