import { useState } from "react";
import { Link } from 'react-router-dom';

import { provinces } from "../../components/Province/Provinces";

const EmployerRegistrationForm = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToFinalTerms, setAgreedToFinalTerms] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Hàm xử lý khi chọn tỉnh/thành phố
  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    setSelectedProvince(provinceName);
    
    // Tìm các quận/huyện tương ứng
    const selected = provinces.find((province) => province.name === provinceName);
    setDistricts(selected ? selected.districts : []);
    setSelectedDistrict(""); // Reset quận/huyện khi thay đổi tỉnh/thành phố
  };

  // Hàm xử lý khi chọn quận/huyện
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms || !agreedToFinalTerms) {
      alert("You must agree to the terms to continue.");
      return;
    }
    alert("Form submitted!");
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Form Section */}
      <div className="flex flex-col justify-start items-center w-full md:w-2/3 lg:w-2/3 bg-white p-8 pt-12 overflow-y-auto">
        <h1 className="text-2xl font-bold text-green-700 mb-2 text-center">
          Đăng ký tài khoản Nhà tuyển dụng
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng.
        </p>

        <div className="w-3/4 bg-green-100 border border-green-500 p-4 rounded-lg mb-6">
          <h2 className="text-green-700 font-semibold mb-2">Quy định</h2>
          <p className="text-sm text-gray-700">
            Để đảm bảo chất lượng dịch vụ, chúng tôi không cho phép một người dùng tạo nhiều tài khoản khác nhau.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-3/4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Tài khoản</h3>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={() => setAgreedToTerms(!agreedToTerms)}
              className="mr-2"
            />
            <label className="text-sm text-gray-600">
              Tôi đã đọc và đồng ý với{" "}
              <span className="text-blue-500 underline cursor-pointer">Điều khoản dịch vụ</span>{" "}
              và <span className="text-blue-500 underline cursor-pointer">Chính sách bảo mật</span>.
            </label>
          </div>

          <button
            type="button"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4"
          >
            Đăng ký bằng Google
          </button>
          <p className="text-center text-sm text-gray-500 mb-4">Hoặc bằng email</p>

          <input
            type="email"
            placeholder="Email đăng nhập"
            required
            className="w-full p-3 border rounded-lg text-sm"
          />
          <input
            type="password"
            placeholder="Mật khẩu (từ 6 đến 25 ký tự)"
            required
            className="w-full p-3 border rounded-lg text-sm"
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            required
            className="w-full p-3 border rounded-lg text-sm"
          />

          <h3 className="text-lg font-semibold text-gray-700 mt-6">Thông tin nhà tuyển dụng</h3>

          <input
            type="text"
            placeholder="Họ và tên"
            required
            className="w-full p-3 border rounded-lg text-sm"
          />
          <div className="flex items-center mb-4">
            <label className="text-gray-600 text-sm mr-4">Giới tính:</label>
            <input type="radio" name="gender" className="mr-2" /> Nam
            <input type="radio" name="gender" className="ml-6 mr-2" /> Nữ
          </div>
          <input
            type="text"
            placeholder="Số điện thoại cá nhân"
            required
            className="w-full p-3 border rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Công ty"
            required
            className="w-full p-3 border rounded-lg text-sm"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
              value={selectedProvince}
              onChange={handleProvinceChange}
              className="p-3 border rounded-lg text-sm"
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>

            {/* Select Box Quận/Huyện */}
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="p-3 border rounded-lg text-sm"
              disabled={!selectedProvince} // Disable khi chưa chọn tỉnh/thành phố
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={agreedToFinalTerms}
              onChange={() => setAgreedToFinalTerms(!agreedToFinalTerms)}
              className="mr-2"
            />
            <label className="text-sm text-gray-600">
              Tôi đã đọc và đồng ý với{" "}
              <span className="text-blue-500 underline cursor-pointer">Điều khoản dịch vụ</span>{" "}
              và <span className="text-blue-500 underline cursor-pointer">Chính sách bảo mật</span>.
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mt-6"
          >
            Hoàn tất
          </button>
          <div className="mt-6 text-center">
            Bạn đã có tài khoản ?
            <Link to={"/dang-nhap"} className="text-green-600"> Đăng nhập ngay</Link>
          </div>
        </form>
      </div>

      {/* Image Section */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center min-h-screen"
        style={{ backgroundImage: "url('register.webp')" }}
      ></div>
    </div>
  );
};

export default EmployerRegistrationForm;
